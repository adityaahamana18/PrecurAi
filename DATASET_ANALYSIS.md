# Pipeline Accidents Dataset Analysis Report

> **Dataset Source**: `data/pipeline_accidents.csv`  
> **Total Records**: 2,795 rows  
> **Total Features**: 48 columns  
> **Domain**: US PHMSA Historical Hazardous Liquid Pipeline Accident Logs (2010–2017)

---

## Data Profile & Statistical Summary

### 1. Structure & Completeness
- **Row Count**: 2,795 incident records
- **Column Count**: 48 attributes
- **Data Types**:
  - `float64`: 22 columns (volumes, costs, latitude, longitude, casualty counts)
  - `int64`: 5 columns (report numbers, operator ID, accident year, total costs)
  - `object` (strings/categorical): 21 columns (dates, location names, cause categories, pipeline types, liquid types)
- **High Missingness Columns (>50% Nulls)**:
  - `Liquid Name`: 92.1% missing (2,573 nulls)
  - Casualty breakdown columns (`Operator Employee Fatalities`, `Contractor Fatalities`, `Public Fatalities`, etc.): ~99.6%–99.7% missing (coded as `NaN` when 0)
  - `Intentional Release (Barrels)`: 56.7% missing (1,586 nulls)
  - `Restart Date/Time`: 52.0% missing (1,454 nulls)
  - `Shutdown Date/Time`: 50.3% missing (1,405 nulls)
  - `Liquid Subtype`: 51.7% missing (1,446 nulls)

---

### 2. Key Domain Distribution & Field Analysis

#### A. Casualty & Harm Distribution
- **Fatalities (`All Fatalities`)**:
  - Only **8 records out of 2,795** (0.29%) involved fatalities (6 incidents with 1 death, 2 incidents with 2 deaths).
  - 99.71% of pipeline accident records had zero recorded fatalities.
- **Injuries (`All Injuries`)**:
  - Only **12 records out of 2,795** (0.43%) involved injuries (8 incidents with 1 injury, 2 with 3 injuries, 1 with 2, 1 with 4).
- **Combined Casualty Rate**:
  - **14 total records** (0.50%) involved either a fatality or an injury.

#### B. Ignition & Explosion Fields
- **`Liquid Ignition`**: 95 incidents **YES** (3.40%), 2,700 incidents **NO** (96.60%).
- **`Liquid Explosion`**: 15 incidents **YES** (0.54%), 2,780 incidents **NO** (99.46%).

#### C. Cause Categories & Subcategories
- **Top Cause Categories** (0 missing):
  1. `MATERIAL/WELD/EQUIP FAILURE`: 1,435 incidents (51.34%)
  2. `CORROSION`: 592 incidents (21.18%)
  3. `INCORRECT OPERATION`: 378 incidents (13.52%)
  4. `NATURAL FORCE DAMAGE`: 118 incidents (4.22%)
  5. `ALL OTHER CAUSES`: 118 incidents (4.22%)
  6. `EXCAVATION DAMAGE`: 97 incidents (3.47%)
  7. `OTHER OUTSIDE FORCE DAMAGE`: 57 incidents (2.04%)
- **Top Subcategories**: `INTERNAL` corrosion (362), `PUMP OR PUMP-RELATED EQUIPMENT` (296), `NON-THREADED CONNECTION FAILURE` (286), `EXTERNAL` corrosion (230), `OTHER EQUIPMENT FAILURE` (204), `MALFUNCTION OF CONTROL/RELIEF EQUIPMENT` (171).

#### D. Release Volumes & Pipeline Characteristics
- **`Unintentional Release (Barrels)`**:
  - Mean: 207.2 bbls | Median: 2.0 bbls | Max: 30,565 bbls
  - 360 incidents (12.88%) released >100 barrels.
  - 93 incidents (3.33%) released >1,000 barrels.
- **`Pipeline Type`**: Aboveground (1,475 / 52.8%), Underground (985 / 35.2%), Tank (301 / 10.8%), Transition Area (16 / 0.6%).
- **`Liquid Type`**: Crude Oil (1,398 / 50.0%), Refined Petroleum Products (939 / 33.6%), HVL / Flammable Gas (418 / 15.0%), CO2 (38 / 1.4%).
- **`Pipeline Location`**: Onshore (2,777 / 99.4%), Offshore (18 / 0.6%).

#### E. Financial Impact & Costs
- **`All Costs`**: Mean: $834,033 | Median: $23,129 | Max: $840,526,100.
  - Costs > $100k: 746 incidents (26.69%)
  - Costs > $1M: 169 incidents (6.05%)

---

## 📋 DATASET ANALYSIS ANSWERS

### 1. What this dataset contains
This dataset contains **2,795 historical PHMSA hazardous liquid pipeline accident logs** from 2010 to 2017 in the United States. It captures physical infrastructure properties (pipeline type, location, commodity carried), root cause classifications, release volumes, ignition/explosion occurrences, casualty numbers, and financial damage costs.

### 2. Which columns are useful for PrecurAi
- **Operational Predictors**: `Cause Category`, `Cause Subcategory`, `Liquid Type`, `Liquid Subtype`, `Pipeline Type`, `Pipeline Location`, `Pipeline Shutdown`.
- **Severity Targets & Risk Metrics**: `Unintentional Release (Barrels)`, `Net Loss (Barrels)`, `Liquid Ignition`, `Liquid Explosion`, `All Fatalities`, `All Injuries`, `All Costs`.

### 3. Which columns should NOT be used
- **Data Leakage Columns** (Post-accident financial & response outcomes that are unknown prior to an incident): `Emergency Response Costs`, `Environmental Remediation Costs`, `Property Damage Costs`, `Public/Private Property Damage Costs`, `Liquid Recovery (Barrels)`, `Restart Date/Time`, `Shutdown Date/Time`.
- **Administrative Identifiers**: `Report Number`, `Supplemental Number`, `Operator ID`, `Operator Name`.
- **Extremely Sparse Breakdown Columns**: `Operator Employee Fatalities`, `Operator Contractor Fatalities`, `Public Fatalities`, etc. (Use the consolidated `All Fatalities` / `All Injuries` instead).

### 4. Whether it can support an ML risk/consequence model
**YES.** It can support a supervised Machine Learning model predicting **Pipeline Accident Consequence Severity** (e.g., classifying whether an operational pipeline failure will escalate into a **High-Consequence Event** featuring ignition, major release >100 bbls, severe financial loss >$1M, or casualty potential).

### 5. What it CANNOT prove about SIF precursor detection
> [!WARNING]  
> **Critical Domain Distinction**:
> 1. **Post-Accident vs. Precursor Observations**: This dataset contains ONLY records of accidents that **already occurred** and resulted in physical spills or equipment breaches.
> 2. **No Near-Miss or Unsafe Act Text**: It does **NOT** contain field safety observation notes, un-triggered near-miss reports, or unsafe act/condition text logs (e.g., "technician forgot lock out tag out" or "scaffolder unhooked harness").
> 3. **Cannot Train NLP Precursor Extractor**: This tabular dataset cannot be used to train an NLP model to extract Life-Saving Rules or precursor behavior from field text.

### 6. Recommended Next Step
Construct a composite **High-Consequence SIF Risk Target** (e.g., `High_Consequence_Event` defined by `Liquid Ignition == YES OR Release > 100 bbls OR Total Cost > $1M OR Casualty > 0`) to handle the extreme class imbalance (~0.29% raw fatalities) and train a transparent Machine Learning risk classifier (Random Forest / XGBoost / Logistic Regression) to assess pipeline failure consequence risks.
