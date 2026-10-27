"""
Comprehensive Audit Script for HSE Datasets:
- data/safety_observations.csv
- data/incident_register.csv
- data/training_records.csv
"""

import os
import json
import pandas as pd
import numpy as np


DATA_DIR = os.path.abspath(os.path.dirname(__file__))
FILES = {
    "safety_observations": os.path.join(DATA_DIR, "safety_observations.csv"),
    "incident_register": os.path.join(DATA_DIR, "incident_register.csv"),
    "training_records": os.path.join(DATA_DIR, "training_records.csv")
}


def audit_dataset(name: str, filepath: str) -> dict:
    if not os.path.exists(filepath):
        return {"error": f"File not found: {filepath}"}

    df = pd.read_csv(filepath)
    num_rows, num_cols = df.shape
    num_duplicates = int(df.duplicated().sum())

    columns_info = {}
    for col in df.columns:
        dtype = str(df[col].dtype)
        null_count = int(df[col].isnull().sum())
        null_pct = round((null_count / num_rows) * 100, 2)
        num_unique = int(df[col].nunique(dropna=True))

        # Sample unique values if categorical/string or low cardinality
        unique_vals = None
        if num_unique <= 50 or df[col].dtype == 'object':
            val_counts = df[col].value_counts(dropna=False).head(20).to_dict()
            # Convert non-string keys to str for JSON serialization
            unique_vals = {str(k): int(v) for k, v in val_counts.items()}

        columns_info[col] = {
            "dtype": dtype,
            "null_count": null_count,
            "null_pct": null_pct,
            "num_unique": num_unique,
            "value_counts_top20": unique_vals
        }

    # Date Analysis
    date_cols = {}
    for col in df.columns:
        if 'date' in col.lower() or 'time' in col.lower():
            try:
                parsed = pd.to_datetime(df[col], errors='coerce')
                valid_count = int(parsed.notnull().sum())
                if valid_count > 0:
                    min_date = str(parsed.min())
                    max_date = str(parsed.max())
                    date_cols[col] = {
                        "valid_dates": valid_count,
                        "invalid_dates": int(parsed.isnull().sum() - df[col].isnull().sum()),
                        "min_date": min_date,
                        "max_date": max_date
                    }
            except Exception:
                pass

    # Free text fields suitable for NLP
    text_cols = {}
    for col in df.columns:
        if df[col].dtype == 'object':
            avg_len = float(df[col].astype(str).apply(len).mean())
            max_len = int(df[col].astype(str).apply(len).max())
            if avg_len > 20 or max_len > 50:
                sample_texts = df[col].dropna().head(3).tolist()
                text_cols[col] = {
                    "avg_char_length": round(avg_len, 2),
                    "max_char_length": max_len,
                    "sample_texts": sample_texts
                }

    return {
        "file": name,
        "filepath": filepath,
        "rows": num_rows,
        "columns_count": num_cols,
        "duplicate_rows": num_duplicates,
        "columns": columns_info,
        "date_fields": date_cols,
        "text_nlp_fields": text_cols
    }


def main():
    results = {}
    for name, path in FILES.items():
        print(f"Auditing {name}...")
        results[name] = audit_dataset(name, path)

    # Cross-dataset relationship audit
    dfs = {name: pd.read_csv(path) for name, path in FILES.items() if os.path.exists(path)}
    
    relationships = {}
    # Check for common column names across datasets
    col_map = {name: set(df.columns) for name, df in dfs.items()}
    all_cols = set.union(*col_map.values())
    
    common_cols = {}
    for col in all_cols:
        present_in = [name for name, cols in col_map.items() if col in cols]
        if len(present_in) > 1:
            common_cols[col] = present_in

    relationships["common_columns"] = common_cols

    # Check key value overlaps if common columns exist (e.g. Department, Location, Employee_ID)
    key_overlaps = {}
    for col in ["Department", "Location", "Site", "Employee_ID", "Reporter_ID", "Unit"]:
        matching_datasets = [name for name, cols in col_map.items() if col in cols]
        if len(matching_datasets) > 1:
            sets = {name: set(dfs[name][col].dropna().astype(str).unique()) for name in matching_datasets}
            intersection = set.intersection(*sets.values())
            union = set.union(*sets.values())
            key_overlaps[col] = {
                "present_in": matching_datasets,
                "overlap_count": len(intersection),
                "total_unique_across_datasets": len(union),
                "common_sample_values": list(intersection)[:10]
            }

    relationships["key_overlaps"] = key_overlaps

    audit_summary = {
        "datasets": results,
        "cross_dataset_relationships": relationships
    }

    # Save to data_audit.json
    json_path = os.path.join(DATA_DIR, "data_audit.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(audit_summary, f, indent=2)

    print(f"Audit completed. Json saved to {json_path}")


if __name__ == "__main__":
    main()
