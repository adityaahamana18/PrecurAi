"""
FastAPI Route Handlers for PNGRB Incident Report Ingestion & Analytics.
"""

import os
import shutil
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.pn_grb_service import (
    process_pdf_file,
    process_directory,
    get_all_reports,
    get_report_by_id,
    get_page_text,
    REPORTS_DIR
)

router = APIRouter(prefix="/api/pn-grb", tags=["PNGRB Incident Reports"])


@router.post("/upload", response_model=Dict[str, Any])
def upload_pngrb_report(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload an official PNGRB incident PDF report for text extraction and SIF precursor analysis.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files (.pdf) are supported.")

    os.makedirs(REPORTS_DIR, exist_ok=True)
    target_filepath = os.path.join(REPORTS_DIR, file.filename)

    try:
        with open(target_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded PDF: {str(e)}")

    try:
        extracted = process_pdf_file(target_filepath, db)
        return {
            "status": "SUCCESS",
            "message": f"Successfully ingested {file.filename}",
            "report": extracted.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF report: {str(e)}")


@router.post("/process-directory", response_model=Dict[str, Any])
def batch_process_directory(db: Session = Depends(get_db)):
    """
    Batch process all PDF reports in data/pn_grb_reports directory.
    """
    try:
        results = process_directory(db)
        return {
            "status": "SUCCESS",
            "total_files": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch processing error: {str(e)}")


@router.get("/reports", response_model=List[Dict[str, Any]])
def list_pngrb_reports(db: Session = Depends(get_db)):
    """
    List all ingested PNGRB incident reports with summary metadata.
    """
    return get_all_reports(db)


@router.get("/reports/{report_id}", response_model=Dict[str, Any])
def get_pngrb_report(report_id: int, db: Session = Depends(get_db)):
    """
    Get detailed structured extraction payload for a specific PNGRB report.
    """
    report = get_report_by_id(report_id, db)
    if not report:
        raise HTTPException(status_code=404, detail=f"PNGRB Report with ID {report_id} not found.")
    return report


@router.get("/reports/{report_id}/pages/{page_num}", response_model=Dict[str, Any])
def get_pngrb_report_page(report_id: int, page_num: int, db: Session = Depends(get_db)):
    """
    Get raw extracted text of a single page for 'View Source' verification.
    """
    page_data = get_page_text(report_id, page_num, db)
    if not page_data:
        raise HTTPException(
            status_code=404,
            detail=f"Page {page_num} for PNGRB Report {report_id} not found."
        )
    return page_data
