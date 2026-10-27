"""
PNGRB Service Module for handling PDF ingestion, directory batch processing,
and database persistence.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from ..document_processing.pdf_extractor import PDFExtractor
from ..document_processing.report_parser import PNGRBReportParser
from ..document_processing.schema import PNGRBExtractedReport
from ..models import PNGRBReport, PNGRBReportPage

logger = logging.getLogger("precurai.pngrb_service")

REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/pn_grb_reports"))
EXTRACTED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/pn_grb_extracted"))


def ensure_pngrb_directories():
    """Ensure data directories exist for PDF reports and JSON extractions."""
    os.makedirs(REPORTS_DIR, exist_ok=True)
    os.makedirs(EXTRACTED_DIR, exist_ok=True)


def process_pdf_file(filepath: str, db: Session) -> PNGRBExtractedReport:
    """
    Processes a single PDF file through extraction and parsing, saves output to DB and disk.
    """
    ensure_pngrb_directories()

    filename = os.path.basename(filepath)
    logger.info(f"Beginning processing for PNGRB report: {filename}")

    # Check if report already exists in DB
    existing = db.query(PNGRBReport).filter(PNGRBReport.filename == filename).first()
    if existing:
        logger.info(f"Report {filename} already processed. Returning stored record.")
        extracted_dict = json.loads(existing.extraction_json)
        return PNGRBExtractedReport(**extracted_dict)

    # Step 1: Extract PDF text page-by-page
    extractor = PDFExtractor(filepath)
    extraction_res = extractor.extract()

    # Step 2: Parse sections, casualties, damages, hazards, LSR
    parser = PNGRBReportParser(
        filename=filename,
        pages=extraction_res["pages"],
        is_scanned=extraction_res["is_scanned"],
        scan_warning=extraction_res["scan_warning"]
    )
    extracted_report = parser.parse()

    # Step 3: Write structured JSON to disk
    json_path = os.path.join(EXTRACTED_DIR, f"{filename}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(extracted_report.model_dump_json(indent=2))

    # Step 4: Persist DB record
    hazard_str = ", ".join(extracted_report.normalized_hazards[:2]) if extracted_report.normalized_hazards else "Pipeline Hazard"
    lsr_str = ", ".join([lsr.rule for lsr in extracted_report.life_saving_rules]) if extracted_report.life_saving_rules else "No Direct LSR Match"

    db_report = PNGRBReport(
        filename=filename,
        title=extracted_report.overview.title or filename,
        incident_date=extracted_report.overview.incident_date,
        location=extracted_report.overview.location,
        operator_company=extracted_report.overview.operator_company,
        pipeline_type=extracted_report.overview.pipeline_type,
        fatalities=extracted_report.casualties.fatalities,
        injuries=extracted_report.casualties.injuries,
        total_pages=extracted_report.total_pages,
        is_scanned=extracted_report.is_scanned,
        scan_warning=extracted_report.scan_warning,
        sif_status="NOT_AUTOMATICALLY_LABELED",
        potential_precursor=extracted_report.sif_assessment.potential_precursor,
        potential_hazard=hazard_str,
        life_saving_rule=lsr_str,
        extraction_json=extracted_report.model_dump_json()
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    # Store individual page texts for source verification
    for page in extraction_res["pages"]:
        db_page = PNGRBReportPage(
            report_id=db_report.id,
            page_number=page.page_number,
            page_text=page.text,
            char_count=page.char_count
        )
        db.add(db_page)

    db.commit()

    logger.info(f"Successfully ingested PNGRB report {filename} (ID: {db_report.id}).")
    return extracted_report


def process_directory(db: Session, directory_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Scans specified directory (or default data/pn_grb_reports) and ingests all un-processed PDFs.
    """
    ensure_pngrb_directories()
    target_dir = directory_path or REPORTS_DIR

    if not os.path.exists(target_dir):
        raise FileNotFoundError(f"Target directory does not exist: {target_dir}")

    pdf_files = [f for f in os.listdir(target_dir) if f.lower().endswith(".pdf")]
    results = []

    for filename in pdf_files:
        filepath = os.path.join(target_dir, filename)
        try:
            report_data = process_pdf_file(filepath, db)
            results.append({
                "filename": filename,
                "status": "SUCCESS",
                "total_pages": report_data.total_pages,
                "is_scanned": report_data.is_scanned,
                "potential_precursor": report_data.sif_assessment.potential_precursor
            })
        except Exception as e:
            logger.error(f"Error processing {filename}: {e}")
            results.append({
                "filename": filename,
                "status": "ERROR",
                "error": str(e)
            })

    return results


def get_all_reports(db: Session) -> List[Dict[str, Any]]:
    """Retrieve list of all ingested PNGRB reports."""
    reports = db.query(PNGRBReport).order_by(PNGRBReport.created_at.desc()).all()
    out = []
    for r in reports:
        out.append({
            "id": r.id,
            "filename": r.filename,
            "title": r.title,
            "incident_date": r.incident_date,
            "location": r.location,
            "operator_company": r.operator_company,
            "pipeline_type": r.pipeline_type,
            "fatalities": r.fatalities,
            "injuries": r.injuries,
            "total_pages": r.total_pages,
            "is_scanned": r.is_scanned,
            "sif_status": r.sif_status,
            "potential_precursor": r.potential_precursor,
            "potential_hazard": r.potential_hazard,
            "life_saving_rule": r.life_saving_rule,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
    return out


def get_report_by_id(report_id: int, db: Session) -> Optional[Dict[str, Any]]:
    """Retrieve full structured report payload by DB ID."""
    report = db.query(PNGRBReport).filter(PNGRBReport.id == report_id).first()
    if not report:
        return None
    
    extracted_data = json.loads(report.extraction_json)
    extracted_data["id"] = report.id
    return extracted_data


def get_page_text(report_id: int, page_number: int, db: Session) -> Optional[Dict[str, Any]]:
    """Retrieve raw text of a single page for source text verification."""
    report_page = (
        db.query(PNGRBReportPage)
        .filter(PNGRBReportPage.report_id == report_id, PNGRBReportPage.page_number == page_number)
        .first()
    )
    if not report_page:
        return None

    return {
        "report_id": report_id,
        "page_number": report_page.page_number,
        "page_text": report_page.page_text,
        "char_count": report_page.char_count
    }
