"""
Page-by-page PDF extraction module using PyMuPDF (fitz) with pdfplumber fallback.
Detects scanned PDFs when extractable text falls below minimum threshold.
"""

import os
import re
import logging
from typing import List, Dict, Any, Optional
from .schema import PageText

logger = logging.getLogger("precurai.pdf_extractor")

MIN_CHARS_PER_PAGE = 15  # Minimum character count to consider text valid rather than scanned image


class PDFExtractor:
    """Extracts text page-by-page from PDF documents with fallback and scanned detection."""

    def __init__(self, filepath: str):
        self.filepath = filepath
        self.filename = os.path.basename(filepath)

    def extract(self) -> Dict[str, Any]:
        """
        Extract page text and metadata from the target PDF file.
        Returns a dict with total_pages, pages (List[PageText]), is_scanned, scan_warning, full_text.
        """
        if not os.path.exists(self.filepath):
            raise FileNotFoundError(f"PDF file not found: {self.filepath}")

        pages: List[PageText] = []
        extraction_method = "pymupdf"

        try:
            pages = self._extract_with_pymupdf()
        except Exception as e:
            logger.warning(f"PyMuPDF extraction failed for {self.filename}: {e}. Retrying with pdfplumber.")
            try:
                pages = self._extract_with_pdfplumber()
                extraction_method = "pdfplumber"
            except Exception as e2:
                logger.error(f"pdfplumber extraction also failed for {self.filename}: {e2}")
                raise RuntimeError(f"Failed to extract text from PDF {self.filename}: {e2}") from e2

        # Check total extracted text for scanned document detection
        total_chars = sum(p.char_count for p in pages)
        total_pages = len(pages)

        is_scanned = False
        scan_warning = None

        if total_pages == 0 or (total_chars / max(total_pages, 1)) < MIN_CHARS_PER_PAGE:
            is_scanned = True
            scan_warning = (
                f"Document appears to be scanned or image-only ({total_chars} characters found across "
                f"{total_pages} pages). OCR processing is required for full extraction."
            )
            logger.warning(f"Scanned PDF detected for {self.filename}: {scan_warning}")

        full_text = "\n\n".join([f"--- PAGE {p.page_number} ---\n{p.text}" for p in pages])

        return {
            "filename": self.filename,
            "filepath": self.filepath,
            "total_pages": total_pages,
            "pages": pages,
            "is_scanned": is_scanned,
            "scan_warning": scan_warning,
            "extraction_method": extraction_method,
            "full_text": full_text
        }

    def _extract_with_pymupdf(self) -> List[PageText]:
        import fitz  # PyMuPDF
        
        doc = fitz.open(self.filepath)
        pages: List[PageText] = []

        for page_idx in range(len(doc)):
            page = doc[page_idx]
            text = page.get_text("text") or ""
            text = self._clean_text(text)
            char_count = len(re.sub(r"\s+", "", text))
            
            pages.append(
                PageText(
                    page_number=page_idx + 1,  # 1-indexed
                    text=text,
                    char_count=char_count
                )
            )

        doc.close()
        return pages

    def _extract_with_pdfplumber(self) -> List[PageText]:
        import pdfplumber

        pages: List[PageText] = []

        with pdfplumber.open(self.filepath) as pdf:
            for page_idx, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                text = self._clean_text(text)
                char_count = len(re.sub(r"\s+", "", text))

                pages.append(
                    PageText(
                        page_number=page_idx + 1,
                        text=text,
                        char_count=char_count
                    )
                )

        return pages

    @staticmethod
    def _clean_text(text: str) -> str:
        """Basic whitespace normalization."""
        # Replace non-breaking spaces
        text = text.replace("\xa0", " ")
        # Normalize carriage returns
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        return text.strip()
