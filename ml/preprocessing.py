"""
PrecurAi - Text Preprocessing & Vectorization Module
Provides text cleaning and TF-IDF vectorization utilities for NLP safety report analysis.
"""

import re
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer

def clean_text(text: str) -> str:
    """
    Cleans raw safety report text.
    - Lowercases text
    - Removes non-alphanumeric characters except basic punctuation
    - Normalizes extra whitespace
    """
    if not text or not isinstance(text, str):
        return ""

    text = text.lower()
    # Remove URL links or emails if present
    text = re.sub(r'http\S+|www\S+|<[^>]+>', '', text)
    # Remove non-alphanumeric characters except single spaces and hyphens
    text = re.sub(r'[^a-z0-9\s\-]', ' ', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def build_vectorizer(ngram_range=(1, 2), max_features=1000) -> TfidfVectorizer:
    """
    Builds a TF-IDF vectorizer optimized for domain safety terminology.
    """
    return TfidfVectorizer(
        preprocessor=clean_text,
        ngram_range=ngram_range,
        max_features=max_features,
        sublinear_tf=True
    )
