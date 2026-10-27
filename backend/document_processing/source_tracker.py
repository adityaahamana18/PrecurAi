"""
Source tracking utility to guarantee page-level attribution for all extracted fields.
"""

from typing import List, Optional
from .schema import SourceReference, PageText


class SourceTracker:
    """Manages page-level source references for document fields."""

    def __init__(self, filename: str):
        self.filename = filename

    def make_reference(self, page_number: int) -> SourceReference:
        """Create a SourceReference object for a specific page."""
        return SourceReference(filename=self.filename, page=max(1, page_number))

    @staticmethod
    def locate_phrase_page(pages: List[PageText], phrase: str, default_page: int = 1) -> int:
        """
        Finds the 1-indexed page number containing a given phrase or keyword.
        Returns default_page if not found.
        """
        if not phrase:
            return default_page
            
        phrase_lower = phrase.lower().strip()
        for p in pages:
            if phrase_lower in p.text.lower():
                return p.page_number
                
        return default_page
