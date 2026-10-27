"""
API integration tests for PrecurAi backend.
Tests report analysis, database persistence, HSE human-in-the-loop review, and dashboard stats endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "PrecurAi"

def test_analyze_endpoint():
    payload = {
        "text": "Rigger stood directly under a 12-ton pipe load being lifted by crane at FPSO deck.",
        "location": "FPSO Deck",
        "unit_department": "Lifting"
    }
    response = client.post("/api/reports/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify all 9 MVP outputs are present
    assert "sif_potential" in data
    assert "confidence_score" in data
    assert "detected_hazard" in data
    assert "activity" in data
    assert "unsafe_category" in data
    assert "potential_consequence" in data
    assert "life_saving_rule" in data
    assert "explanation" in data
    assert "recommended_action" in data

    assert data["sif_potential"] == "HIGH"
    assert data["life_saving_rule"] in ["Line of Sight", "Safe Mechanical Lifting"]

def test_create_and_fetch_report():
    payload = {
        "text": "Technician opened high pressure hydrocarbon valve V-104 before LOTO energy isolation was verified.",
        "title": "Unisolated Hydrocarbon Line",
        "location": "Gas Processing Unit 1"
    }
    create_res = client.post("/api/reports", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    report_id = created_data["id"]

    # Fetch detail
    detail_res = client.get(f"/api/reports/{report_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["title"] == "Unisolated Hydrocarbon Line"

def test_hse_review_submission():
    # Analyze and create a report
    payload = {
        "text": "Empty cardboard trash boxes left stacked near workshop entrance door causing minor clutter.",
        "title": "Housekeeping Trash"
    }
    create_res = client.post("/api/reports", json=payload)
    report_id = create_res.json()["id"]

    # Submit HSE Human-in-the-Loop review notes
    review_payload = {
        "reviewer_name": "Chief Safety Inspector",
        "reviewer_role": "HSE Lead",
        "action_taken": "APPROVED_AI",
        "review_notes": "Reviewed and cleared. Worker instructed to move boxes.",
        "action_item": "Dispose of boxes in recycling bin."
    }
    review_res = client.post(f"/api/reports/{report_id}/review", json=review_payload)
    assert review_res.status_code == 200
    report_after_review = review_res.json()

    assert report_after_review["review_status"] == "REVIEWED"
    assert len(report_after_review["reviews"]) > 0
    assert report_after_review["reviews"][0]["reviewer_name"] == "Chief Safety Inspector"

def test_dashboard_stats_endpoint():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_reports" in data
    assert "high_sif_count" in data
    assert "lsr_violation_breakdown" in data
    assert "top_hazards_breakdown" in data
