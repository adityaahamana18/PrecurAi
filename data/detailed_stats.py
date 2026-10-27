import pandas as pd

df = pd.read_csv(r"c:\Users\adity\OneDrive\Desktop\PrecurAi\data\pipeline_accidents.csv")

print("--- FULL COLUMN ANALYSIS ---")
print(f"Total Rows: {len(df)}")
print(f"Total Columns: {len(df.columns)}")
print("\nColumns & Missing Values:")
for col in df.columns:
    nulls = df[col].isnull().sum()
    pct = (nulls / len(df)) * 100
    print(f"  {col:45s} | Type: {str(df[col].dtype):10s} | Missing: {nulls:4d} ({pct:5.1f}%) | Unique: {df[col].nunique()}")

print("\n--- FATALITIES DETAIL ---")
fat_cols = [c for c in df.columns if 'fatality' in c.lower() or 'fatal' in c.lower()]
for c in fat_cols:
    print(c, ":", df[c].value_counts(dropna=False).to_dict())

print("\n--- INJURIES DETAIL ---")
inj_cols = [c for c in df.columns if 'injur' in c.lower()]
for c in inj_cols:
    print(c, ":", df[c].value_counts(dropna=False).to_dict())

print("\n--- EXPLOSION & IGNITION ---")
print("Liquid Ignition:", df['Liquid Ignition'].value_counts(dropna=False).to_dict())
print("Liquid Explosion:", df['Liquid Explosion'].value_counts(dropna=False).to_dict())

print("\n--- TARGET CANDIDATES / CLASS IMBALANCE ---")
# 1. Any Fatality / Injury
has_fatality = (df['All Fatalities'].fillna(0) > 0)
has_injury = (df['All Injuries'].fillna(0) > 0)
has_fatality_or_injury = has_fatality | has_injury
print("Has Fatality count:", has_fatality.sum(), f"({has_fatality.mean()*100:.2f}%)")
print("Has Injury count:", has_injury.sum(), f"({has_injury.mean()*100:.2f}%)")
print("Has Fatality or Injury count:", has_fatality_or_injury.sum(), f"({has_fatality_or_injury.mean()*100:.2f}%)")

# 2. Ignition or Explosion
has_ignition = (df['Liquid Ignition'] == 'YES')
has_explosion = (df['Liquid Explosion'] == 'YES')
print("Has Ignition count:", has_ignition.sum(), f"({has_ignition.mean()*100:.2f}%)")
print("Has Explosion count:", has_explosion.sum(), f"({has_explosion.mean()*100:.2f}%)")

# 3. Major Release (>100 barrels or >1000 barrels)
unint_rel = df['Unintentional Release (Barrels)'].fillna(0)
print("Release > 100 bbl:", (unint_rel > 100).sum(), f"({(unint_rel > 100).mean()*100:.2f}%)")
print("Release > 1000 bbl:", (unint_rel > 1000).sum(), f"({(unint_rel > 1000).mean()*100:.2f}%)")

# 4. Total Costs > $100k
total_cost = df['All Costs'].fillna(0)
print("All Costs > $100k:", (total_cost > 100000).sum(), f"({(total_cost > 100000).mean()*100:.2f}%)")
print("All Costs > $1M:", (total_cost > 1000000).sum(), f"({(total_cost > 1000000).mean()*100:.2f}%)")
