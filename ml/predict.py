"""
Inference prediction module for PrecurAi.
Loads trained TF-IDF vectorizer and Logistic Regression classifier.
Integrates with Explainability engine and Life-Saving Rule mapper.
Generates hazard-specific decision support recommendations.
"""

import os
import joblib
import numpy as np
from typing import Dict, Any, List

from backend.services.lsr_mapper import map_life_saving_rule
from backend.nlp.rules import OilGasRules

ML_DIR = os.path.abspath(os.path.dirname(__file__))
ARTIFACTS_DIR = os.path.join(ML_DIR, "artifacts")

MODEL_PATH = os.path.join(ARTIFACTS_DIR, "sif_classifier.joblib")
VECTORIZER_PATH = os.path.join(ARTIFACTS_DIR, "tfidf_vectorizer.joblib")

_classifier = None
_vectorizer = None
_model = None


def load_model_artifacts():
    global _classifier, _vectorizer, _model
    if _classifier is None or _vectorizer is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
            raise FileNotFoundError("Trained ML model artifacts not found. Run `python ml/train.py` first.")
        _classifier = joblib.load(MODEL_PATH)
        _vectorizer = joblib.load(VECTORIZER_PATH)
        _model = _classifier
    return _classifier, _vectorizer


_load_artifacts = load_model_artifacts


def get_hazard_specific_recommendation(sif_potential: str, hazard: str, life_saving_rule: str) -> str:
    """
    Generates decision-support recommendations tailored specifically to the detected hazard and Life-Saving Rule.
    Does not provide generic fallback statements or make autonomous safety decisions.
    """
    if sif_potential == "NOT_ENOUGH_INFORMATION":
        return "Request reporter to provide additional details on task, location, and hazard controls."

    if sif_potential == "LOW":
        return "Log observation in HSE register and assign routine close-out task."

    hz_lower = (hazard or "").lower()
    lsr_lower = (life_saving_rule or "").lower()

    if sif_potential == "HIGH":
        if "confined space" in hz_lower or "confined space" in lsr_lower:
            return "Stop work and verify atmospheric testing, entry authorization and required confined-space controls before entry."
        elif "energy isolation" in hz_lower or "isolation" in lsr_lower or "loto" in hz_lower:
            return "Stop work and verify isolation, lockout/tagout and zero-energy state before maintenance."
        elif "line of fire" in lsr_lower or "sight" in lsr_lower or "suspended load" in hz_lower or "crane" in hz_lower or "lifting" in lsr_lower:
            return "Stop the activity and establish an exclusion zone; verify personnel are clear of the line of fire."
        elif "height" in hz_lower or "height" in lsr_lower or "scaffold" in hz_lower or "fall" in hz_lower:
            return "Stop work and verify fall protection, anchorage and access controls."
        elif "hot work" in hz_lower or "hot work" in lsr_lower or "welding" in hz_lower or "torch" in hz_lower:
            return "Stop work and verify hot-work authorization, gas testing and fire controls."
        elif "driving" in lsr_lower or "vehicle" in hz_lower or "excavator" in hz_lower:
            return "Stop activity and verify vehicle spotter, blind spot clearance and transport safety controls."
        else:
            return "Stop work and verify critical safety barriers, permit-to-work compliance, and risk controls."

    if sif_potential == "MEDIUM":
        if "confined space" in hz_lower or "confined space" in lsr_lower:
            return "HSE Supervisor review recommended: Inspect confined-space controls and brief crew at toolbox talk."
        elif "energy isolation" in hz_lower or "isolation" in lsr_lower or "electrical" in hz_lower:
            return "HSE Supervisor review recommended: Inspect energy isolation & lockout procedures and brief crew at toolbox talk."
        elif "suspended load" in hz_lower or "lifting" in lsr_lower or "crane" in hz_lower or "line of fire" in lsr_lower:
            return "HSE Supervisor review recommended: Inspect lifting gear, exclusion zone barriers and brief crew at toolbox talk."
        elif "height" in hz_lower or "height" in lsr_lower or "ladder" in hz_lower:
            return "HSE Supervisor review recommended: Inspect scaffolding, fall protection gear and brief crew at toolbox talk."
        elif "hot work" in hz_lower or "grinding" in hz_lower or "welding" in hz_lower:
            return "HSE Supervisor review recommended: Inspect fire watch, gas monitoring and brief crew at toolbox talk."
        else:
            return f"HSE Supervisor review recommended: Inspect {hazard.lower()} controls and brief crew at toolbox talk."

    return "HSE review recommended to verify hazard controls."


def predict_sif_potential(report_text: str) -> Dict[str, Any]:
    """
    Main inference function.
    Returns:
    - sif_potential: HIGH / MEDIUM / LOW / NOT_ENOUGH_INFORMATION
    - confidence: float score
    - hazard: string
    - activity: string
    - unsafe_act: string or null
    - unsafe_condition: string or null
    - potential_consequence: string
    - life_saving_rule: string
    - evidence: list of strings
    - recommended_action: string
    """
    if not report_text or not report_text.strip():
        return {
            "sif_potential": "NOT_ENOUGH_INFORMATION",
            "confidence": 0.0,
            "hazard": "Unspecified",
            "activity": "General Operations",
            "unsafe_act": None,
            "unsafe_condition": None,
            "potential_consequence": "No text provided",
            "life_saving_rule": "No direct Life-Saving Rule match",
            "evidence": [],
            "recommended_action": "Request reporter to provide additional details on task, location, and hazard controls."
        }

    clf, vec = load_model_artifacts()

    # Step 1: Feature Extraction & Classifier Prediction
    X_tfidf = vec.transform([report_text])
    probs = clf.predict_proba(X_tfidf)[0]
    classes = clf.classes_
    best_idx = np.argmax(probs)
    predicted_sif = str(classes[best_idx])
    confidence_score = round(float(probs[best_idx]), 2)

    # Step 2: Extract Top Model Feature Contributions (XAI)
    feature_names = np.array(vec.get_feature_names_out())
    tfidf_vector = X_tfidf.toarray()[0]
    non_zero_indices = np.where(tfidf_vector > 0)[0]
    
    coefs = clf.coef_[best_idx]
    feature_scores = []
    for idx in non_zero_indices:
        feat_name = feature_names[idx]
        score = tfidf_vector[idx] * coefs[idx]
        feature_scores.append((feat_name, score))
    
    feature_scores.sort(key=lambda x: x[1], reverse=True)
    top_contributing_words = [f[0] for f in feature_scores if f[1] > 0][:5]

    # Step 3: Domain Hazard & Activity Extraction (Rule-Based Helper)
    rules_engine = OilGasRules()
    extracted_hazard = rules_engine.extract_hazard(report_text)
    extracted_activity = rules_engine.extract_activity(report_text)
    unsafe_cat = rules_engine.extract_unsafe_category(report_text)
    consequence = rules_engine.extract_potential_consequence(extracted_hazard, report_text)
    
    control_failure = rules_engine.extract_control_failure(report_text)

    unsafe_act = None
    unsafe_condition = None
    if control_failure:
        unsafe_condition = control_failure
        if unsafe_cat == "Unsafe Act":
            unsafe_act = f"Unsafe behavior noted in {extracted_activity.lower()}"
    elif unsafe_cat == "Unsafe Act":
        unsafe_act = f"Unsafe behavior noted in {extracted_activity.lower()}"
        unsafe_condition = f"Missing or unverified safety controls during {extracted_activity.lower()}"
    else:
        unsafe_condition = f"Hazardous condition in {extracted_hazard.lower()}"

    # Step 4: Standalone Life-Saving Rule Mapping (NOT learned by classifier)
    lsr_result = map_life_saving_rule(
        hazard=extracted_hazard,
        activity=extracted_activity,
        report_text=report_text
    )
    life_saving_rule = lsr_result["rule"]

    # Step 5: Evidence Phrase Extraction from Text
    evidence_phrases = []
    text_lower = report_text.lower()
    
    key_snippets = [
        "confined space", "gas testing", "without gas", "lock-out tag-out", "loto",
        "working at height", "harness", "suspended load", "under crane", "high pressure",
        "6.6kv", "arc flash", "gas leak", "h2s", "hot work", "welding torch"
    ]
    for snip in key_snippets:
        if snip in text_lower:
            evidence_phrases.append(snip)

    if not evidence_phrases and top_contributing_words:
        evidence_phrases = top_contributing_words[:3]

    # Hazard-Specific Decision-Support Recommendation Formulation
    recommended_action = get_hazard_specific_recommendation(
        sif_potential=predicted_sif,
        hazard=extracted_hazard,
        life_saving_rule=life_saving_rule
    )

    return {
        "sif_potential": predicted_sif,
        "confidence": confidence_score,
        "hazard": extracted_hazard,
        "activity": extracted_activity,
        "unsafe_act": unsafe_act,
        "unsafe_condition": unsafe_condition,
        "potential_consequence": consequence,
        "life_saving_rule": life_saving_rule,
        "evidence": evidence_phrases[:5],
        "recommended_action": recommended_action,
        "top_contributing_features": top_contributing_words
    }
