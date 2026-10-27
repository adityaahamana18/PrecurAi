"""
Unit tests for PrecurAi NLP Engine
Tests SIF potential evaluation, Life-Saving Rule mapping, and structured output formatting.
"""

import pytest
from backend.nlp.engine import SIFIntelligenceEngine

@pytest.fixture
def engine():
    return SIFIntelligenceEngine()

def test_high_sif_suspended_load(engine):
    report_text = "Rigger stood directly under a 12-ton pipe load being lifted by crane at FPSO deck without tag line."
    result = engine.analyze_report(report_text)

    assert result["sif_potential"] == "HIGH"
    assert result["confidence_score"] >= 0.80
    assert result["life_saving_rule"] in ["Line of Sight", "Safe Mechanical Lifting"]
    assert result["unsafe_category"] == "Unsafe Act"
    assert "IMMEDIATE ACTION REQUIRED" in result["recommended_action"]
    assert len(result["evidence_highlights"]) > 0

def test_high_sif_energy_isolation(engine):
    report_text = "Technician opened high pressure hydrocarbon line valve before LOTO energy isolation was verified."
    result = engine.analyze_report(report_text)

    assert result["sif_potential"] == "HIGH"
    assert result["life_saving_rule"] == "Energy Isolation"
    assert result["detected_hazard"] == "Pressurized System Release (>100 PSI / Hydrocarbon)"

def test_high_sif_working_at_height(engine):
    report_text = "Scaffolder working at 6m height on platform B without harness tie-off lanyard attached."
    result = engine.analyze_report(report_text)

    assert result["sif_potential"] == "HIGH"
    assert result["life_saving_rule"] == "Working at Height"

def test_low_sif_housekeeping(engine):
    report_text = "Empty cardboard trash boxes left stacked near workshop entrance door causing minor clutter."
    result = engine.analyze_report(report_text)

    assert result["sif_potential"] == "LOW"
    assert "ROUTINE HSE FOLLOW-UP" in result["recommended_action"]

def test_empty_text_handling(engine):
    result = engine.analyze_report("")
    assert result["sif_potential"] == "LOW"
    assert result["confidence_score"] == 0.50

def test_explicit_control_failure_gas_testing(engine):
    report_text = "Required gas testing had not been completed before entry."
    result = engine.analyze_report(report_text)
    assert result["unsafe_condition"] is not None
    assert "gas testing" in result["unsafe_condition"].lower()
    assert "not completed" in result["unsafe_condition"].lower()
