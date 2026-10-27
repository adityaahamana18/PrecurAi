"""
PrecurAi - Isolated Inference Layer Architecture
Provides an abstract base interface for precursor prediction and a modular
inference engine manager. Uses the trained ML model (TF-IDF + Logistic Regression)
when artifacts exist, with fallback to rule-based engine.
"""

import os
import sys
import logging
from abc import ABC, abstractmethod
from typing import Dict, List, Any

# Ensure root workspace directory is in sys.path for ml imports
workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if workspace_dir not in sys.path:
    sys.path.insert(0, workspace_dir)

logger = logging.getLogger("precurai.inference")


class BaseInferenceEngine(ABC):
    """
    Abstract Base Class for SIF Precursor Inference.
    All ML models, rule engines, or hybrid adapters must implement this interface.
    """
    @abstractmethod
    def predict(self, report_text: str) -> Dict[str, Any]:
        """
        Takes raw report text and returns structured precursor prediction dictionary.
        """
        pass


class MLModelInferenceEngine(BaseInferenceEngine):
    """
    Trained Machine Learning Inference Engine.
    Uses TF-IDF + Logistic Regression classifier with XAI & LSR mapper.
    """
    def __init__(self):
        from ml.predict import load_model_artifacts
        load_model_artifacts()

    def predict(self, report_text: str) -> Dict[str, Any]:
        if not report_text or not report_text.strip():
            raise ValueError("Report text cannot be empty.")

        from ml.predict import predict_sif_potential
        return predict_sif_potential(report_text)


class RuleBasedInferenceEngine(BaseInferenceEngine):
    """
    Modular Rule-Based & Pattern Matching Inference Adapter.
    Acts as fallback inference layer.
    """
    def predict(self, report_text: str) -> Dict[str, Any]:
        if not report_text or not report_text.strip():
            raise ValueError("Report text cannot be empty.")

        from ml.predict import predict_sif_potential
        return predict_sif_potential(report_text)


# Initialize ML engine with fallback
_ml_engine = None
try:
    _ml_engine = MLModelInferenceEngine()
    logger.info("Successfully loaded MLModelInferenceEngine (TF-IDF + Logistic Regression).")
except Exception as e:
    logger.warning(f"Could not load MLModelInferenceEngine: {e}. Falling back to RuleBasedInferenceEngine.")
    _ml_engine = None

_current_engine: BaseInferenceEngine = _ml_engine if _ml_engine is not None else RuleBasedInferenceEngine()


def get_inference_engine() -> BaseInferenceEngine:
    return _current_engine


def set_inference_engine(engine: BaseInferenceEngine) -> None:
    global _current_engine
    _current_engine = engine
