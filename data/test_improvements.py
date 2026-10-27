"""
Experimental script to evaluate TF-IDF + Logistic Regression parameter & dataset improvements.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

ML_DIR = os.path.abspath(os.path.dirname(__file__))
DATASET_PATH = os.path.join(ML_DIR, "..", "data", "sif_training", "demo_sif_training.csv")

df = pd.read_csv(DATASET_PATH)
X = df["report_text"].fillna("")
y = df["sif_potential"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print(f"Dataset total: {len(df)} | Train: {len(X_train)} | Test: {len(X_test)}")

# Test Vectorizer with stop_words='english'
vec = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2),
    max_features=1500,
    min_df=1,
    sublinear_tf=True
)

X_train_tfidf = vec.fit_transform(X_train)
X_test_tfidf = vec.transform(X_test)

clf = LogisticRegression(
    C=2.0,
    max_iter=1000,
    class_weight="balanced",
    random_state=42
)
clf.fit(X_train_tfidf, y_train)

y_pred = clf.predict(X_test_tfidf)
print("\n--- CLASSIFICATION REPORT (With stop_words='english', C=2.0) ---")
print(classification_report(y_test, y_pred, zero_division=0))

scenarios = [
    ("Scenario 1 (Confined space)", "During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry. The supervisor identified the issue and stopped the activity. No injury occurred."),
    ("Scenario 2 (Suspended load)", "During lifting operations, a suspended load was moved over an area where workers were present. The lifting activity was stopped after the unsafe condition was observed."),
    ("Scenario 3 (Energy isolation)", "Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified. Residual pressure gauge was showing 140 PSI."),
    ("Scenario 4 (Low-risk PPE)", "An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified."),
    ("Scenario 5 (Vague report)", "Shift turnover completed smoothly. Routine safety observation logged by observer.")
]

print("\n=== EVALUATING 5 SCENARIOS ===")
for name, text in scenarios:
    tfidf = vec.transform([text])
    probs = clf.predict_proba(tfidf)[0]
    best_idx = np.argmax(probs)
    pred_label = clf.classes_[best_idx]
    score = probs[best_idx]
    
    print(f"\n{name}:")
    print(f"  Predicted: {pred_label} (Confidence: {score:.4f})")
    for c, p in zip(clf.classes_, probs):
        print(f"    - {c}: {p:.4f}")
