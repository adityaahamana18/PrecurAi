"""
PrecurAi - Core NLP & SIF Precursor Intelligence Engine
Analyzes unstructured safety reports and extracts structured safety intelligence.
Produces explainable results with evidence highlights and HSE decision support recommendations.
"""

import re
from typing import Dict, List, Any
from .rules import (
    LIFE_SAVING_RULES,
    HIGH_ENERGY_HAZARDS,
    MODERATE_HAZARDS,
    LOW_HAZARDS,
    UNSAFE_ACT_INDICATORS,
    UNSAFE_CONDITION_INDICATORS,
    ACTIVITY_PATTERNS,
    OilGasRules
)

class SIFIntelligenceEngine:
    def __init__(self):
        self.rules = OilGasRules()

    def analyze_report(self, text: str) -> Dict[str, Any]:
        """
        Main analysis pipeline.
        Converts unstructured safety text into structured SIF precursor intelligence.
        """
        if not text or not text.strip():
            return self._empty_result()

        clean_text = text.strip()
        lower_text = clean_text.lower()

        # 1. Activity Extraction
        activity = self._extract_activity(lower_text)

        # 2. Unsafe Category (Act vs Condition)
        unsafe_category = self._classify_unsafe_category(lower_text)
        control_failure = self.rules.extract_control_failure(clean_text)

        # 3. Life-Saving Rule Mapping & Evidence Spans
        lsr_result = self._map_life_saving_rules(clean_text, lower_text)

        # 4. Hazard & Potential Consequence Extraction
        hazard_result = self._extract_hazard_and_consequence(lower_text)

        # 5. Determine SIF Potential Level & Calculate Confidence Score
        sif_potential, confidence_score, sif_reasoning = self._calculate_sif_potential(
            lsr_result, hazard_result, unsafe_category, lower_text
        )

        # 6. Generate Evidence Spans for Highlighting
        evidence_highlights = self._extract_evidence_highlights(clean_text, lsr_result, hazard_result)

        # 7. Formulate Explanation (combining evidence snippets)
        explanation = self._build_explanation(
            clean_text, sif_potential, hazard_result["hazard"], lsr_result["lsr_name"], sif_reasoning
        )

        # 8. Generate Recommended HSE Actions
        recommended_action = self._generate_hse_recommendation(
            sif_potential, hazard_result["hazard"], lsr_result["lsr_name"], unsafe_category
        )

        unsafe_condition = control_failure or (f"Hazardous condition in {hazard_result['hazard'].lower()}" if unsafe_category == "Unsafe Condition" else f"Missing or unverified safety controls during {activity.lower()}")

        return {
            "sif_potential": sif_potential,               # 1. SIF Potential: HIGH / MEDIUM / LOW
            "confidence_score": round(confidence_score, 2), # 2. Confidence Score (0.00 to 1.00)
            "detected_hazard": hazard_result["hazard"],   # 3. Detected Hazard
            "activity": activity,                         # 4. Activity
            "unsafe_category": unsafe_category,           # 5. Unsafe Act / Unsafe Condition
            "unsafe_condition": unsafe_condition,         # Extracted control failure / unsafe condition
            "potential_consequence": hazard_result["consequence"], # 6. Potential Consequence
            "life_saving_rule": lsr_result["lsr_name"],   # 7. Relevant Life-Saving Rule
            "lsr_id": lsr_result["lsr_id"],
            "explanation": explanation,                   # 8. Explanation showing evidence
            "evidence_highlights": evidence_highlights,   # Exact text spans for frontend highlight
            "recommended_action": recommended_action      # 9. Recommended HSE review/action
        }

    def _extract_activity(self, lower_text: str) -> str:
        for activity_name, keywords in ACTIVITY_PATTERNS.items():
            for kw in keywords:
                if kw in lower_text:
                    return activity_name
        return "General Plant Operations"

    def _classify_unsafe_category(self, lower_text: str) -> str:
        act_score = sum(1 for ind in UNSAFE_ACT_INDICATORS if ind in lower_text)
        cond_score = sum(1 for ind in UNSAFE_CONDITION_INDICATORS if ind in lower_text)

        if act_score > cond_score:
            return "Unsafe Act"
        elif cond_score > act_score:
            return "Unsafe Condition"
        else:
            # Default heuristic check: action verbs usually indicate acts
            if any(verb in lower_text for verb in ["did not", "failed", "bypassed", "walked", "stood", "left", "forgot"]):
                return "Unsafe Act"
            return "Unsafe Condition"

    def _map_life_saving_rules(self, clean_text: str, lower_text: str) -> Dict[str, Any]:
        best_rule = "None Identified"
        best_id = "LSR_NONE"
        max_matches = 0
        rule_weight = 0.0
        matched_keywords = []

        for rule_name, rule_data in LIFE_SAVING_RULES.items():
            matches = [kw for kw in rule_data["keywords"] if kw in lower_text]
            if len(matches) > max_matches:
                max_matches = len(matches)
                best_rule = rule_name
                best_id = rule_data["id"]
                rule_weight = rule_data["sif_weight"]
                matched_keywords = matches

        return {
            "lsr_name": best_rule,
            "lsr_id": best_id,
            "match_count": max_matches,
            "weight": rule_weight,
            "matched_keywords": matched_keywords
        }

    def _extract_hazard_and_consequence(self, lower_text: str) -> Dict[str, Any]:
        # Check High Energy Hazards first
        for h in HIGH_ENERGY_HAZARDS:
            if any(kw in lower_text for kw in h["keywords"]):
                return {
                    "hazard": h["name"],
                    "consequence": h["consequence"],
                    "sif_level": "HIGH",
                    "matched_kw": [kw for kw in h["keywords"] if kw in lower_text]
                }

        # Check Moderate Hazards
        for h in MODERATE_HAZARDS:
            if any(kw in lower_text for kw in h["keywords"]):
                return {
                    "hazard": h["name"],
                    "consequence": h["consequence"],
                    "sif_level": "MEDIUM",
                    "matched_kw": [kw for kw in h["keywords"] if kw in lower_text]
                }

        # Check Low Hazards
        for h in LOW_HAZARDS:
            if any(kw in lower_text for kw in h["keywords"]):
                return {
                    "hazard": h["name"],
                    "consequence": h["consequence"],
                    "sif_level": "LOW",
                    "matched_kw": [kw for kw in h["keywords"] if kw in lower_text]
                }

        return {
            "hazard": "Unspecified Field Hazard",
            "consequence": "Potential minor injury or operational delay",
            "sif_level": "LOW",
            "matched_kw": []
        }

    def _calculate_sif_potential(self, lsr_result: Dict[str, Any], hazard_result: Dict[str, Any], unsafe_category: str, lower_text: str):
        # Base SIF potential from hazard level
        hazard_level = hazard_result["sif_level"]
        lsr_matched = lsr_result["lsr_name"] != "None Identified"

        # Factors that elevate SIF potential to HIGH
        high_energy_indicators = ["high pressure", "high voltage", "h2s", "toxic", "suspended load", "scaffold", "confined space", "unisolated", "loto", "no tie-off", "open flame near hydrocarbon"]
        has_high_energy = any(ind in lower_text for ind in high_energy_indicators)

        if hazard_level == "HIGH" or (lsr_matched and has_high_energy):
            sif_potential = "HIGH"
            base_confidence = 0.88
            reasoning = "Report contains high-energy hazard indicators and/or direct Life-Saving Rule non-compliance."
        elif hazard_level == "MEDIUM" or lsr_matched:
            sif_potential = "MEDIUM"
            base_confidence = 0.78
            reasoning = "Report describes moderate operational risk with potential for escalation if unaddressed."
        else:
            sif_potential = "LOW"
            base_confidence = 0.70
            reasoning = "Report involves low-consequence hazard (e.g. housekeeping, wear and tear) without high-energy exposure."

        # Adjust confidence score based on signal strength
        evidence_count = lsr_result["match_count"] + len(hazard_result.get("matched_kw", []))
        confidence_boost = min(0.10, evidence_count * 0.03)
        confidence_score = min(0.98, max(0.60, base_confidence + confidence_boost))

        return sif_potential, confidence_score, reasoning

    def _extract_evidence_highlights(self, clean_text: str, lsr_result: Dict[str, Any], hazard_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        highlights = []
        lower_text = clean_text.lower()
        seen_spans = set()

        all_keywords = list(set(lsr_result.get("matched_keywords", []) + hazard_result.get("matched_kw", [])))

        for kw in all_keywords:
            if not kw:
                continue
            pattern = re.compile(re.escape(kw), re.IGNORECASE)
            for match in pattern.finditer(clean_text):
                start, end = match.span()
                # Expand to full sentence context if possible
                sent_start = max(0, clean_text.rfind('.', 0, start) + 1)
                sent_end = clean_text.find('.', end)
                if sent_end == -1:
                    sent_end = len(clean_text)
                
                snippet = clean_text[start:end]
                sentence_snippet = clean_text[sent_start:sent_end].strip()

                span_key = (start, end)
                if span_key not in seen_spans:
                    seen_spans.add(span_key)
                    highlights.append({
                        "keyword": snippet,
                        "sentence": sentence_snippet,
                        "start": start,
                        "end": end,
                        "category": "Life-Saving Rule Indicator" if kw in lsr_result.get("matched_keywords", []) else "Hazard Indicator"
                    })

        return highlights[:5]  # Limit to top 5 evidence highlights

    def _build_explanation(self, clean_text: str, sif_potential: str, hazard: str, lsr_name: str, sif_reasoning: str) -> str:
        parts = [
            f"Classification: SIF Potential evaluated as {sif_potential}.",
            f"Primary Hazard Detected: {hazard}.",
            f"Reasoning: {sif_reasoning}"
        ]
        if lsr_name != "None Identified":
            parts.append(f"Mapped IOGP Life-Saving Rule: '{lsr_name}'.")

        return " ".join(parts)

    def _generate_hse_recommendation(self, sif_potential: str, hazard: str, lsr_name: str, unsafe_category: str) -> str:
        if sif_potential == "HIGH":
            return (
                f"IMMEDIATE ACTION REQUIRED: Issue Stop Work Order for ongoing activity if unsafe conditions persist. "
                f"Conduct an immediate site audit focusing on {lsr_name if lsr_name != 'None Identified' else hazard}. "
                f"Verify LOTO / Isolation certificates, hold a mandatory pre-job safety briefing, and notify the HSE Duty Manager."
            )
        elif sif_potential == "MEDIUM":
            return (
                f"RECOMMENDED REVIEW: Assign an HSE Field Inspector to review {hazard} within 24 hours. "
                f"Reinforce workplace controls, inspect equipment/barrier integrity, and log corrective action items in the safety tracking system."
            )
        else:
            return (
                f"ROUTINE HSE FOLLOW-UP: Log housekeeping/maintenance item in routine work management system. "
                f"Discuss during weekly safety toolbox talk and confirm resolution during routine area walk-through."
            )

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "sif_potential": "LOW",
            "confidence_score": 0.50,
            "detected_hazard": "No text provided",
            "activity": "Unspecified",
            "unsafe_category": "Unspecified",
            "potential_consequence": "None",
            "life_saving_rule": "None Identified",
            "lsr_id": "LSR_NONE",
            "explanation": "No text content was provided for analysis.",
            "evidence_highlights": [],
            "recommended_action": "Please provide a valid safety report description."
        }
