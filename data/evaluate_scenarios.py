"""
PrecurAi - 5 Target Scenario Evaluation Script.
Evaluates predictions, probabilities across all classes, feature contributions,
and hazard-specific recommendations for the 5 benchmark scenarios.
"""

import os
import sys
import json
import joblib
import numpy as np

workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if workspace_dir not in sys.path:
    sys.path.insert(0, workspace_dir)

from ml.predict import predict_sif_potential, load_model_artifacts

clf, vec = load_model_artifacts()

scenarios = [
    {
        "id": "1",
        "name": "Scenario 1: Confined space + missing gas testing",
        "text": "During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry. The supervisor identified the issue and stopped the activity. No injury occurred."
    },
    {
        "id": "2",
        "name": "Scenario 2: Suspended load + worker exposure",
        "text": "During lifting operations, a suspended load was moved over an area where workers were present. The lifting activity was stopped after the unsafe condition was observed."
    },
    {
        "id": "3",
        "name": "Scenario 3: Energy isolation failure",
        "text": "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified. Residual pressure gauge was showing 140 PSI."
    },
    {
        "id": "4",
        "name": "Scenario 4: Low-risk PPE observation",
        "text": "An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified."
    },
    {
        "id": "5",
        "name": "Scenario 5: Vague insufficient-information report",
        "text": "Shift turnover completed smoothly. Routine safety observation logged by observer."
    }
]

print("==========================================================================")
print("              PRECURAI MODEL EVALUATION ACROSS 5 TARGET SCENARIOS         ")
print("==========================================================================\n")

for sc in scenarios:
    prediction = predict_sif_potential(sc["text"])
    
    tfidf = vec.transform([sc["text"]])
    probs = clf.predict_proba(tfidf)[0]
    
    print(f"--- {sc['name']} ---")
    print(f"Report Text: \"{sc['text']}\"")
    print(f"Predicted Class: {prediction['sif_potential']} (Confidence: {prediction['confidence'] * 100:.1f}%)")
    print("Class Probabilities:")
    for c, p in zip(clf.classes_, probs):
        print(f"   - {c:24s}: {p*100:5.1f}% ({p:.4f})")
    print(f"Detected Hazard: {prediction['hazard']}")
    print(f"Activity Context: {prediction['activity']}")
    print(f"Life-Saving Rule: {prediction['life_saving_rule']}")
    print(f"Top Contributing Features: {prediction['top_contributing_features']}")
    print(f"Recommended Action: \"{prediction['recommended_action']}\"\n")
