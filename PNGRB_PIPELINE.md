# PNGRB Incident Report Ingestion & Analysis Pipeline

## Executive Overview
The Petroleum & Natural Gas Regulatory Board (PNGRB) Incident Investigation Pipeline enables PrecurAi to process official regulatory Oil & Gas incident documents. It converts unstructured multi-page PDF investigation reports into structured, auditable SIF precursor decision-support intelligence with strict page-level source traceability.

---

> [!IMPORTANT]
> **Safety Compliance Guardrail**:
> Official PNGRB incident investigation reports are **NOT** automatically labeled as SIF precursors.
> The system enforces `sif_assessment.status = "NOT_AUTOMATICALLY_LABELED"`.
> The output serves strictly as decision support for qualified HSE personnel.

---

## Technical Pipeline Architecture

```
┌───────────────────────────────┐
│ Official PNGRB PDF Document   │ (data/pn_grb_reports/*.pdf)
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ PDF Extractor                 │ PyMuPDF (fitz) + pdfplumber fallback
│ (pdf_extractor.py)            │ Scanned PDF / OCR warning detection
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Section & NLP Parser          │ Header regex & section segmentation
│ (report_parser.py)            │ Hazard normalization & IOGP LSR mapping
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Source Tracker                │ Attaches {"filename": "...", "page": X}
│ (source_tracker.py)           │ to every extracted item & recommendation
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Persistence & API Layer       │ SQLite (PNGRBReport, PNGRBReportPage)
│ (pn_grb_service.py)           │ JSON disk storage (data/pn_grb_extracted/)
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ React Frontend Dashboard      │ Report table, Detailed Intelligence,
│ (PNGRBReports.jsx)            │ Interactive "View Source Text" Modal
└───────────────────────────────┘
```

---

## JSON Schema Specification (`schema.py`)

All extracted reports follow a standardized JSON schema:

```json
{
  "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf",
  "total_pages": 3,
  "is_scanned": false,
  "scan_warning": null,
  "overview": {
    "title": "PNGRB Investigation Report - Hazira Pipeline",
    "incident_date": "14/03/2025",
    "location": "Surat, Gujarat",
    "operator_company": "GAIL (India) Limited",
    "pipeline_type": "Cross-Country Natural Gas Pipeline",
    "summary": "High-pressure natural gas release during hot work maintenance...",
    "source": { "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf", "page": 1 }
  },
  "casualties": {
    "fatalities": 0,
    "injuries": 2,
    "details": "Thermal burns from localized ignition",
    "source": { "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf", "page": 1 }
  },
  "damages": {
    "property_damage_cost": "INR 45 Lakhs",
    "environmental_impact": "Localized gas dispersion",
    "gas_loss_quantity": "18,500 SCM",
    "source": { "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf", "page": 3 }
  },
  "findings": [
    {
      "content": "Hot work commenced within 3m of pressurized flange without gas testing.",
      "source": { "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf", "page": 2 }
    }
  ],
  "root_causes": [
    {
      "content": "Inadequate PTW verification and failure to enforce LOTO energy isolation.",
      "source": { "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf", "page": 2 }
    }
  ],
  "normalized_hazards": [
    "Hot Work",
    "High Pressure Gas Release",
    "Energy Isolation (LOTO)"
  ],
  "life_saving_rules": [
    {
      "rule": "Hot Work",
      "reason": "Hot work sparks present near hydrocarbon release hazard.",
      "source": { "filename": "PNGRB_Incident_2025_GAIL_GasLeak.pdf", "page": 1 }
    }
  ],
  "sif_assessment": {
    "status": "NOT_AUTOMATICALLY_LABELED",
    "potential_precursor": "HIGH",
    "precursor_justification": "Presence of high-energy hazards: Hot Work, High Pressure Gas Release, LOTO.",
    "disclaimer": "AI-generated decision support. Final assessment remains with qualified HSE personnel."
  }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/pn-grb/upload` | Upload a PDF report file for immediate processing and persistence |
| `POST` | `/api/pn-grb/process-directory` | Batch process all un-ingested PDFs in `data/pn_grb_reports/` |
| `GET` | `/api/pn-grb/reports` | List all ingested PNGRB reports with summary metadata |
| `GET` | `/api/pn-grb/reports/{id}` | Fetch full structured extraction payload for report `{id}` |
| `GET` | `/api/pn-grb/reports/{id}/pages/{page_num}` | Fetch raw extracted text of page `{page_num}` for source verification |

---

## Verification & Testing
- All 26 backend unit & integration tests passing (`python -m pytest backend/tests/`).
- End-to-end PDF processing verified against sample report `PNGRB_Incident_2025_GAIL_GasLeak.pdf`.
- Production bundle compiled with 0 errors via `npx vite build`.
