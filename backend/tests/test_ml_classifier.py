"""
Unit & Integration tests for PrecurAi Baseline ML Classifier and POST /api/analyze endpoint.
"""

import os
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from ml.predict import predict_sif_potential, load_model_artifacts

client = TestClient(app)


def test_ml_artifacts_exist_and_load():
    clf, vec = load_model_artifacts()
    assert clf is not None
    assert vec is not None


def test_predict_confined_space_high_sif():
    text = "During maintenance activity, a worker was preparing to enter a confined space. Required gas testing had not been completed before the planned entry. The supervisor identified the issue and stopped the activity. No injury occurred."
    res = predict_sif_potential(text)
    assert res["sif_potential"] in ["HIGH", "MEDIUM"]
    assert res["hazard"] in ["Confined Space", "Confined Space / Toxic Gas Entry"]
    assert res["life_saving_rule"] == "Confined Space"
    assert len(res["evidence"]) > 0
    assert "stop work" in res["recommended_action"].lower() or "confined-space" in res["recommended_action"].lower()


def test_predict_low_sif_housekeeping():
    text = "Empty cardboard boxes were stacked near the workshop entrance door causing minor floor clutter."
    res = predict_sif_potential(text)
    assert res["sif_potential"] == "LOW"
    assert res["life_saving_rule"] == "No direct Life-Saving Rule match"


def test_predict_vague_text():
    text = "Check equipment tomorrow."
    res = predict_sif_potential(text)
    assert res["sif_potential"] in ["NOT_ENOUGH_INFORMATION", "LOW"]


def test_api_post_analyze_endpoint():
    payload = {
        "report_text": "During maintenance activity, a worker was preparing to enter a confined space. Required gas testing had not been completed before the planned entry. The supervisor identified the issue and stopped the activity. No injury occurred."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify all required output fields
    assert "sif_potential" in data
    assert "confidence" in data
    assert "hazard" in data
    assert "activity" in data
    assert "potential_consequence" in data
    assert "life_saving_rule" in data
    assert "evidence" in data
    assert "recommended_action" in data

    assert isinstance(data["confidence"], float)
    assert isinstance(data["evidence"], list)
    assert data["life_saving_rule"] == "Confined Space"
    assert data["unsafe_condition"] is not None
    assert "gas testing" in data["unsafe_condition"].lower()


def test_predict_extracts_missing_gas_testing_control():
    text = "Required gas testing had not been completed before entry."
    res = predict_sif_potential(text)
    assert res["unsafe_condition"] is not None
    assert "gas testing" in res["unsafe_condition"].lower()
    assert "not completed" in res["unsafe_condition"].lower()
