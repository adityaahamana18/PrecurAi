"""
Unit tests for modular Explainability Engine (backend/services/explainability.py).
"""

import pytest
from backend.services.explainability import LinearModelExplainabilityEngine
import ml.predict as predict_module

@pytest.fixture
def explain_engine():
    return LinearModelExplainabilityEngine()

def test_explainability_output_structure(explain_engine):
    predict_module._load_artifacts()
    report_text = "Contractor entered storage tank sump without gas testing for H2S."

    result = explain_engine.explain(
        report_text=report_text,
        predicted_class="HIGH",
        confidence=0.87,
        model=predict_module._model,
        vectorizer=predict_module._vectorizer
    )

    assert "evidence_phrases" in result
    assert "contributing_features" in result
    assert "confidence" in result
    assert "explanation" in result

    assert isinstance(result["evidence_phrases"], list)
    assert isinstance(result["contributing_features"], list)
    assert result["confidence"] == 0.87
    assert "HIGH" in result["explanation"]

def test_explainability_fallback_without_model(explain_engine):
    # Test explainability fallback when model is None
    report_text = "Scaffolder working at height without harness."
    result = explain_engine.explain(
        report_text=report_text,
        predicted_class="HIGH",
        confidence=0.90,
        model=None,
        vectorizer=None
    )

    assert len(result["evidence_phrases"]) > 0
    assert "HIGH" in result["explanation"]
