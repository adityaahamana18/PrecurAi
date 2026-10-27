"""
HSE Dynamic Analytics Service for PrecurAi.
Calculates analytics metrics dynamically from cleaned supporting datasets in data/processed/.
Does NOT make SIF claims or generate artificial statistics.
"""

import os
import pandas as pd
from typing import Dict, List, Any


PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/processed"))


def _load_csv(filename: str) -> pd.DataFrame:
    path = os.path.join(PROCESSED_DIR, filename)
    if not os.path.exists(path):
        return pd.DataFrame()
    return pd.read_csv(path)


def get_observations_by_department() -> List[Dict[str, Any]]:
    """Calculates observation count breakdown by department."""
    df = _load_csv("safety_observations_clean.csv")
    if df.empty or "Department" not in df.columns:
        return []
    
    counts = df["Department"].dropna().value_counts().to_dict()
    return [{"department": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_observations_by_location() -> List[Dict[str, Any]]:
    """Calculates observation count breakdown by location/site."""
    df = _load_csv("safety_observations_clean.csv")
    if df.empty or "Location" not in df.columns:
        return []
    
    counts = df["Location"].dropna().value_counts().to_dict()
    return [{"location": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_observation_type_distribution() -> List[Dict[str, Any]]:
    """Calculates distribution of observation types."""
    df = _load_csv("safety_observations_clean.csv")
    if df.empty or "Observation_Type" not in df.columns:
        return []
    
    counts = df["Observation_Type"].dropna().value_counts().to_dict()
    return [{"type": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_risk_level_distribution() -> List[Dict[str, Any]]:
    """Calculates risk level distribution from safety observations."""
    df = _load_csv("safety_observations_clean.csv")
    if df.empty or "Risk_Level" not in df.columns:
        return []
    
    counts = df["Risk_Level"].dropna().value_counts().to_dict()
    return [{"risk_level": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_incident_type_distribution() -> List[Dict[str, Any]]:
    """Calculates incident type distribution from incident register."""
    df = _load_csv("incident_register_clean.csv")
    if df.empty or "Incident_Type" not in df.columns:
        return []
    
    counts = df["Incident_Type"].dropna().value_counts().to_dict()
    return [{"type": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_severity_distribution() -> List[Dict[str, Any]]:
    """Calculates severity distribution from incident register."""
    df = _load_csv("incident_register_clean.csv")
    if df.empty or "Severity" not in df.columns:
        return []
    
    counts = df["Severity"].dropna().value_counts().to_dict()
    return [{"severity": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_near_miss_metrics() -> Dict[str, Any]:
    """Calculates total near misses recorded across safety observations and incident register."""
    df_obs = _load_csv("safety_observations_clean.csv")
    df_inc = _load_csv("incident_register_clean.csv")

    obs_nm = 0
    if not df_obs.empty and "Observation_Type" in df_obs.columns:
        obs_nm = int((df_obs["Observation_Type"] == "Near Miss").sum())

    inc_nm = 0
    if not df_inc.empty and "Incident_Type" in df_inc.columns:
        inc_nm = int((df_inc["Incident_Type"] == "Near Miss").sum())

    return {
        "observation_near_misses": obs_nm,
        "incident_near_misses": inc_nm,
        "total_near_misses": obs_nm + inc_nm
    }


def get_corrective_action_status() -> Dict[str, Any]:
    """Calculates close-out and corrective action status metrics."""
    df_obs = _load_csv("safety_observations_clean.csv")
    df_inc = _load_csv("incident_register_clean.csv")

    closed = 0
    pending = 0
    if not df_obs.empty and "Closed_Out" in df_obs.columns:
        closed = int((df_obs["Closed_Out"] == "Yes").sum())
        pending = int((df_obs["Closed_Out"].isin(["No", "Pending"])).sum())

    inc_investigated = 0
    inc_pending = 0
    if not df_inc.empty and "Investigation_Done" in df_inc.columns:
        inc_investigated = int((df_inc["Investigation_Done"] == "Yes").sum())
        inc_pending = int((df_inc["Investigation_Done"] == "No").sum())

    return {
        "observations_closed": closed,
        "observations_pending": pending,
        "incidents_investigated": inc_investigated,
        "incidents_pending_investigation": inc_pending
    }


def get_training_status_distribution() -> List[Dict[str, Any]]:
    """Calculates training status distribution from training records."""
    df = _load_csv("training_records_clean.csv")
    if df.empty or "Status" not in df.columns:
        return []
    
    counts = df["Status"].dropna().value_counts().to_dict()
    return [{"status": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)]


def get_department_training_gaps() -> List[Dict[str, Any]]:
    """Calculates department-level training completion rates and expired counts."""
    df = _load_csv("training_records_clean.csv")
    if df.empty or "Department" not in df.columns or "Status" not in df.columns:
        return []

    gaps = []
    grouped = df.dropna(subset=["Department"]).groupby("Department")

    for dept, group in grouped:
        total = len(group)
        completed = int((group["Status"] == "Completed").sum())
        expired = int((group["Status"] == "Expired").sum())
        failed = int((group["Status"] == "Failed").sum())
        pending = int((group["Status"] == "Pending").sum())
        completion_rate = round((completed / total) * 100, 1) if total > 0 else 0.0

        gaps.append({
            "department": dept,
            "total_trainings": total,
            "completed": completed,
            "expired": expired,
            "failed": failed,
            "pending": pending,
            "completion_rate_pct": completion_rate
        })

    return sorted(gaps, key=lambda x: x["completion_rate_pct"])
