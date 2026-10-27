"""
Structured JSON Pydantic Schemas for PNGRB Document Processing.
Enforces page-level source traceability and strict non-hallucination rules.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SourceReference(BaseModel):
    """Page-level source attribution tracking."""
    filename: str = Field(description="Source PDF filename")
    page: int = Field(description="Page number where the content was found (1-indexed)")


class PageText(BaseModel):
    """Raw text extracted from a single PDF page."""
    page_number: int
    text: str
    char_count: int


class IncidentOverview(BaseModel):
    """Key overview metadata of the PNGRB incident."""
    title: Optional[str] = None
    incident_date: Optional[str] = None
    location: Optional[str] = None
    operator_company: Optional[str] = None
    pipeline_type: Optional[str] = None
    pipeline_section: Optional[str] = None
    summary: Optional[str] = None
    source: SourceReference


class Casualties(BaseModel):
    """Fatalities and injuries recorded in the incident."""
    fatalities: int = 0
    injuries: int = 0
    details: Optional[str] = None
    source: SourceReference


class Damages(BaseModel):
    """Financial, property, and environmental damages."""
    property_damage_cost: Optional[str] = None
    environmental_impact: Optional[str] = None
    gas_loss_quantity: Optional[str] = None
    source: SourceReference


class SectionItem(BaseModel):
    """A extracted section finding, cause, control failure, or recommendation."""
    content: str
    source: SourceReference


class SIFAssessment(BaseModel):
    """
    SIF Precursor intelligence evaluation.
    STATUS MUST REMAIN 'NOT_AUTOMATICALLY_LABELED' per system safety policy.
    """
    status: str = "NOT_AUTOMATICALLY_LABELED"
    potential_precursor: Optional[str] = None  # HIGH, MEDIUM, LOW, or UNCERTAIN
    precursor_justification: Optional[str] = None
    disclaimer: str = (
        "AI-generated decision support. Final assessment remains with qualified HSE personnel."
    )


class LSRMapping(BaseModel):
    """Mapping to IOGP Life-Saving Rules with source page link."""
    rule: str
    reason: str
    source: SourceReference


class PNGRBExtractedReport(BaseModel):
    """
    Complete structured extraction model for PNGRB Incident Reports.
    """
    filename: str
    total_pages: int
    is_scanned: bool = False
    scan_warning: Optional[str] = None
    
    overview: IncidentOverview
    casualties: Casualties
    damages: Damages
    
    findings: List[SectionItem] = []
    root_causes: List[SectionItem] = []
    immediate_causes: List[SectionItem] = []
    failed_controls: List[SectionItem] = []
    recommendations: List[SectionItem] = []
    
    normalized_hazards: List[str] = []
    life_saving_rules: List[LSRMapping] = []
    sif_assessment: SIFAssessment = Field(default_factory=SIFAssessment)
    
    extracted_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
