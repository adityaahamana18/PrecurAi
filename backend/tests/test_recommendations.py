"""
Unit tests for PrecurAi hazard-specific decision support recommendations.
Verifies that recommendations are tailored to detected hazards and Life-Saving Rules,
and do not emit generic statements.
"""

import pytest
from ml.predict import get_hazard_specific_recommendation, predict_sif_potential


def test_confined_space_recommendation():
    rec = get_hazard_specific_recommendation("HIGH", "Confined Space", "Confined Space")
    assert "atmospheric testing" in rec.lower()
    assert "confined-space controls" in rec.lower()
    assert "audit energy barriers" not in rec.lower()


def test_energy_isolation_recommendation():
    rec = get_hazard_specific_recommendation("HIGH", "Energy Isolation", "Energy Isolation")
    assert "lockout/tagout" in rec.lower()
    assert "zero-energy state" in rec.lower()


def test_line_of_fire_recommendation():
    rec = get_hazard_specific_recommendation("HIGH", "Suspended Load", "Line of Fire")
    assert "exclusion zone" in rec.lower()
    assert "line of fire" in rec.lower()


def test_working_at_height_recommendation():
    rec = get_hazard_specific_recommendation("HIGH", "Working at Height", "Working at Height")
    assert "fall protection" in rec.lower()
    assert "anchorage" in rec.lower()


def test_hot_work_recommendation():
    rec = get_hazard_specific_recommendation("HIGH", "Hot Work", "Hot Work")
    assert "hot-work authorization" in rec.lower()
    assert "fire controls" in rec.lower()


def test_low_risk_recommendation():
    rec = get_hazard_specific_recommendation("LOW", "General Field Hazard", "No direct Life-Saving Rule match")
    assert "log observation in hse register" in rec.lower()


def test_vague_report_recommendation():
    rec = get_hazard_specific_recommendation("NOT_ENOUGH_INFORMATION", "Unspecified", "No direct Life-Saving Rule match")
    assert "additional details" in rec.lower()


def test_predict_sif_potential_includes_hazard_specific_recommendations():
    res = predict_sif_potential("During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry.")
    assert res["sif_potential"] == "HIGH"
    assert "confined-space controls" in res["recommended_action"].lower()
