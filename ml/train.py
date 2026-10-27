"""
Training script for PrecurAi Baseline Precursor Classifier.
Pipeline: report_text -> TF-IDF Vectorizer -> Logistic Regression -> sif_potential
Saves artifacts to ml/artifacts/ and outputs honest evaluation metrics.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

ML_DIR = os.path.abspath(os.path.dirname(__file__))
DATASET_PATH = os.path.join(ML_DIR, "..", "data", "sif_training", "demo_sif_training.csv")
ARTIFACTS_DIR = os.path.join(ML_DIR, "artifacts")


def train_baseline_model():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Demo training dataset not found at: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    print(f"Loaded training dataset from {DATASET_PATH} with {len(df)} rows.")

    X = df["report_text"].fillna("")
    y = df["sif_potential"]

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Train size: {len(X_train)} | Test size: {len(X_test)}")

    # TF-IDF Vectorizer with English stop-words filtering to prevent stop-word weight bias
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=1500,
        min_df=1,
        sublinear_tf=True
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Logistic Regression Classifier
    classifier = LogisticRegression(
        C=2.0,
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    )
    classifier.fit(X_train_tfidf, y_train)

    # Predictions & Evaluation
    y_pred = classifier.predict(X_test_tfidf)

    labels = sorted(list(y.unique()))
    report_dict = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    report_text_str = classification_report(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=labels)

    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)

    print("\n--- CLASSIFICATION REPORT ---")
    print(report_text_str)

    print("\n--- CONFUSION MATRIX ---")
    print(f"Labels: {labels}")
    print(cm)

    # Save artifacts
    model_path = os.path.join(ARTIFACTS_DIR, "sif_classifier.joblib")
    vectorizer_path = os.path.join(ARTIFACTS_DIR, "tfidf_vectorizer.joblib")
    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")

    joblib.dump(classifier, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    metrics_payload = {
        "model_type": "TF-IDF + Logistic Regression Baseline",
        "dataset_size": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "weighted_precision": round(float(precision), 4),
        "weighted_recall": round(float(recall), 4),
        "weighted_f1_score": round(float(f1), 4),
        "labels": labels,
        "confusion_matrix": cm.tolist(),
        "classification_report": report_dict,
        "disclaimer": "Baseline model trained on synthetic demo dataset for MVP evaluation. Not production ready."
    }

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"\nTrained model saved to: {model_path}")
    print(f"Vectorizer saved to: {vectorizer_path}")
    print(f"Metrics saved to: {metrics_path}")

    return metrics_payload


if __name__ == "__main__":
    train_baseline_model()
