"""
SQLAlchemy ORM models for PrecurAi.
Stores safety reports, AI precursor analytics, human-in-the-loop HSE review logs,
and ingested PNGRB Incident Investigation Reports.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base


class SafetyReport(Base):
    __tablename__ = "safety_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String(50), unique=True, index=True)
    title = Column(String(200), nullable=False)
    report_text = Column(Text, nullable=False)
    location = Column(String(100), default="Offshore Platform Alpha")
    unit_department = Column(String(100), default="Drilling & Completions")
    reporter_role = Column(String(100), default="Field Safety Observer")

    # SIF Intelligence Fields
    sif_potential = Column(String(20), index=True)       # HIGH / MEDIUM / LOW
    confidence_score = Column(Float, default=0.0)
    detected_hazard = Column(String(200))
    activity = Column(String(200))
    unsafe_category = Column(String(50))                  # Unsafe Act / Unsafe Condition
    potential_consequence = Column(Text)
    life_saving_rule = Column(String(100), index=True)
    lsr_id = Column(String(50))
    explanation = Column(Text)
    evidence_highlights_json = Column(Text, default="[]") # Stored as JSON string
    recommended_action = Column(Text)

    # Human-in-the-Loop Management
    review_status = Column(String(30), default="PENDING", index=True) # PENDING / REVIEWED / OVERRIDDEN / ESCALATED
    final_sif_level = Column(String(20), nullable=True) # Set by HSE professional if overridden
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    reviews = relationship("HSEReview", back_populates="report", cascade="all, delete-orphan")


class HSEReview(Base):
    __tablename__ = "hse_reviews"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("safety_reports.id"), nullable=False)
    reviewer_name = Column(String(100), nullable=False)
    reviewer_role = Column(String(100), default="Senior HSE Engineer")
    action_taken = Column(String(50), nullable=False) # APPROVED_AI / OVERRIDDEN / ESCALATED / CORRECTIVE_ACTION_ASSIGNED
    original_sif_level = Column(String(20))
    override_sif_level = Column(String(20), nullable=True)
    review_notes = Column(Text)
    action_item = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("SafetyReport", back_populates="reviews")


class PNGRBReport(Base):
    """
    Ingested PNGRB Official Incident Investigation Document.
    """
    __tablename__ = "pngrb_reports"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(300))
    incident_date = Column(String(100))
    location = Column(String(200))
    operator_company = Column(String(200))
    pipeline_type = Column(String(150))
    fatalities = Column(Integer, default=0)
    injuries = Column(Integer, default=0)
    total_pages = Column(Integer, default=0)
    is_scanned = Column(Boolean, default=False)
    scan_warning = Column(Text, nullable=True)
    
    # Precursor Intelligence
    sif_status = Column(String(50), default="NOT_AUTOMATICALLY_LABELED", index=True)
    potential_precursor = Column(String(20), default="UNCERTAIN") # HIGH / MEDIUM / LOW / UNCERTAIN
    potential_hazard = Column(String(200))
    life_saving_rule = Column(String(200))
    
    # Complete JSON payload for audit and detailed views
    extraction_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    pages = relationship("PNGRBReportPage", back_populates="report", cascade="all, delete-orphan")


class PNGRBReportPage(Base):
    """
    Page-level text storage for PNGRB reports to support interactive 'View Source' verification.
    """
    __tablename__ = "pngrb_report_pages"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("pngrb_reports.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    page_text = Column(Text, nullable=False)
    char_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("PNGRBReport", back_populates="pages")
