"""
PrecurAi - Model Evaluation Module
Calculates Precision, Recall, F1-score, and Confusion Matrix for SIF classification.
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

def evaluate_model(y_true: List[str], y_pred: List[str], labels: List[str] = None) -> Dict[str, Any]:
    """
    Evaluates classification performance across Precision, Recall, F1-score, and Confusion Matrix.
    """
    if labels is None:
        labels = sorted(list(set(y_true) | set(y_pred)))

    cm = confusion_matrix(y_true, y_pred, labels=labels)
    prec_macro = precision_score(y_true, y_pred, labels=labels, average='macro', zero_division=0)
    rec_macro = recall_score(y_true, y_pred, labels=labels, average='macro', zero_division=0)
    f1_macro = f1_score(y_true, y_pred, labels=labels, average='macro', zero_division=0)

    prec_weighted = precision_score(y_true, y_pred, labels=labels, average='weighted', zero_division=0)
    rec_weighted = recall_score(y_true, y_pred, labels=labels, average='weighted', zero_division=0)
    f1_weighted = f1_score(y_true, y_pred, labels=labels, average='weighted', zero_division=0)

    cls_report = classification_report(y_true, y_pred, labels=labels, zero_division=0, output_dict=True)

    metrics = {
        "labels": labels,
        "confusion_matrix": cm.tolist(),
        "precision_macro": round(prec_macro, 4),
        "recall_macro": round(rec_macro, 4),
        "f1_macro": round(f1_macro, 4),
        "precision_weighted": round(prec_weighted, 4),
        "recall_weighted": round(rec_weighted, 4),
        "f1_weighted": round(f1_weighted, 4),
        "classification_report": cls_report
    }

    return metrics

def print_evaluation_summary(metrics: Dict[str, Any]):
    """
    Prints clean evaluation metrics to terminal.
    """
    print("\n" + "="*55)
    print("      SIF PRECURSOR MODEL EVALUATION METRICS")
    print("="*55)
    print(f"Target Labels: {metrics['labels']}")
    print(f"Macro Precision : {metrics['precision_macro']:.4f}")
    print(f"Macro Recall    : {metrics['recall_macro']:.4f}")
    print(f"Macro F1-Score  : {metrics['f1_macro']:.4f}")
    print("-" * 55)
    print(f"Weighted Precision: {metrics['precision_weighted']:.4f}")
    print(f"Weighted Recall   : {metrics['recall_weighted']:.4f}")
    print(f"Weighted F1-Score : {metrics['f1_weighted']:.4f}")
    print("\n--- CONFUSION MATRIX ---")
    labels = metrics['labels']
    cm = np.array(metrics['confusion_matrix'])
    print(f"{'True \\ Pred':15s} " + " ".join([f"{l:>10s}" for l in labels]))
    for i, label in enumerate(labels):
        row_str = " ".join([f"{cm[i, j]:10d}" for j in range(len(labels))])
        print(f"{label:15s} {row_str}")
    print("="*55 + "\n")
