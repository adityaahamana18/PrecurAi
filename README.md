# PrecurAi — AI-powered Serious Injury & Fatality (SIF) Precursor Detection & HSE Intelligence

> **PrecurAi converts safety reports into explainable SIF-risk intelligence and helps HSE teams identify high-potential precursors and relevant Life-Saving Rules.**

---

## 🚀 Overview

**PrecurAi** is an AI-assisted safety intelligence platform designed for Oil & Gas operations. It analyzes unstructured safety field observations, near-miss narratives, unsafe acts/conditions, and regulatory incident reports to extract structured precursor intelligence.

### Key Capabilities
- **SIF Precursor Risk Rating**: Evaluates credible SIF potential (`HIGH`, `MEDIUM`, `LOW`, `NOT_ENOUGH_INFORMATION`) using high-energy hazard exposure and barrier failure analysis.
- **Explainable AI Engine**: Returns feature contribution weights, traceable text highlights, and human-readable explanations traceable directly to report narratives.
- **Life-Saving Rule Mapping**: Maps hazards and activities deterministically to standard IOGP Life-Saving Rules.
- **PNGRB Regulatory Ingestion Pipeline**: Ingests multi-page PDF investigation reports with page-level source traceability.
- **Human-in-the-Loop Verification**: Enables HSE Supervisors to review, verify, or override AI classifications with logged audit trails.

---

## 🏛️ Safety Compliance Guardrails

> [!IMPORTANT]
> **Advisory Disclaimer**:
> **PrecurAi** is an AI-generated decision support tool. Final safety assessments and operational decisions remain strictly with qualified HSE personnel. PrecurAi does **NOT** claim to predict accidents or autonomously order field shutdowns.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.13, FastAPI, SQLAlchemy, SQLite, Pydantic v2
- **NLP / ML**: scikit-learn (TF-IDF + Logistic Regression), PyMuPDF (fitz)
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons

---

## 🏁 Quick Start

### 1. Backend Setup & Server Execution
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Unit Tests
python -m pytest backend/tests/

# Start FastAPI Application Server (Port 8000)
python -m uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend Setup & Build
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Run Vite Development Server
npm run dev

# Production Build
npm run build
```

---

## 📌 API Endpoints Summary

- `POST /api/analyze`: Core v1 precursor classification endpoint.
- `GET /api/reports`: List historical safety reports and human reviews.
- `POST /api/reports`: Create & analyze a new field safety report.
- `POST /api/reports/{id}/review`: Submit HSE supervisor verification sign-off.
- `GET /api/dashboard/stats`: SIF precursor analytics and Life-Saving Rule statistics.
- `GET /api/analytics/hse`: Clean supporting dataset analytics.
- `GET /api/health`: Health status and platform branding verification.
