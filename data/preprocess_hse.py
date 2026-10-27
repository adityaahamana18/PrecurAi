"""
HSE Datasets Cleaning & Normalization Script for PrecurAi.
Processes original CSV files into cleaned, standardized versions in data/processed/
without mutating the original source files.
"""

import os
import re
import pandas as pd
import numpy as np


DATA_DIR = os.path.abspath(os.path.dirname(__file__))
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")


def ensure_processed_dir():
    os.makedirs(PROCESSED_DIR, exist_ok=True)


def parse_iso_date(val):
    """Parses date string into ISO YYYY-MM-DD format or returns None for invalid dates."""
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    if val_str in ["99/99/9999", "9999-99-99", "unknown", "nan", "0", "999"]:
        return None

    try:
        dt = pd.to_datetime(val_str, errors='coerce', dayfirst=True)
        if pd.notnull(dt) and 2000 <= dt.year <= 2030:
            return dt.strftime('%Y-%m-%d')
    except Exception:
        pass
    return None


def normalize_department(val):
    if pd.isna(val):
        return None
    s = str(val).strip().lower()
    if s in ["ops", "operations"]:
        return "Operations"
    elif s in ["drilling"]:
        return "Drilling"
    elif s in ["maintenance"]:
        return "Maintenance"
    elif s in ["construction"]:
        return "Construction"
    elif s in ["warehousing", "warehouse"]:
        return "Warehousing"
    elif s in ["logistics"]:
        return "Logistics"
    elif s in ["hse", "safety"]:
        return "HSE"
    elif s in ["unknown", "n/a", "0", "999"]:
        return None
    return s.title()


def normalize_location(val):
    if pd.isna(val):
        return None
    s = str(val).strip().lower()
    if s in ["unknown", "n/a", "0", "999"]:
        return None
    if "site a" in s:
        return "Site A"
    if "site b" in s:
        return "Site B"
    if "yard" in s:
        return "Yard"
    if "office" in s:
        return "Office"
    if "warehouse" in s:
        return "Warehouse"
    return s.title()


def normalize_boolean_yes_no(val):
    if pd.isna(val):
        return None
    s = str(val).strip().lower()
    if s in ["yes", "y", "true", "1"]:
        return "Yes"
    elif s in ["no", "n", "false", "0"]:
        return "No"
    elif s in ["pending", "tbd"]:
        return "Pending"
    elif s in ["partial"]:
        return "Partial"
    return None


def clean_safety_observations():
    src_path = os.path.join(DATA_DIR, "safety_observations.csv")
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        return

    df = pd.read_csv(src_path)

    # Standardize Dates
    df["Date"] = df["Date"].apply(parse_iso_date)

    # Normalize Department & Location
    df["Department"] = df["Department"].apply(normalize_department)
    df["Location"] = df["Location"].apply(normalize_location)

    # Observation Type Normalization
    type_map = {
        "good practice": "Good Practice",
        "near miss": "Near Miss",
        "unsafe act": "Unsafe Act",
        "unsafe condition": "Unsafe Condition"
    }
    df["Observation_Type"] = df["Observation_Type"].astype(str).str.strip().str.lower().map(type_map).fillna(np.nan)

    # Risk Level Normalization
    risk_map = {
        "low": "Low",
        "med": "Medium",
        "medium": "Medium",
        "high": "High",
        "critical": "Critical"
    }
    df["Risk_Level"] = df["Risk_Level"].astype(str).str.strip().str.lower().map(risk_map).fillna(np.nan)

    # PPE Worn Normalization
    df["PPE_Worn"] = df["PPE_Worn"].apply(normalize_boolean_yes_no)

    # Action Taken Casing Normalization
    action_map = {
        "written warning": "Written Warning",
        "verbal warning": "Verbal Warning",
        "equipment removed": "Equipment Removed",
        "stopped work": "Stopped Work",
        "retraining": "Retraining",
        "pending": "Pending"
    }
    df["Action_Taken"] = df["Action_Taken"].astype(str).str.strip().str.lower().map(action_map).fillna(np.nan)

    # Closed Out Normalization
    df["Closed_Out"] = df["Closed_Out"].apply(normalize_boolean_yes_no)

    # Days to Close (Handle sentinel values: 999.0, -5.0)
    df["Days_to_Close"] = pd.to_numeric(df["Days_to_Close"], errors='coerce')
    df.loc[df["Days_to_Close"].isin([999.0, -5.0]), "Days_to_Close"] = np.nan
    df.loc[df["Days_to_Close"] < 0, "Days_to_Close"] = np.nan

    out_path = os.path.join(PROCESSED_DIR, "safety_observations_clean.csv")
    df.to_csv(out_path, index=False)
    print(f"Cleaned safety_observations saved to {out_path} ({len(df)} rows)")


def clean_incident_register():
    src_path = os.path.join(DATA_DIR, "incident_register.csv")
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        return

    df = pd.read_csv(src_path)

    # Standardize Dates
    df["Date"] = df["Date"].apply(parse_iso_date)

    # Normalize Department
    df["Department"] = df["Department"].apply(normalize_department)

    # Incident Type Normalization
    type_map = {
        "near miss": "Near Miss",
        "unsafe act": "Unsafe Act",
        "first aid": "First Aid",
        "lti": "Lost Time Injury",
        "lost time injury": "Lost Time Injury",
        "environmental": "Environmental",
        "property damage": "Property Damage"
    }
    df["Incident_Type"] = df["Incident_Type"].astype(str).str.strip().str.lower().map(type_map).fillna(np.nan)

    # Shift Normalization
    shift_map = {
        "morning": "Morning",
        "afternoon": "Afternoon",
        "night": "Night",
        "night shift": "Night"
    }
    df["Shift"] = df["Shift"].astype(str).str.strip().str.lower().map(shift_map).fillna(np.nan)

    # Root Cause Normalization
    rc_map = {
        "fatigue": "Fatigue",
        "ppe non compliance": "PPE Non-Compliance",
        "human error": "Human Error",
        "lack of training": "Lack of Training",
        "poor housekeeping": "Poor Housekeeping",
        "equipment failure": "Equipment Failure"
    }
    df["Root_Cause"] = df["Root_Cause"].astype(str).str.strip().str.lower().map(rc_map).fillna(np.nan)

    # Severity Normalization
    sev_map = {
        "low": "Low",
        "med": "Medium",
        "medium": "Medium",
        "high": "High",
        "critical": "Critical"
    }
    df["Severity"] = df["Severity"].astype(str).str.strip().str.lower().map(sev_map).fillna(np.nan)

    # Days Lost (Handle sentinel values: 999.0, -1.0)
    df["Days_Lost"] = pd.to_numeric(df["Days_Lost"], errors='coerce')
    df.loc[df["Days_Lost"].isin([999.0, -1.0]), "Days_Lost"] = np.nan
    df.loc[df["Days_Lost"] < 0, "Days_Lost"] = np.nan

    # Employee Age (Handle sentinel values: 999, 0, unknown)
    df["Employee_Age"] = pd.to_numeric(df["Employee_Age"], errors='coerce')
    df.loc[df["Employee_Age"].isin([999, 0]), "Employee_Age"] = np.nan
    df.loc[(df["Employee_Age"] < 16) | (df["Employee_Age"] > 80), "Employee_Age"] = np.nan

    # Reported Formally & Investigation Done
    df["Reported_Formally"] = df["Reported_Formally"].apply(normalize_boolean_yes_no)
    df["Investigation_Done"] = df["Investigation_Done"].apply(normalize_boolean_yes_no)

    # Corrective Action Normalization
    ca_map = {
        "warning issued": "Warning Issued",
        "equipment check": "Equipment Check",
        "toolbox talk": "Toolbox Talk",
        "training": "Training",
        "tbd": "Pending"
    }
    df["Corrective_Action"] = df["Corrective_Action"].astype(str).str.strip().str.lower().map(ca_map).fillna(np.nan)

    out_path = os.path.join(PROCESSED_DIR, "incident_register_clean.csv")
    df.to_csv(out_path, index=False)
    print(f"Cleaned incident_register saved to {out_path} ({len(df)} rows)")


def clean_training_records():
    src_path = os.path.join(DATA_DIR, "training_records.csv")
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        return

    df = pd.read_csv(src_path)

    # Standardize Dates
    df["Training_Date"] = df["Training_Date"].apply(parse_iso_date)
    df["Expiry_Date"] = df["Expiry_Date"].apply(normalize_location) # Wait, parse_iso_date
    df["Expiry_Date"] = df["Expiry_Date"].apply(parse_iso_date)

    # Normalize Employee Name & Department
    df["Employee_Name"] = df["Employee_Name"].astype(str).str.strip().str.title()
    df.loc[df["Employee_Name"].isin(["Nan", "Unknown", "0", "999"]), "Employee_Name"] = np.nan
    df["Department"] = df["Department"].apply(normalize_department)

    # Training Name Normalization
    trn_map = {
        "defensive driving": "Defensive Driving",
        "fire safety": "Fire Safety",
        "nebosh igc": "NEBOSH IGC",
        "permit to work": "Permit to Work",
        "ppe awareness": "PPE Awareness",
        "manual handling": "Manual Handling",
        "first aid": "First Aid"
    }
    df["Training_Name"] = df["Training_Name"].astype(str).str.strip().str.lower().map(trn_map).fillna(np.nan)

    # Status Normalization
    status_map = {
        "completed": "Completed",
        "pending": "Pending",
        "expired": "Expired",
        "failed": "Failed"
    }
    df["Status"] = df["Status"].astype(str).str.strip().str.lower().map(status_map).fillna(np.nan)

    # Score Percent (Handle sentinel values: 999.0, -1.0, 0.0)
    df["Score_Percent"] = pd.to_numeric(df["Score_Percent"], errors='coerce')
    df.loc[df["Score_Percent"].isin([999.0, -1.0]), "Score_Percent"] = np.nan
    df.loc[(df["Score_Percent"] < 0) | (df["Score_Percent"] > 100), "Score_Percent"] = np.nan

    # Trainer Normalization
    trainer_map = {
        "internal": "Internal",
        "external": "External"
    }
    df["Trainer"] = df["Trainer"].astype(str).str.strip().str.lower().map(trainer_map).fillna(np.nan)

    # Certificate Issued Normalization
    df["Certificate_Issued"] = df["Certificate_Issued"].apply(normalize_boolean_yes_no)

    out_path = os.path.join(PROCESSED_DIR, "training_records_clean.csv")
    df.to_csv(out_path, index=False)
    print(f"Cleaned training_records saved to {out_path} ({len(df)} rows)")


def main():
    ensure_processed_dir()
    clean_safety_observations()
    clean_incident_register()
    clean_training_records()
    print("All datasets successfully cleaned and saved in data/processed/")


if __name__ == "__main__":
    main()
