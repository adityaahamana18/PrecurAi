# Comprehensive Data Audit Report: HSE CSV Datasets

**Project**: PrecurAi — Safety Intelligence Platform for Oil & Gas (SIH 2026)  
**Date of Audit**: September 6, 2026  
**Audited Datasets**:
1. `data/safety_observations.csv` (400 rows, 11 columns)
2. `data/incident_register.csv` (500 rows, 12 columns)
3. `data/training_records.csv` (300 rows, 11 columns)

---

> [!IMPORTANT]
> **Audit Boundary & Safety Directives Enforced**:
> - No machine learning models were trained.
> - No SIF (Serious Injury / Fatality) labels were automatically generated or fabricated.
> - `Risk_Level` and `Severity` fields were **NOT** assumed to equal SIF potential.
> - No synthetic data, dummy fallbacks, or modified CSV records were created.

---

## 1. Summary of Audited Datasets

### A. `data/safety_observations.csv`
- **Total Records**: 400 rows, 11 columns
- **Duplicate Records**: 0
- **Missing Value Overview**: 68 (17.0%) missing departments, 61 (15.25%) missing locations, 99 (24.75%) missing observation types, 82 (20.5%) missing risk levels.

| Column Name | Data Type | Missing Count | Missing % | Unique Count | Sample Categorical Values / Range |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Observation_ID` | String | 0 | 0.00% | 400 | `OBS-0001` to `OBS-0400` |
| `Date` | String | 13 | 3.25% | 360 | Min: `2022-01-06`, Max: `2023-12-26` (Inconsistent formats: ISO, DD/MM/YYYY, DD Mon YYYY) |
| `Observer_ID` | String | 30 | 7.50% | 305 | `EMP-252`, `EMP-515`, `EMP-981` |
| `Department` | String | 68 | 17.00% | 13 | Unnormalized: `MAINTENANCE` (31), `Ops` (30), `Operations` (28), `construction` (28), `Drilling` (22) |
| `Location` | String | 61 | 15.25% | 12 | Unnormalized: `Yard` (40), `office` (35), `WAREHOUSE` (32), `Site A` (29), `Unknown` (24) |
| `Observation_Type` | String | 99 | 24.75% | 9 | `good practice` (40), `Near Miss` (37), `unsafe act` (35), `unsafe condition` (31) |
| `Risk_Level` | String | 82 | 20.50% | 9 | `Low` (46), `low` (40), `0` (38 sentinel), `HIGH` (35), `Critical` (34), `Medium` (28) |
| `PPE_Worn` | String | 96 | 24.00% | 7 | `no` (60), `NO` (48), `yes` (44), `Partial` (39), `Yes` (36) |
| `Action_Taken` | String | 113 | 28.25% | 9 | `Written Warning` (44), `Equipment Removed` (39), `Stopped Work` (36), `Retraining` (25) |
| `Closed_Out` | String | 113 | 28.25% | 5 | `Pending` (74), `no` (56), `Yes` (55), `No` (51) |
| `Days_to_Close` | Float | 28 | 7.00% | 10 | Includes invalid values: `999.0` (47 placeholder), `-5.0` (43 negative days) |

---

### B. `data/incident_register.csv`
- **Total Records**: 500 rows, 12 columns
- **Duplicate Records**: 0
- **Missing Value Overview**: 57 (11.4%) missing departments, 63 (12.6%) missing incident types, 92 (18.4%) missing severities, 191 (38.2%) missing corrective actions.

| Column Name | Data Type | Missing Count | Missing % | Unique Count | Sample Categorical Values / Range |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Incident_ID` | String | 0 | 0.00% | 500 | `INC-0001` to `INC-0500` |
| `Date` | String | 14 | 2.80% | 443 | Includes corrupted dates: `"99/99/9999"` (12 rows), Min: `2022-01-07`, Max: `2023-12-22` |
| `Department` | String | 57 | 11.40% | 13 | `OPS` (41), `drilling` (39), `Logistics` (39), `Operations` (39), `Maintenance` (36) |
| `Incident_Type` | String | 63 | 12.60% | 13 | `near miss` (45), `Unsafe Act` (38), `First Aid` (35), `LTI` (31), `Property Damage` (30) |
| `Shift` | String | 97 | 19.40% | 8 | `afternoon` (55), `MORNING` (54), `NIGHT` (53), `night shift` (46) |
| `Root_Cause` | String | 79 | 15.80% | 12 | `fatigue` (46), `ppe non compliance` (42), `human error` (41), `lack of training` (36) |
| `Severity` | String | 92 | 18.40% | 11 | `Critical` (51), `N/a` (48), `LOW` (37), `CRITICAL` (37), `Medium` (36), `High` (34) |
| `Days_Lost` | Float | 32 | 6.40% | 12 | Includes invalid values: `999.0` (45 placeholder), `-1.0` (26 negative days) |
| `Employee_Age` | String | 46 | 9.20% | 11 | String values: `"45"` (53), `"unknown"` (42), `"999"` (41 sentinel), `"0"` (41) |
| `Reported_Formally`| String | 121 | 24.20% | 8 | `no` (53), `yes` (53), `Y` (51), `N` (49), `NO` (47), `YES` (43) |
| `Corrective_Action` | String | 191 | 38.20% | 5 | `Warning Issued` (64), `Equipment Check` (63), `TBD` (63), `Toolbox Talk` (60) |
| `Investigation_Done`| String | 165 | 33.00% | 4 | `no` (93), `No` (85), `yes` (82), `Yes` (75) |

---

### C. `data/training_records.csv`
- **Total Records**: 300 rows, 11 columns
- **Duplicate Records**: 0
- **Missing Value Overview**: 41 (13.67%) missing departments, 40 (13.33%) missing training names, 145 (48.33%) missing scores, 115 (38.33%) missing trainers.

| Column Name | Data Type | Missing Count | Missing % | Unique Count | Sample Categorical Values / Range |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Training_ID` | String | 0 | 0.00% | 300 | `TRN-0001` to `TRN-0300` |
| `Employee_ID` | String | 0 | 0.00% | 217 | `EMP-147` (4), `EMP-449` (4), `EMP-182` (4) |
| `Employee_Name` | String | 51 | 17.00% | 8 | `Tariq Hussain` (40), `AHMED AL-RASHIDI` (35), `Unknown` (32), `Mohammed Farooq` (31) |
| `Department` | String | 41 | 13.67% | 13 | `drilling` (29), `Maintenance` (26), `Construction` (24), `OPS` (21) |
| `Training_Name` | String | 40 | 13.33% | 15 | `Defensive Driving` (27), `fire safety` (24), `NEBOSH IGC` (20), `permit to work` (19) |
| `Training_Date` | String | 21 | 7.00% | 264 | Min: `2021-01-25`, Max: `2023-06-14` (Inconsistent date string formats) |
| `Expiry_Date` | String | 16 | 5.33% | 274 | Min: `2021-02-03`, Max: `2023-05-30` |
| `Status` | String | 72 | 24.00% | 9 | `Expired` (33), `Pending` (31), `pending` (31), `Failed` (27), `Completed` (23) |
| `Score_Percent` | Float | 145 | 48.33% | 49 | Includes invalid values: `999.0` (38), `-1.0` (37), `0.0` (33) |
| `Trainer` | String | 115 | 38.33% | 5 | `internal` (45), `external` (37), `External` (37), `Internal` (36) |
| `Certificate_Issued`| String | 17.00% | 5 | `Pending` (58), `yes` (51), `no` (50), `No` (47) |

---

## 2. Text / Free-Text NLP Suitability Audit

> [!WARNING]
> **Critical NLP Deficit Identified**:
> NONE of the three CSV files (`safety_observations.csv`, `incident_register.csv`, `training_records.csv`) contain unstructured free-text descriptions or narrative fields suitable for NLP SIF-precursor extraction!

- `safety_observations.csv`: Contains short 1-to-3 word categorical strings (`Observation_Type`, `Action_Taken`).
- `incident_register.csv`: Contains short categorical strings (`Incident_Type`, `Root_Cause`, `Corrective_Action`).
- `training_records.csv`: Contains short course names (`Training_Name`, `Employee_Name`).

No detailed narrative text (such as "Technician opened unisolated valve V-104 without gas testing") exists in these CSVs.

---

## 3. Analysis of Candidate Target Variables & Class Imbalance

### A. `safety_observations.csv` — `Risk_Level`
- **Total Valid**: 318 rows (82 missing / 20.5%)
- **Value Distribution**:
  - `Low` / `low` / `0`: 124 (39.0%)
  - `Med` / `Medium` / `MEDIUM`: 95 (29.9%)
  - `High` / `HIGH`: 65 (20.4%)
  - `Critical`: 34 (10.7%)

### B. `incident_register.csv` — `Severity`
- **Total Valid**: 408 rows (92 missing / 18.4%)
- **Value Distribution**:
  - `Low` / `LOW` / `low`: 106 (26.0%)
  - `Medium` / `Med` / `MEDIUM`: 107 (26.2%)
  - `Critical` / `CRITICAL`: 88 (21.6%)
  - `High` / `HIGH`: 59 (14.5%)
  - `N/a`: 48 (11.8%)

### C. `incident_register.csv` — `Incident_Type`
- **Total Valid**: 437 rows (63 missing / 12.6%)
- **Value Distribution**:
  - `Near Miss` / `near miss` / `NEAR MISS`: 116 (26.5%)
  - `LTI` / `Lost Time Injury` / `lti`: 90 (20.6%)
  - `Unsafe Act` / `unsafe act`: 73 (16.7%)
  - `First Aid` / `first aid`: 66 (15.1%)
  - `Property Damage` / `property damage`: 60 (13.7%)
  - `Environmental`: 32 (7.3%)

---

## 4. Cross-Dataset Relationships & Key Overlaps

1. **`Department` Key**: Present across all 3 datasets.
   - 13 unique department representations across datasets.
   - High inconsistency: `"MAINTENANCE"` vs `"Maintenance"`, `"Ops"` vs `"Operations"`, `"DRILLING"` vs `"drilling"`, `"logistics "`.
2. **`Employee_ID` / `Observer_ID`**:
   - `Observer_ID` in `safety_observations.csv` and `Employee_ID` in `training_records.csv` share the `EMP-XXX` format.
   - `incident_register.csv` **lacks** an `Employee_ID` field (only records `Employee_Age`).
3. **Absence of Foreign Keys**:
   - There are **no primary/foreign key relationships** linking `safety_observations.csv` to `incident_register.csv` (e.g., no `Observation_ID` in incidents or `Incident_ID` in observations).

---

## 5. Summary Categorization (A, B, C, D, E)

### A. Data Suitable for SIF Classification
- **NONE of the columns in these 3 CSV files are suitable as a direct SIF-precursor classification target or input text for PrecurAi.**
- SIF precursor intelligence requires detailed unstructured narrative text describing high-energy hazard mechanisms (e.g. pressure release, LOTO bypass, suspended load, confined space entry). Categorical codes cannot substitute for precursor context.

### B. Data Suitable for Supporting Analytics
- **`Department` & `Location`**: High-level departmental safety culture monitoring and risk heatmap breakdown (after text normalization).
- **`training_records.csv`**: Assessing departmental training compliance rates (e.g., percentage of maintenance staff with valid *Permit to Work* or *Fire Safety* certifications).
- **`Action_Taken` & `Corrective_Action`**: Tracking administrative close-out velocity and remedial action types.

### C. Data That Should NOT Be Used as a SIF Label
- **`Severity`** (`incident_register.csv`): Reflects actual outcome severity or administrative reporting level. An incident with zero injury (Near Miss) can be a severe SIF precursor, whereas an incident with high days lost (ankle fracture on stairs) may not be a SIF precursor.
- **`Risk_Level`** (`safety_observations.csv`): Subjective observer rating containing noise (`0`), missing values (20.5%), and unstandardized categories.
- **`Incident_Type`**: Broad administrative category (LTI, First Aid, Property Damage) that conflates minor injuries with high-energy precursors.

### D. Missing Information Required for Reliable SIF Labeling
1. **Unstructured Narrative Description**: Detailed free-text narrative explaining the operational task, equipment involved, hazard controls present, and specific breakdown.
2. **High-Energy Hazard Indicators**: Explicit indicators for pressure >100 psi, voltage >440V, height >1.8m, suspended loads >1000 kg, or toxic gas exposure.
3. **Life-Saving Rule Non-Compliance Markers**: Explicit confirmation of whether an IOGP Life-Saving Rule control was bypassed.
4. **Relational Links**: Unique foreign keys linking worker training compliance directly to safety observations and incident records.

### E. Recommended Next Steps for Creating a Defensible Training Dataset
1. **Source/Incorporate Unstructured Incident Narrative Datasets**: Utilize rich unstructured text datasets (such as the PNGRB incident investigation corpus or real Oil & Gas safety observation narratives) where NLP hazard extraction can operate.
2. **Apply Expert-Grounded Precursor Annotation Rules**: Define SIF precursors based on IOGP Life-Saving Rules and High-Energy Hazard taxonomies rather than outcome severity.
3. **Normalize Existing Tabular CSVs**: Clean up casing, handle sentinel values (`999`, `-5`), and standardize department/location keys for supporting dashboard analytics.

---

## 6. Final Preprocessing Decisions & Supporting Analytics Implementation

The preprocessing script `data/preprocess_hse.py` was executed to generate clean, normalized versions in `data/processed/`:

### A. Cleaning Operations Performed:
- **`data/processed/safety_observations_clean.csv`**: Normalized `Department`, `Location`, `Observation_Type`, `Risk_Level`, `PPE_Worn`, `Action_Taken`, `Closed_Out`. Converted sentinel `999.0` and negative values (`-5.0`) in `Days_to_Close` to `NaN`. Converted `Date` strings to ISO `YYYY-MM-DD` format.
- **`data/processed/incident_register_clean.csv`**: Normalized `Department`, `Incident_Type`, `Shift`, `Root_Cause`, `Severity`, `Reported_Formally`, `Investigation_Done`, `Corrective_Action`. Converted corrupt dates (`"99/99/9999"`) to `null`. Handled invalid `Employee_Age` (`"999"`, `"0"`) and sentinel `Days_Lost` (`999.0`, `-1.0`).
- **`data/processed/training_records_clean.csv`**: Normalized `Employee_Name`, `Department`, `Training_Name`, `Status`, `Trainer`, `Certificate_Issued`. Standardized `Training_Date` and `Expiry_Date` to ISO format. Filtered invalid `Score_Percent` values (`999.0`, `-1.0`, `<0`, `>100`).

### B. Supporting Analytics Engine (`backend/services/hse_analytics.py`):
- Exposes dynamic analytics endpoints for:
  - Departmental & Location Observation counts
  - Observation Type & Risk Level distributions
  - Incident Type & Severity distributions
  - Total Near-Miss metrics (combined across observations & incidents)
  - Close-out & Corrective Action completion rates
  - Departmental Training Completion Rate (%) & Expired Training Gaps

