"""
Unit tests for independent Life-Saving Rule mapping module (backend/services/lsr_mapper.py).
"""

import pytest
from backend.services.lsr_mapper import LifeSavingRuleMapper

@pytest.fixture
def mapper():
    return LifeSavingRuleMapper()

def test_map_confined_space(mapper):
    result = mapper.map_lsr(hazard="Confined Space", activity="Vessel Entry", report_text="Worker entered storage tank sump without gas testing.")
    assert result["rule"] == "Confined Space"
    assert "confined space" in result["reason"].lower()
    assert result["reference"] == "IOGP Life-Saving Rule #2 - Confined Space Entry"

def test_map_energy_isolation(mapper):
    result = mapper.map_lsr(hazard="Pressurized Release", activity="Valve Maintenance", report_text="Technician opened valve before LOTO isolation was verified.")
    assert result["rule"] == "Energy Isolation"
    assert "zero energy state" in result["reason"].lower()
    assert "Rule #4" in result["reference"]

def test_map_line_of_fire(mapper):
    result = mapper.map_lsr(hazard="Suspended Load", activity="Crane Lifting", report_text="Rigger stood directly under suspended pipe load.")
    assert result["rule"] == "Line of Fire"
    assert "crush zone" in result["reason"].lower()
    assert "Rule #6" in result["reference"]

def test_map_working_at_height(mapper):
    result = mapper.map_lsr(hazard="Fall Hazard", activity="Scaffolding", report_text="Scaffolder working at 6m height without harness tie-off.")
    assert result["rule"] == "Working at Height"
    assert "elevated height" in result["reason"].lower()
    assert "Rule #9" in result["reference"]

def test_map_hot_work(mapper):
    result = mapper.map_lsr(hazard="Flammable Ignition", activity="Welding", report_text="Torch cutting sparks landing near diesel drums.")
    assert result["rule"] == "Hot Work"
    assert "sparks" in result["reason"].lower()
    assert "Rule #5" in result["reference"]

def test_no_direct_lsr_match(mapper):
    # Routine low-risk housekeeping observation
    result = mapper.map_lsr(hazard="Clutter", activity="Housekeeping", report_text="Cardboard boxes left stacked near workshop entrance door.")
    assert result["rule"] == "No direct Life-Saving Rule match"
    assert "does not involve" in result["reason"].lower()
    assert "IOGP" in result["reference"]
