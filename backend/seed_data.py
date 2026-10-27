"""
Seed data generator for PrecurAi.
Populates realistic Oil & Gas field safety reports representing actual operating environments.
"""

import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import SafetyReport, HSEReview
from .nlp.engine import SIFIntelligenceEngine

SAMPLE_REPORTS = [
    {
        "title": "Rigging Standing Under Suspended Pipe Load",
        "report_text": "During crane lifting operations on FPSO Deck B, a rigger stood directly under a 12-ton pipe load being hoisted to the upper module. The tag line was loose and no exclusion zone barrier was placed.",
        "location": "FPSO Deck B (Offshore)",
        "unit_department": "Rigging & Lifting",
        "reporter_role": "HSE Safety Officer"
    },
    {
        "title": "Unisolated Hydrocarbon Valve Bypass",
        "report_text": "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified by permit issuer. Residual pressure gauge was showing 140 PSI.",
        "location": "Gas Processing Plant - Unit 3",
        "unit_department": "Maintenance & Piping",
        "reporter_role": "Permit Controller"
    },
    {
        "title": "Scaffold Working at 6m Without Harness Tie-Off",
        "report_text": "Scaffolder working at 6m height on platform piping rack without harness tie-off lanyard attached to anchor point. Guardrail was partially unbolted.",
        "location": "Refinery Distillation Platform",
        "unit_department": "Scaffolding Dept",
        "reporter_role": "Field Inspector"
    },
    {
        "title": "Confined Space Entry Without Gas Testing",
        "report_text": "Contractor entered crude oil storage tank T-201 sump for manual sludge inspection before atmospheric gas test for H2S and oxygen deficiency was conducted.",
        "location": "Terminal Tank Farm",
        "unit_department": "Tank Maintenance",
        "reporter_role": "Safety Specialist"
    },
    {
        "title": "Hot Work Spark Near Flammable Solvent Storage",
        "report_text": "Welder initiated hot work torch cutting on support bracket 2 meters away from unsealed diesel solvent storage drums without fire watch or fire blanket in place.",
        "location": "Central Workshop",
        "unit_department": "Mechanical Services",
        "reporter_role": "Fire Safety Officer"
    },
    {
        "title": "Driver Mobile Phone Usage in Rig Convoy",
        "report_text": "Heavy haulage pickup truck driver observed using handheld mobile phone while driving at 65 km/h along gravel rig access road during dusty wind condition.",
        "location": "Access Road Sector 4",
        "unit_department": "Logistics & Transport",
        "reporter_role": "Journey Management Supervisor"
    },
    {
        "title": "Bypassed ESD Emergency Interlock Button",
        "report_text": "Instrument engineer installed jumper wire overriding Emergency Shutdown (ESD) interlock on compressor C-302 without authorized bypass certificate.",
        "location": "Compressor Station 7",
        "unit_department": "Instrumentation & Control",
        "reporter_role": "Shift Operations Supervisor"
    },
    {
        "title": "Oil Spill on Deck Grating",
        "report_text": "Minor hydraulic oil leak from pump skid creating a slippery 1-meter oil stain on main walkway grating near eyewash station.",
        "location": "Pump House Deck",
        "unit_department": "Production Operations",
        "reporter_role": "Field Operator"
    },
    {
        "title": "Cardboard Box Trash Accumulation",
        "report_text": "Unstacked empty cardboard boxes and plastic wrapping left cluttering emergency eyewash access corridor outside electrical room.",
        "location": "Substation 2 Corridor",
        "unit_department": "Electrical Dept",
        "reporter_role": "Housekeeping Inspector"
    },
    {
        "title": "Faded Emergency Exit Sign Label",
        "report_text": "Photoluminescent emergency exit direction arrow sticker partially peeling and faded on lower level workshop exit door.",
        "location": "Control Building Basement",
        "unit_department": "Facility Management",
        "reporter_role": "HSE Auditor"
    }
]

def seed_database(db: Session, force: bool = False):
    if not force and db.query(SafetyReport).count() > 0:
        return {"status": "already_seeded", "count": db.query(SafetyReport).count()}

    engine = SIFIntelligenceEngine()

    for idx, sample in enumerate(SAMPLE_REPORTS, 1):
        analysis = engine.analyze_report(sample["report_text"])

        # Generate realistic historical timestamp in the last 14 days
        days_ago = random.randint(0, 14)
        created_dt = datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(1, 12))

        report_num = f"SIF-2026-{idx:04d}"

        # Create report record
        report = SafetyReport(
            report_number=report_num,
            title=sample["title"],
            report_text=sample["report_text"],
            location=sample["location"],
            unit_department=sample["unit_department"],
            reporter_role=sample["reporter_role"],
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
            review_status="REVIEWED" if idx <= 4 else ("OVERRIDDEN" if idx == 5 else "PENDING"),
            created_at=created_dt
        )

        db.add(report)
        db.flush()

        # Add sample HSE human-in-the-loop review for reviewed reports
        if idx <= 4:
            review = HSEReview(
                report_id=report.id,
                reviewer_name="Dr. Sarah Jenkins",
                reviewer_role="Lead HSE Engineer",
                action_taken="APPROVED_AI",
                original_sif_level=analysis["sif_potential"],
                review_notes="Verified AI classification. Immediate field barrier check requested.",
                action_item=f"Schedule toolbox talk on {analysis['life_saving_rule']}.",
                created_at=created_dt + timedelta(hours=2)
            )
            db.add(review)
        elif idx == 5:
            review = HSEReview(
                report_id=report.id,
                reviewer_name="Markus Vance",
                reviewer_role="Safety Manager",
                action_taken="OVERRIDDEN",
                original_sif_level="MEDIUM",
                override_sif_level="HIGH",
                review_notes="Overridden from Medium to High due to proximity of unsealed solvent drums.",
                action_item="Issue Stop Work Order and enforce 10m hot work clearance.",
                created_at=created_dt + timedelta(hours=1)
            )
            db.add(review)
            report.final_sif_level = "HIGH"

    db.commit()
    return {"status": "seeded_successfully", "count": db.query(SafetyReport).count()}
