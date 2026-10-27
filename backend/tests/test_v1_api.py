"""
Unit & Integration tests for POST /api/analyze endpoint and modular inference layer.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.inference import (
    BaseInferenceEngine,
    get_inference_engine,
    set_inference_engine
)

client = TestClient(app)

def test_api_analyze_valid_payload():
    payload = {
        "report_text": "Contractor entered storage tank sump without gas testing for H2S and oxygen levels."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["sif_potential"] == "HIGH"
    assert 0.0 <= data["confidence"] <= 1.0
    assert data["hazard"] == "Confined Space"
    assert "Maintenance" in data["activity"]
    assert data["life_saving_rule"] == "Confined Space"
    assert any(kw in data["potential_consequence"].lower() for kw in ["toxic", "fatality", "asphyxiation", "respiratory", "collapse"])
    assert data["life_saving_rule"] == "Confined Space"
    assert "reason" in data
    assert "reference" in data
    assert "explanation" in data
    assert isinstance(data["evidence"], list)
    assert len(data["evidence"]) > 0
    assert "stop work" in data["recommended_action"].lower() or "atmospheric testing" in data["recommended_action"].lower()

def test_api_analyze_empty_text_validation():
    # Test empty string payload
    payload = {"report_text": "   "}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    err_data = response.json()
    assert "error" in err_data or "detail" in err_data

def test_api_analyze_missing_field_validation():
    # Test missing report_text field
    payload = {}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422

def test_inference_engine_modular_swapping():
    # Define a custom mock ML engine conforming to BaseInferenceEngine
    class CustomMLMockEngine(BaseInferenceEngine):
        def predict(self, report_text: str):
            return {
                "sif_potential": "HIGH",
                "confidence": 0.99,
                "hazard": "Custom ML Hazard",
                "activity": "Custom ML Activity",
                "unsafe_condition": "Custom ML Condition",
                "potential_consequence": "Custom ML Consequence",
                "life_saving_rule": "Working at Height",
                "reason": "Test reason",
                "reference": "Test reference",
                "evidence": ["custom ml evidence"],
                "explanation": "Custom explanation",
                "recommended_action": "Custom ML Action"
            }

    original_engine = get_inference_engine()
    try:
        # Swap engine
        set_inference_engine(CustomMLMockEngine())

        response = client.post("/api/analyze", json={"report_text": "Test custom engine swap"})
        assert response.status_code == 200
        data = response.json()
        assert data["hazard"] == "Custom ML Hazard"
        assert data["confidence"] == 0.99
        assert data["explanation"] == "Custom explanation"
    finally:
        # Restore original engine
        set_inference_engine(original_engine)
