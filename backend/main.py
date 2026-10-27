"""
PrecurAi - FastAPI Application Server
Provides REST APIs for SIF precursor NLP analysis, report management,
human-in-the-loop HSE review, and executive safety dashboard analytics.
Includes POST /api/analyze with isolated inference service architecture.
"""

import os
import json
from typing import List, Optional
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from .database import engine, Base, get_db
from .models import SafetyReport, HSEReview, PNGRBReport, PNGRBReportPage
from .schemas import (
    AnalyzeV1Request,
    AnalyzeV1Response,
    AnalyzeReportRequest,
    AnalyzeReportResponse,
    SafetyReportResponse,
    HSEReviewCreate,
    HSEReviewResponse,
    DashboardStatsResponse
)
from .nlp.engine import SIFIntelligenceEngine
from .services.inference import get_inference_engine
from .seed_data import seed_database
from .api.pn_grb_routes import router as pngrb_router

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist; do not auto-seed sample reports on startup
    yield

app = FastAPI(
    title="PrecurAi - Safety Intelligence Platform API",
    description="PrecurAi — AI-powered Serious Injury & Fatality (SIF) precursor detection and HSE intelligence.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pngrb_router)

# --- Custom Exception Handlers ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({
            "error": "Validation Error",
            "message": "Invalid request payload. Ensure 'report_text' is a non-empty string.",
            "details": exc.errors()
        })
    )

nlp_engine = SIFIntelligenceEngine()

@app.get("/api/health")
def health_check():
    return {
        "platform": "PrecurAi",
        "system_status": "Operational",
        "disclaimer": "Decision support tool for HSE professionals. Does not predict accidents or autonomously decide safety actions."
    }

# --- Core V1 Analysis Endpoint (POST /api/analyze) ---

@app.post("/api/analyze", response_model=AnalyzeV1Response, status_code=status.HTTP_200_OK)
def analyze_report_v1(payload: AnalyzeV1Request):
    """
    Core Precursor Analysis Endpoint.
    Analyzes unstructured safety report text and returns structured precursor intelligence:
    sif_potential, confidence, hazard, activity, unsafe_condition, potential_consequence,
    life_saving_rule, evidence, and recommended_action.
    
    Uses modular Inference Layer Service architecture (BaseInferenceEngine adapter).
    """
    try:
        engine_instance = get_inference_engine()
        prediction = engine_instance.predict(payload.report_text)
        return prediction
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during precursor inference analysis: {str(e)}"
        )


from fastapi import UploadFile, File, Form
from .services.file_extractor import extract_file_content

@app.post("/api/analyze-file", status_code=status.HTTP_200_OK)
async def analyze_uploaded_file(
    file: UploadFile = File(...),
    site_location: Optional[str] = Form(None),
    unit_department: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Primary File Upload & Precursor Analysis Endpoint.
    Extracts unstructured safety text from uploaded PDF, DOCX, or TXT documents,
    executes precursor prediction using the existing inference engine, and persists the analysis.
    """
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded. Please select a valid PDF, DOCX, or TXT document.")

    try:
        contents = await file.read()
        extraction = extract_file_content(contents, file.filename)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File text extraction failed: {str(e)}")

    # Pass extracted text to EXISTING /api/analyze inference pipeline
    try:
        engine_instance = get_inference_engine()
        prediction = engine_instance.predict(extraction.full_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Precursor inference failed: {str(e)}")

    # Determine page numbers for evidence where available
    evidence_pages = []
    if extraction.pages:
        for ev in prediction.get("evidence", []):
            ev_lower = ev.lower()
            for p in extraction.pages:
                if ev_lower in p["text"].lower() and p["page"] not in evidence_pages:
                    evidence_pages.append(p["page"])
        evidence_pages.sort()

    # Save analysis result to existing report history database
    count = db.query(SafetyReport).count() + 1
    report_num = f"SIF-2026-{count:04d}"

    report = SafetyReport(
        report_number=report_num,
        title=f"Uploaded Document: {file.filename}",
        report_text=extraction.full_text,
        location=site_location or "Field Operations",
        unit_department=unit_department or prediction.get("activity", "General Operations"),
        reporter_role="Document Upload",
        sif_potential=prediction.get("sif_potential", "LOW"),
        confidence_score=prediction.get("confidence", 0.50),
        detected_hazard=prediction.get("hazard", "Unspecified"),
        activity=prediction.get("activity", "General Operations"),
        unsafe_category="Unsafe Act" if prediction.get("unsafe_act") else "Unsafe Condition",
        potential_consequence=prediction.get("potential_consequence", "None"),
        life_saving_rule=prediction.get("life_saving_rule", "No direct Life-Saving Rule match"),
        lsr_id=f"LSR_{prediction.get('life_saving_rule', '').upper().replace(' ', '_')}",
        explanation=prediction.get("explanation", ""),
        evidence_highlights_json=json.dumps([
            {"keyword": ev, "sentence": ev, "start": 0, "end": 0, "category": "Evidence Feature"}
            for ev in prediction.get("evidence", [])
        ]),
        recommended_action=prediction.get("recommended_action", "Routine follow-up"),
        review_status="PENDING",
        created_at=datetime.now(timezone.utc)
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        **prediction,
        "report_id": report.id,
        "report_number": report.report_number,
        "source_document": {
            "filename": file.filename,
            "file_type": extraction.file_type,
            "file_size_bytes": extraction.file_size_bytes,
            "total_pages": len(extraction.pages),
            "evidence_pages": evidence_pages,
            "is_scanned": extraction.is_scanned,
            "scan_warning": extraction.scan_warning
        },
        "extracted_text_preview": extraction.full_text[:400] + ("..." if len(extraction.full_text) > 400 else ""),
        "full_text": extraction.full_text
    }


# --- Full Dashboard & Persistence API Endpoints ---

@app.post("/api/reports/analyze", response_model=AnalyzeReportResponse)
def analyze_safety_report(payload: AnalyzeReportRequest):
    analysis = nlp_engine.analyze_report(payload.text)
    return analysis

@app.post("/api/reports", response_model=SafetyReportResponse, status_code=status.HTTP_201_CREATED)
def create_and_analyze_report(payload: AnalyzeReportRequest, db: Session = Depends(get_db)):
    analysis = nlp_engine.analyze_report(payload.text)
    count = db.query(SafetyReport).count() + 1
    report_num = f"SIF-2026-{count:04d}"

    report = SafetyReport(
        report_number=report_num,
        title=payload.title or "Safety Field Observation",
        report_text=payload.text,
        location=payload.location or "Offshore Rig",
        unit_department=payload.unit_department or "General Operations",
        reporter_role=payload.reporter_role or "Field Specialist",
        sif_potential=analysis["sif_potential"],
        confidence_score=analysis["confidence_score"],
        detected_hazard=analysis["detected_hazard"],
        activity=analysis["activity"],
        unsafe_category=analysis["unsafe_category"],
        potential_consequence=analysis["potential_consequence"],
        life_saving_rule=analysis["life_saving_rule"],
        lsr_id=analysis["lsr_id"],
        explanation=analysis["explanation"],
        evidence_highlights_json=json.dumps(analysis["evidence_highlights"]),
        recommended_action=analysis["recommended_action"],
        review_status="PENDING",
        created_at=datetime.now(timezone.utc)
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return format_report_response(report)

@app.get("/api/reports", response_model=List[SafetyReportResponse])
def get_safety_reports(
    query: Optional[str] = None,
    sif_potential: Optional[str] = None,
    review_status: Optional[str] = None,
    lsr: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    q = db.query(SafetyReport)
    if sif_potential:
        q = q.filter((SafetyReport.final_sif_level == sif_potential) | ((SafetyReport.final_sif_level == None) & (SafetyReport.sif_potential == sif_potential)))
    if review_status:
        q = q.filter(SafetyReport.review_status == review_status)
    if lsr and lsr != "ALL":
        q = q.filter(SafetyReport.life_saving_rule == lsr)
    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            (SafetyReport.title.ilike(search_pattern)) |
            (SafetyReport.report_text.ilike(search_pattern)) |
            (SafetyReport.report_number.ilike(search_pattern)) |
            (SafetyReport.detected_hazard.ilike(search_pattern))
        )

    reports = q.order_by(desc(SafetyReport.created_at)).limit(limit).all()
    return [format_report_response(r) for r in reports]

@app.get("/api/reports/{report_id}", response_model=SafetyReportResponse)
def get_report_detail(report_id: int, db: Session = Depends(get_db)):
    report = db.query(SafetyReport).filter(SafetyReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Safety report not found")
    return format_report_response(report)

@app.post("/api/reports/{report_id}/review", response_model=SafetyReportResponse)
def submit_hse_review(report_id: int, review_data: HSEReviewCreate, db: Session = Depends(get_db)):
    report = db.query(SafetyReport).filter(SafetyReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Safety report not found")

    review = HSEReview(
        report_id=report.id,
        reviewer_name=review_data.reviewer_name,
        reviewer_role=review_data.reviewer_role or "HSE Supervisor",
        action_taken=review_data.action_taken,
        original_sif_level=report.sif_potential,
        override_sif_level=review_data.override_sif_level,
        review_notes=review_data.review_notes,
        action_item=review_data.action_item,
        created_at=datetime.now(timezone.utc)
    )

    db.add(review)

    if review_data.action_taken == "OVERRIDDEN" and review_data.override_sif_level:
        report.final_sif_level = review_data.override_sif_level
        report.review_status = "OVERRIDDEN"
    else:
        report.review_status = "REVIEWED"

    db.commit()
    db.refresh(report)

    return format_report_response(report)

@app.get("/api/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(SafetyReport).count()
    reports = db.query(SafetyReport).all()
    high_count = sum(1 for r in reports if (r.final_sif_level or r.sif_potential) == "HIGH")
    medium_count = sum(1 for r in reports if (r.final_sif_level or r.sif_potential) == "MEDIUM")
    low_count = sum(1 for r in reports if (r.final_sif_level or r.sif_potential) == "LOW")

    pending_count = sum(1 for r in reports if r.review_status == "PENDING")
    reviewed_count = total - pending_count

    lsr_counts = {}
    for r in reports:
        lsr = r.life_saving_rule
        if lsr and lsr != "None Identified" and lsr != "No direct Life-Saving Rule match":
            lsr_counts[lsr] = lsr_counts.get(lsr, 0) + 1
    
    lsr_breakdown = [{"lsr_name": k, "count": v} for k, v in sorted(lsr_counts.items(), key=lambda x: x[1], reverse=True)]

    hazard_counts = {}
    for r in reports:
        h = r.detected_hazard
        if h and h != "Unspecified Hazard":
            hazard_counts[h] = hazard_counts.get(h, 0) + 1

    hazard_breakdown = [{"hazard": k, "count": v} for k, v in sorted(hazard_counts.items(), key=lambda x: x[1], reverse=True)]

    activity_counts = {}
    for r in reports:
        act = r.activity
        if act:
            activity_counts[act] = activity_counts.get(act, 0) + 1

    activity_breakdown = [{"name": k, "count": v} for k, v in sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)]

    high_risk_reports = [r for r in reports if (r.final_sif_level or r.sif_potential) == "HIGH"]
    high_risk_reports.sort(key=lambda x: x.created_at, reverse=True)
    top_high_risk = [format_report_response(r) for r in high_risk_reports[:5]]

    return {
        "total_reports": total,
        "high_sif_count": high_count,
        "medium_sif_count": medium_count,
        "low_sif_count": low_count,
        "pending_reviews_count": pending_count,
        "reviewed_count": reviewed_count,
        "lsr_violation_breakdown": lsr_breakdown,
        "top_hazards_breakdown": hazard_breakdown,
        "top_activities_breakdown": activity_breakdown,
        "recent_high_risk_reports": top_high_risk
    }

@app.get("/api/analytics/hse")
def get_hse_supporting_analytics():
    """
    Returns real metrics computed dynamically from cleaned supporting datasets
    (safety_observations_clean.csv, incident_register_clean.csv, training_records_clean.csv).
    """
    from .services import hse_analytics
    return {
        "observations_by_department": hse_analytics.get_observations_by_department(),
        "observations_by_location": hse_analytics.get_observations_by_location(),
        "observation_type_distribution": hse_analytics.get_observation_type_distribution(),
        "risk_level_distribution": hse_analytics.get_risk_level_distribution(),
        "incident_type_distribution": hse_analytics.get_incident_type_distribution(),
        "severity_distribution": hse_analytics.get_severity_distribution(),
        "near_miss_metrics": hse_analytics.get_near_miss_metrics(),
        "corrective_action_status": hse_analytics.get_corrective_action_status(),
        "training_status_distribution": hse_analytics.get_training_status_distribution(),
        "department_training_gaps": hse_analytics.get_department_training_gaps()
    }

@app.post("/api/seed")
def seed_data_endpoint(db: Session = Depends(get_db)):
    return seed_database(db, force=True)

# Mount frontend production build static files if present
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build index.html missing"}

def format_report_response(report: SafetyReport) -> dict:
    highlights = []
    if report.evidence_highlights_json:
        try:
            highlights = json.loads(report.evidence_highlights_json)
        except Exception:
            highlights = []

    return {
        "id": report.id,
        "report_number": report.report_number,
        "title": report.title,
        "report_text": report.report_text,
        "location": report.location,
        "unit_department": report.unit_department,
        "reporter_role": report.reporter_role,
        "sif_potential": report.sif_potential,
        "final_sif_level": report.final_sif_level,
        "confidence_score": report.confidence_score,
        "detected_hazard": report.detected_hazard,
        "activity": report.activity,
        "unsafe_category": report.unsafe_category,
        "potential_consequence": report.potential_consequence,
        "life_saving_rule": report.life_saving_rule,
        "lsr_id": report.lsr_id,
        "explanation": report.explanation,
        "evidence_highlights": highlights,
        "recommended_action": report.recommended_action,
        "review_status": report.review_status,
        "created_at": report.created_at,
        "reviews": [
            {
                "id": rev.id,
                "report_id": rev.report_id,
                "reviewer_name": rev.reviewer_name,
                "reviewer_role": rev.reviewer_role,
                "action_taken": rev.action_taken,
                "original_sif_level": rev.original_sif_level,
                "override_sif_level": rev.override_sif_level,
                "review_notes": rev.review_notes,
                "action_item": rev.action_item,
                "created_at": rev.created_at
            }
            for rev in report.reviews
        ]
    }
