"""
Unit tests for HSE Supporting Analytics Service and Cleaned CSV Datasets.
"""

import os
import pytest
import pandas as pd
from backend.services.hse_analytics import (
    get_observations_by_department,
    get_observations_by_location,
    get_observation_type_distribution,
    get_risk_level_distribution,
    get_incident_type_distribution,
    get_severity_distribution,
    get_near_miss_metrics,
    get_corrective_action_status,
    get_training_status_distribution,
    get_department_training_gaps,
    PROCESSED_DIR
)


def test_processed_files_exist():
    assert os.path.exists(os.path.join(PROCESSED_DIR, "safety_observations_clean.csv"))
    assert os.path.exists(os.path.join(PROCESSED_DIR, "incident_register_clean.csv"))
    assert os.path.exists(os.path.join(PROCESSED_DIR, "training_records_clean.csv"))


def test_no_sentinel_values_in_cleaned_data():
    df_obs = pd.read_csv(os.path.join(PROCESSED_DIR, "safety_observations_clean.csv"))
    df_inc = pd.read_csv(os.path.join(PROCESSED_DIR, "incident_register_clean.csv"))
    df_trn = pd.read_csv(os.path.join(PROCESSED_DIR, "training_records_clean.csv"))

    # Verify sentinel values 999.0 and negative values are cleaned out
    assert not (df_obs["Days_to_Close"] == 999.0).any()
    assert not (df_obs["Days_to_Close"] < 0).any()
    assert not (df_inc["Days_Lost"] == 999.0).any()
    assert not (df_inc["Days_Lost"] < 0).any()
    assert not (df_trn["Score_Percent"] == 999.0).any()
    assert not (df_trn["Score_Percent"] < 0).any()


def test_observations_by_department():
    res = get_observations_by_department()
    assert isinstance(res, list)
    assert len(res) > 0
    assert "department" in res[0]
    assert "count" in res[0]
    # Check normalized department names (e.g. Operations, Maintenance)
    depts = [r["department"] for r in res]
    assert "Operations" in depts or "Maintenance" in depts


def test_observations_by_location():
    res = get_observations_by_location()
    assert isinstance(res, list)
    assert len(res) > 0
    assert "location" in res[0]
    locs = [r["location"] for r in res]
    assert "Yard" in locs or "Warehouse" in locs or "Site A" in locs


def test_observation_type_distribution():
    res = get_observation_type_distribution()
    assert isinstance(res, list)
    types = [r["type"] for r in res]
    assert "Near Miss" in types or "Unsafe Act" in types


def test_risk_level_distribution():
    res = get_risk_level_distribution()
    assert isinstance(res, list)
    levels = [r["risk_level"] for r in res]
    # Sentinel '0' should not be present
    assert "0" not in levels
    assert any(lvl in levels for lvl in ["Low", "Medium", "High", "Critical"])


def test_incident_type_distribution():
    res = get_incident_type_distribution()
    assert isinstance(res, list)
    types = [r["type"] for r in res]
    assert any(t in types for t in ["Near Miss", "Lost Time Injury", "Unsafe Act", "First Aid"])


def test_severity_distribution():
    res = get_severity_distribution()
    assert isinstance(res, list)
    sevs = [r["severity"] for r in res]
    assert "N/a" not in sevs
    assert any(s in sevs for s in ["Low", "Medium", "High", "Critical"])


def test_near_miss_metrics():
    res = get_near_miss_metrics()
    assert "observation_near_misses" in res
    assert "incident_near_misses" in res
    assert "total_near_misses" in res
    assert res["total_near_misses"] == res["observation_near_misses"] + res["incident_near_misses"]
    assert res["total_near_misses"] > 0


def test_corrective_action_status():
    res = get_corrective_action_status()
    assert "observations_closed" in res
    assert "observations_pending" in res
    assert "incidents_investigated" in res


def test_training_status_distribution():
    res = get_training_status_distribution()
    assert isinstance(res, list)
    statuses = [r["status"] for r in res]
    assert any(s in statuses for s in ["Completed", "Expired", "Pending", "Failed"])


def test_department_training_gaps():
    res = get_department_training_gaps()
    assert isinstance(res, list)
    assert len(res) > 0
    assert "department" in res[0]
    assert "completion_rate_pct" in res[0]
    assert 0.0 <= res[0]["completion_rate_pct"] <= 100.0
