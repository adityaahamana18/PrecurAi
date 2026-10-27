"""
PrecurAi - Standalone IOGP Life-Saving Rule Mapping Module
Separates Life-Saving Rule knowledge mapping from ML model prediction.
Takes extracted hazard/activity/text context and deterministically maps to standard IOGP rules.
Returns rule, reason, and reference standard without forcing arbitrary classification.
"""

from typing import Dict, Any, Optional

# Structured IOGP Life-Saving Rules Knowledge Base
IOGP_LSR_KNOWLEDGE_BASE = {
    "Confined Space": {
        "rule_name": "Confined Space",
        "reference": "IOGP Life-Saving Rule #2 - Confined Space Entry",
        "triggers": [
            "confined space", "vessel entry", "storage tank", "reactor", "column",
            "sump", "trench", "excavation", "sewer", "gas testing", "without gas"
        ],
        "reason_template": "Activity involves entry into a confined space or vessel where hazardous atmosphere (toxic gas, oxygen deficiency, H2S) presents severe risk."
    },
    "Energy Isolation": {
        "rule_name": "Energy Isolation",
        "reference": "IOGP Life-Saving Rule #4 - Energy Isolation (LOTO)",
        "triggers": [
            "energy isolation", "loto", "lockout", "tagout", "unisolated", "live electrical",
            "pressurized line", "residual pressure", "zero energy", "blind flange", "valve opened"
        ],
        "reason_template": "Operation requires verification of zero energy state and positive isolation (LOTO) before opening lines or servicing equipment."
    },
    "Line of Fire": {
        "rule_name": "Line of Fire",
        "reference": "IOGP Life-Saving Rule #6 - Line of Fire & Sight",
        "triggers": [
            "line of fire", "line of sight", "suspended load", "under load", "under crane",
            "pinch point", "blind spot", "crane radius", "winch wire", "snap back", "moving equipment", "crush zone"
        ],
        "reason_template": "Personnel positioned in line of fire or direct crush zone of moving machinery, winch wires, or suspended loads."
    },
    "Working at Height": {
        "rule_name": "Working at Height",
        "reference": "IOGP Life-Saving Rule #9 - Working at Height",
        "triggers": [
            "working at height", "fall protection", "scaffold", "scaffolding", "harness", "lanyard",
            "tie-off", "anchor point", "open grating", "floor opening", "guardrail missing", "ladder"
        ],
        "reason_template": "Work conducted at elevated height (>1.8m) requiring 100% fall protection lanyard tie-off and guardrails."
    },
    "Hot Work": {
        "rule_name": "Hot Work",
        "reference": "IOGP Life-Saving Rule #5 - Hot Work Controls",
        "triggers": [
            "hot work", "welding", "cutting", "grinding", "spark", "open flame", "ignition source",
            "flammable atmosphere", "gas test", "fire watch", "combustible gas"
        ],
        "reason_template": "Hot work sparks or flame ignition source present near potential hydrocarbon gas release or combustible storage."
    },
    "Safe Mechanical Lifting": {
        "rule_name": "Safe Mechanical Lifting",
        "reference": "IOGP Life-Saving Rule #7 - Safe Mechanical Lifting",
        "triggers": [
            "mechanical lifting", "crane", "rigging", "sling", "shackle", "hoist", "lift plan",
            "overloaded", "tag line", "crane operator", "dropped load"
        ],
        "reason_template": "Lifting operations require a certified lift plan, inspected rigging gear, and exclusion zone barricades."
    },
    "Bypassing Safety Controls": {
        "rule_name": "Bypassing Safety Controls",
        "reference": "IOGP Life-Saving Rule #1 - Bypassing Safety Controls",
        "triggers": [
            "bypass", "disabling", "override", "interlock", "safety valve", "relief valve",
            "psv", "esd", "emergency shutdown", "gas detector disabled", "jumper"
        ],
        "reason_template": "Authorization and Management of Change (MOC) required before overriding or bridging safety-critical interlocks or relief valves."
    },
    "Work Authorization": {
        "rule_name": "Work Authorization",
        "reference": "IOGP Life-Saving Rule #8 - Work Authorization (PTW)",
        "triggers": [
            "permit to work", "ptw", "unpermitted", "expired permit", "jsa", "job safety analysis",
            "unauthorized work", "method statement"
        ],
        "reason_template": "Work requires a valid Permit to Work (PTW) and Job Safety Analysis (JSA) prior to execution."
    },
    "Driving": {
        "rule_name": "Driving",
        "reference": "IOGP Life-Saving Rule #3 - Safe Driving",
        "triggers": [
            "driving", "vehicle", "speeding", "seatbelt", "mobile phone", "distracted driving",
            "driver fatigue", "pickup truck", "tanker", "convoy"
        ],
        "reason_template": "Operation involves vehicle transport requiring seatbelts, speed limit compliance, and no mobile phone distraction."
    }
}


class LifeSavingRuleMapper:
    """
    Independent Rule Knowledge Base Mapping Engine.
    Maps hazard, activity, and report context to IOGP Life-Saving Rules.
    Never forces an arbitrary classification when no reliable trigger is found.
    """
    def map_lsr(self, hazard: str = "", activity: str = "", report_text: str = "") -> Dict[str, str]:
        """
        Takes extracted hazard, activity, and/or raw report text.
        Returns dictionary with:
        - rule: Name of the Life-Saving Rule or 'No direct Life-Saving Rule match'
        - reason: Explanation of why the rule applies
        - reference: Official IOGP standard rule reference
        """
        combined_context = f"{hazard} {activity} {report_text}".lower()

        best_rule = None
        max_trigger_matches = 0
        best_reason = ""
        best_ref = ""

        for key, rule_data in IOGP_LSR_KNOWLEDGE_BASE.items():
            matched_count = sum(1 for kw in rule_data["triggers"] if kw in combined_context)
            if matched_count > max_trigger_matches:
                max_trigger_matches = matched_count
                best_rule = rule_data["rule_name"]
                best_reason = rule_data["reason_template"]
                best_ref = rule_data["reference"]

        # Only return a rule match if there is at least 1 reliable keyword trigger
        if max_trigger_matches > 0 and best_rule:
            return {
                "rule": best_rule,
                "reason": best_reason,
                "reference": best_ref
            }

        # If no reliable rule matches threshold, NEVER force classification
        return {
            "rule": "No direct Life-Saving Rule match",
            "reason": "Hazard/activity context does not involve a high-energy Life-Saving Rule non-compliance indicator.",
            "reference": "IOGP Life-Saving Rules Framework (2018)"
        }


def map_life_saving_rule(hazard: str = "", report_text: str = "", activity: str = "") -> Dict[str, str]:
    """Module-level helper to map hazard/activity/text to IOGP Life-Saving Rule."""
    mapper = LifeSavingRuleMapper()
    return mapper.map_lsr(hazard=hazard, activity=activity, report_text=report_text)

