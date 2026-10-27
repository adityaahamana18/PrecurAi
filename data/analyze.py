import pandas as pd
import numpy as np

file_path = r"c:\Users\adity\OneDrive\Desktop\PrecurAi\data\pipeline_accidents.csv"
df = pd.read_csv(file_path)

print(f"=== DATASET OVERVIEW ===")
print(f"Rows: {len(df)}")
print(f"Columns count: {len(df.columns)}")
print("\n=== COLUMN NAMES & DATA TYPES & MISSING VALUES ===")
for col in df.columns:
    null_cnt = df[col].isnull().sum()
    null_pct = (null_cnt / len(df)) * 100
    print(f"- {col} | Type: {df[col].dtype} | Nulls: {null_cnt} ({null_pct:.1f}%) | Unique: {df[col].nunique()}")

print("\n=== FATALITY DISTRIBUTION ===")
fatality_cols = [c for c in df.columns if 'fatality' in c.lower() or 'fatal' in c.lower() or 'killed' in c.lower() or 'death' in c.lower()]
print(f"Fatality columns identified: {fatality_cols}")
for c in fatality_cols:
    print(f"--- {c} ---")
    print(df[c].describe())
    print(df[c].value_counts(dropna=False).head(10))

print("\n=== INJURY DISTRIBUTION ===")
injury_cols = [c for c in df.columns if 'injur' in c.lower() or 'hurt' in c.lower()]
print(f"Injury columns identified: {injury_cols}")
for c in injury_cols:
    print(f"--- {c} ---")
    print(df[c].describe())
    print(df[c].value_counts(dropna=False).head(10))

print("\n=== EXPLOSION / IGNITION FIELDS ===")
exp_cols = [c for c in df.columns if any(k in c.lower() for k in ['explosion', 'ignite', 'ignition', 'fire', 'burn'])]
print(f"Explosion/Ignition columns: {exp_cols}")
for c in exp_cols:
    print(f"--- {c} ---")
    print(df[c].value_counts(dropna=False).head(10))

print("\n=== CAUSE CATEGORIES & SUBCATEGORIES ===")
cause_cols = [c for c in df.columns if 'cause' in c.lower() or 'reason' in c.lower()]
print(f"Cause columns: {cause_cols}")
for c in cause_cols:
    print(f"--- {c} ---")
    print(df[c].value_counts(dropna=False).head(10))

print("\n=== RELEASE-RELATED FIELDS ===")
rel_cols = [c for c in df.columns if any(k in c.lower() for k in ['release', 'spill', 'volume', 'barrel', 'loss', 'leak', 'quantity', 'unintentional'])]
print(f"Release columns: {rel_cols}")
for c in rel_cols:
    print(f"--- {c} ---")
    print(df[c].describe() if pd.api.types.is_numeric_dtype(df[c]) else df[c].value_counts(dropna=False).head(10))

print("\n=== PIPELINE TYPES ===")
pipe_cols = [c for c in df.columns if any(k in c.lower() for k in ['pipeline', 'commodity', 'system', 'facility', 'type', 'product'])]
print(f"Pipeline columns: {pipe_cols}")
for c in pipe_cols:
    print(f"--- {c} ---")
    print(df[c].value_counts(dropna=False).head(10))

print("\n=== GEOGRAPHIC FIELDS ===")
geo_cols = [c for c in df.columns if any(k in c.lower() for k in ['state', 'city', 'county', 'location', 'lat', 'lon', 'coord', 'region', 'gis'])]
print(f"Geographic columns: {geo_cols}")

print("\n=== COST FIELDS ===")
cost_cols = [c for c in df.columns if any(k in c.lower() for k in ['cost', 'property', 'damage', 'loss', 'dollar', 'amount', 'total'])]
print(f"Cost columns: {cost_cols}")
for c in cost_cols:
    print(f"--- {c} ---")
    print(df[c].describe() if pd.api.types.is_numeric_dtype(df[c]) else df[c].value_counts(dropna=False).head(10))
