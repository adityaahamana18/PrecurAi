"""
Backend Integration Tests for PrecurAi Document File Upload Pipeline (/api/analyze-file).
Tests multi-format file extraction (PDF, DOCX, TXT), invalid extension rejection, empty file handling,
and source document traceability metadata generation.
"""

import io
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_pdf_file_upload_and_analysis():
    import fitz  # PyMuPDF
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Rigger was standing directly under a 12-ton suspended load during crane lifting operations on FPSO Deck B without tag line.")
    pdf_bytes = doc.tobytes()
    doc.close()

    response = client.post(
        "/api/analyze-file",
        files={"file": ("lifting_incident_report.pdf", pdf_bytes, "application/pdf")},
        data={"site_location": "FPSO Deck B", "unit_department": "Lifting Operations"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "sif_potential" in data
    assert data["sif_potential"] == "HIGH"
    assert "source_document" in data
    assert data["source_document"]["filename"] == "lifting_incident_report.pdf"
    assert data["source_document"]["file_type"] == "pdf"
    assert data["source_document"]["total_pages"] == 1
    assert "report_id" in data


def test_docx_file_upload_and_analysis():
    import docx
    doc = docx.Document()
    doc.add_paragraph("Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified. Residual pressure was 140 PSI.")
    bio = io.BytesIO()
    doc.save(bio)
    docx_bytes = bio.getvalue()

    response = client.post(
        "/api/analyze-file",
        files={"file": ("loto_breach.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        data={"site_location": "Gas Processing Plant", "unit_department": "Maintenance"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["sif_potential"] == "HIGH"
    assert data["source_document"]["filename"] == "loto_breach.docx"
    assert data["source_document"]["file_type"] == "docx"


def test_txt_file_upload_and_analysis():
    txt_content = b"Scaffolder working at 6m height on platform piping rack without harness tie-off lanyard attached to anchor point."

    response = client.post(
        "/api/analyze-file",
        files={"file": ("scaffold_observation.txt", txt_content, "text/plain")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["sif_potential"] == "HIGH"
    assert data["source_document"]["filename"] == "scaffold_observation.txt"
    assert data["source_document"]["file_type"] == "txt"


def test_unsupported_file_extension_rejection():
    exe_content = b"MZ\x90\x00\x03\x00\x00\x00"

    response = client.post(
        "/api/analyze-file",
        files={"file": ("binary_executable.exe", exe_content, "application/octet-stream")}
    )

    assert response.status_code == 400
    detail = response.json()["detail"]
    assert "Unsupported file format" in detail


def test_empty_file_rejection():
    response = client.post(
        "/api/analyze-file",
        files={"file": ("empty_report.pdf", b"", "application/pdf")}
    )

    assert response.status_code == 400
    detail = response.json()["detail"]
    assert "empty" in detail.lower()
