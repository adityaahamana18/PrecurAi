# SIF Training Pipeline & Annotation Framework

**Project**: PrecurAi — Safety Intelligence Platform (SIH 2026)  
**Location**: `data/sif_training/`

---

## 1. Overview & Purpose

The `data/sif_training/` directory contains the technical schema, template, and annotation guidelines required to construct a defensible SIF (Serious Injury or Fatality) precursor training dataset for PrecurAi.

> [!IMPORTANT]
> **Dataset Separation Policy**:
> - Tabular log datasets (`safety_observations.csv`, `incident_register.csv`, `training_records.csv`) are located in `data/processed/` and serve **strictly for supporting analytics**.
> - SIF precursor NLP model training requires unstructured free-text safety narratives annotated according to the expert-grounded guidelines in [`labeling_guidelines.md`](file:///c:/Users/adity/OneDrive/Desktop/PrecurAi/data/sif_training/labeling_guidelines.md).

---

## 2. Directory Contents

| File Name | Description |
| :--- | :--- |
| [`schema.json`](file:///c:/Users/adity/OneDrive/Desktop/PrecurAi/data/sif_training/schema.json) | JSON Schema specifying required fields, allowed enums, evidence lists, and validation rules. |
| [`sample_template.csv`](file:///c:/Users/adity/OneDrive/Desktop/PrecurAi/data/sif_training/sample_template.csv) | Machine-readable CSV template with standard column headers for batch data annotation. |
| [`labeling_guidelines.md`](file:///c:/Users/adity/OneDrive/Desktop/PrecurAi/data/sif_training/labeling_guidelines.md) | Official HSE annotator guidelines defining SIF potential classes, energy thresholds, and evidence extraction. |
| `README.md` | This overview document. |

---

## 3. Standard Target Annotation Fields

Every training record in `sif_training` must comply with `schema.json` and contain the following 12 fields:

1. `report_id`: Unique identifier (string).
2. `report_text`: Unstructured free-text safety narrative (string).
3. `observation_type`: `Unsafe Act` \| `Unsafe Condition` \| `Near Miss` \| `Good Practice`.
4. `activity`: Operational activity (e.g., *Crane Lifting*, *Confined Space Entry*).
5. `hazard`: Primary hazard mechanism (e.g., *High Pressure Gas Release*, *Suspended Load*).
6. `unsafe_act`: Extracted human behavior phrase or `null`.
7. `unsafe_condition`: Extracted environmental hazard phrase or `null`.
8. `potential_consequence`: Credible worst-case safety consequence.
9. `life_saving_rule`: Applicable IOGP Life-Saving Rule or `"No direct Life-Saving Rule match"`.
10. `sif_potential`: Evaluated SIF precursor class (`HIGH` \| `MEDIUM` \| `LOW` \| `NOT_ENOUGH_INFORMATION`).
11. `evidence`: Array of exact verbatim text snippets quoted from `report_text`.
12. `annotator_notes`: Justification notes written by the HSE annotator.

---

## 4. Evaluated SIF Potential Classes

- **`HIGH`**: High-energy hazard present **AND** critical barrier (LOTO, gas testing, fall arrest, PSV, PTW) failed or missing.
- **`MEDIUM`**: Moderate energy hazard or partial barrier failure with low probability of fatality.
- **`LOW`**: Low energy hazard (housekeeping, ergonomics) with zero potential for serious injury/fatality.
- **`NOT_ENOUGH_INFORMATION`**: Vague or ambiguous text where hazard mechanism or barrier state cannot be determined.

---

## 5. Data Hygiene & Quality Control

1. **Inter-Annotator Agreement**: Dual HSE review required for all `HIGH` SIF precursor classifications.
2. **No Outcome Bias**: Annotations must evaluate *potential energy release and barrier status*, not actual injury outcome.
3. **Traceability**: All predictions and annotations must link to exact verbatim evidence phrases in the source narrative text.
