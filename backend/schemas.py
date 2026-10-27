"""
Pydantic schemas for PrecurAi API endpoints.
Includes standard v1 request/response validation schemas for /api/analyze.
Explicitly distinguishes actual outcome from potential SIF consequence.
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- V1 Endpoint Schemas (POST /api/analyze) ---

class ContributingFeatureSchema(BaseModel):
    feature: str = Field(..., description="N-gram text feature name")
    weight: float = Field(..., description="TF-IDF feature contribution weight (x_i * W_ki)")
    contribution: str = Field(..., description="positive or negative contribution direction")

class AnalyzeV1Request(BaseModel):
    report_text: str = Field(
        ...,
        min_length=3,
        max_length=10000,
        description="Unstructured safety report or field observation text"
    )

    @field_validator("report_text")

    def check_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("report_text cannot be blank or empty whitespace.")
        return v.strip()


class AnalyzeV1Response(BaseModel):
    sif_potential: str = Field(..., description="HIGH, MEDIUM, LOW, or NOT_ENOUGH_INFORMATION")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    hazard: str = Field(..., description="Detected safety hazard")
    activity: str = Field(..., description="Operational activity context")
    unsafe_act: Optional[str] = Field(None, description="Unsafe act description if applicable")
    unsafe_condition: Optional[str] = Field(None, description="Unsafe condition description if applicable")
    potential_consequence: str = Field(..., description="Severity of potential outcome")
    actual_outcome: Optional[str] = Field(None, description="Actual physical outcome reported in field text")
    life_saving_rule: str = Field(..., description="Mapped IOGP Life-Saving Rule name or 'No direct Life-Saving Rule match'")
    reason: Optional[str] = Field(None, description="Explanation of why the Life-Saving Rule applies")
    reference: Optional[str] = Field(None, description="Official IOGP standard rule reference source")
    evidence: List[str] = Field(..., description="Exact key phrase evidence snippets extracted from report")
    contributing_features: Optional[List[ContributingFeatureSchema]] = Field(None, description="Feature attribution weights from model")
    explanation: Optional[str] = Field("Model evaluation based on feature weights.", description="Human-readable explanation")
    recommended_action: str = Field(..., description="Recommended HSE review or decision support action")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "sif_potential": "HIGH",
                "confidence": 0.87,
                "hazard": "Confined Space",
                "activity": "Maintenance",
                "unsafe_condition": "Gas testing not completed",
                "potential_consequence": "Toxic exposure / asphyxiation",
                "actual_outcome": "No injury occurred (Supervisor intervention stopped activity)",
                "life_saving_rule": "Confined Space",
                "reason": "Activity involves entry into a confined space or vessel where hazardous atmosphere presents severe risk.",
                "reference": "IOGP Life-Saving Rule #2 - Confined Space Entry",
                "evidence": ["enter a confined space", "gas testing had not been completed"],
                "contributing_features": [
                    {"feature": "confined space", "weight": 1.42, "contribution": "positive"},
                    {"feature": "without gas", "weight": 1.15, "contribution": "positive"}
                ],
                "explanation": "Report classified as HIGH SIF Potential with 87% confidence based on active features: 'confined space' and 'without gas'.",
                "recommended_action": "HSE review of confined-space entry controls required."
            }
        }
    )


# --- Dashboard & Registry Schemas ---

class EvidenceHighlightSchema(BaseModel):
    keyword: str
    sentence: str
    start: int
    end: int
    category: str

class AnalyzeReportRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Unstructured safety report text")
    title: Optional[str] = "Safety Observation"
    location: Optional[str] = "Offshore Platform Alpha"
    unit_department: Optional[str] = "Drilling & Completions"
    reporter_role: Optional[str] = "Field Safety Observer"

class AnalyzeReportResponse(BaseModel):
    sif_potential: str
    confidence_score: float
    detected_hazard: str
    activity: str
    unsafe_category: str
    potential_consequence: str
    life_saving_rule: str
    lsr_id: str
    explanation: str
    evidence_highlights: List[EvidenceHighlightSchema]
    recommended_action: str

class HSEReviewCreate(BaseModel):
    reviewer_name: str = Field(..., min_length=2)
    reviewer_role: Optional[str] = "HSE Supervisor"
    action_taken: str = Field(..., description="APPROVED_AI, OVERRIDDEN, ESCALATED, CORRECTIVE_ACTION_ASSIGNED")
    override_sif_level: Optional[str] = None
    review_notes: Optional[str] = None
    action_item: Optional[str] = None

class HSEReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_id: int
    reviewer_name: str
    reviewer_role: str
    action_taken: str
    original_sif_level: Optional[str] = None
    override_sif_level: Optional[str] = None
    review_notes: Optional[str] = None
    action_item: Optional[str] = None
    created_at: datetime

class SafetyReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_number: str
    title: str
    report_text: str
    location: str
    unit_department: str
    reporter_role: str
    sif_potential: str
    final_sif_level: Optional[str] = None
    confidence_score: float
    detected_hazard: str
    activity: str
    unsafe_category: str
    potential_consequence: str
    life_saving_rule: str
    lsr_id: str
    explanation: str
    evidence_highlights: List[EvidenceHighlightSchema]
    recommended_action: str
    review_status: str
    created_at: datetime
    reviews: List[HSEReviewResponse] = []

class DashboardStatsResponse(BaseModel):
    total_reports: int
    high_sif_count: int
    medium_sif_count: int
    low_sif_count: int
    pending_reviews_count: int
    reviewed_count: int
    lsr_violation_breakdown: List[Dict[str, Any]]
    top_hazards_breakdown: List[Dict[str, Any]]
    top_activities_breakdown: Optional[List[Dict[str, Any]]] = []
    recent_high_risk_reports: List[SafetyReportResponse]
