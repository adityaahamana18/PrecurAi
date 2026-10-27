"""
Unit & Integration Tests for PNGRB Incident Report Ingestion Pipeline.
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.database import Base, get_db
from backend.document_processing.schema import PageText, SourceReference
from backend.document_processing.source_tracker import SourceTracker
from backend.document_processing.report_parser import PNGRBReportParser

# In-memory SQLite with StaticPool so all thread requests share the same DB
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


client = TestClient(app)


def test_source_tracker():
    tracker = SourceTracker("test_report.pdf")
    ref = tracker.make_reference(2)
    assert ref.filename == "test_report.pdf"
    assert ref.page == 2

    pages = [
        PageText(page_number=1, text="Executive Summary of incident", char_count=30),
        PageText(page_number=2, text="Root cause was confined space gas entry", char_count=40),
    ]
    page_num = tracker.locate_phrase_page(pages, "confined space", default_page=1)
    assert page_num == 2


def test_report_parser_must_not_automatically_label():
    pages = [
        PageText(
            page_number=1,
            text="""
            PNGRB Incident Investigation Report
            Date: 15/04/2025
            Location: Gujarat Pipeline District
            Operator: GAIL India
            Pipeline Type: Natural Gas Trunkline

            Executive Summary
            Gas leak occurred during maintenance work on natural gas pipeline.

            Findings / Observations
            - Hot work was started near natural gas line without proper gas testing.
            - Maintenance team failed to perform LOTO energy isolation.

            Root Cause Analysis
            - Inadequate permit to work oversight and non-compliance with LOTO procedure.

            Casualties
            0 fatalities, 1 injury

            Recommendations / Corrective Actions
            - Enforce mandatory LOTO isolation and gas testing prior to hot work.
            """,
            char_count=500
        )
    ]

    parser = PNGRBReportParser("sample_report.pdf", pages, is_scanned=False)
    extracted = parser.parse()

    # CRITICAL SECURITY/COMPLIANCE CHECK: Must NOT automatically label report as SIF
    assert extracted.sif_assessment.status == "NOT_AUTOMATICALLY_LABELED"
    assert "GAIL" in extracted.overview.operator_company
    assert extracted.overview.pipeline_type == "Cross-Country Natural Gas Pipeline"
    assert extracted.casualties.injuries == 1
    assert extracted.casualties.fatalities == 0
    assert len(extracted.findings) >= 1
    assert any(lsr.rule in ["Energy Isolation", "Hot Work"] for lsr in extracted.life_saving_rules)
    assert extracted.findings[0].source.page == 1
    assert extracted.findings[0].source.filename == "sample_report.pdf"


def test_api_pngrb_routes_empty():
    res = client.get("/api/pn-grb/reports")
    assert res.status_code == 200
    assert res.json() == []


def test_api_pngrb_page_not_found():
    res = client.get("/api/pn-grb/reports/999/pages/1")
    assert res.status_code == 404
