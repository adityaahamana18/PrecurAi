"""
PNGRB Incident Report NLP Section & Metadata Parser.
Extracts structured sections, casualties, damages, normalized hazards, and LSR mappings
with page-level source traceability.
"""

import re
import logging
from typing import List, Dict, Any, Optional, Tuple
from .schema import (
    PNGRBExtractedReport,
    IncidentOverview,
    Casualties,
    Damages,
    SectionItem,
    SIFAssessment,
    LSRMapping,
    SourceReference,
    PageText
)
from .source_tracker import SourceTracker
from ..services.lsr_mapper import map_life_saving_rule

logger = logging.getLogger("precurai.report_parser")


class PNGRBReportParser:
    """Parses raw page-by-page text from PNGRB incident reports into structured JSON schema."""

    def __init__(self, filename: str, pages: List[PageText], is_scanned: bool = False, scan_warning: Optional[str] = None):
        self.filename = filename
        self.pages = pages
        self.is_scanned = is_scanned
        self.scan_warning = scan_warning
        self.tracker = SourceTracker(filename)
        self.full_text = "\n".join([f"[PAGE_{p.page_number}]\n{p.text}" for p in pages])

    def parse(self) -> PNGRBExtractedReport:
        """Main parsing routine returning complete PNGRBExtractedReport."""
        overview = self._extract_overview()
        casualties = self._extract_casualties()
        damages = self._extract_damages()
        
        findings = self._extract_section(["findings", "observation", "key finding"])
        root_causes = self._extract_section(["root cause", "causal analysis", "underlying cause"])
        immediate_causes = self._extract_section(["immediate cause", "direct cause", "unsafe act", "unsafe condition"])
        failed_controls = self._extract_section(["failed control", "safeguard failure", "control failure", "lapses"])
        recommendations = self._extract_section(["recommendation", "corrective action", "remedial action", "action plan"])

        normalized_hazards = self._extract_normalized_hazards()
        lsr_mappings = self._extract_lsr_mappings(normalized_hazards)
        sif_assessment = self._evaluate_sif_precursor(casualties, normalized_hazards, failed_controls)

        return PNGRBExtractedReport(
            filename=self.filename,
            total_pages=len(self.pages),
            is_scanned=self.is_scanned,
            scan_warning=self.scan_warning,
            overview=overview,
            casualties=casualties,
            damages=damages,
            findings=findings,
            root_causes=root_causes,
            immediate_causes=immediate_causes,
            failed_controls=failed_controls,
            recommendations=recommendations,
            normalized_hazards=normalized_hazards,
            life_saving_rules=lsr_mappings,
            sif_assessment=sif_assessment
        )

    def _extract_overview(self) -> IncidentOverview:
        """Extract title, date, location, company, and pipeline type."""
        first_page_text = self.pages[0].text if self.pages else ""
        
        # Title extraction (usually header or first line)
        title = None
        title_match = re.search(r"(?:Incident|Accident|Investigation)\s+Report[^\n]*\n+([^\n]+)", self.full_text, re.IGNORECASE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            first_lines = [line.strip() for line in first_page_text.split("\n") if len(line.strip()) > 10]
            title = first_lines[0] if first_lines else f"PNGRB Incident Report - {self.filename}"

        # Date extraction
        date_str = None
        date_match = re.search(
            r"(?:Date of Incident|Incident Date|Date|Occurred on)[:\s]+([0-9]{1,2}[-/\.][0-9]{1,2}[-/\.][0-9]{2,4}|[0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})",
            self.full_text,
            re.IGNORECASE
        )
        if date_match:
            date_str = date_match.group(1).strip()

        # Location extraction
        location = None
        loc_match = re.search(r"(?:Location|Site|District|State|Place of Incident)[:\s]+([^\n]+)", self.full_text, re.IGNORECASE)
        if loc_match:
            location = loc_match.group(1).strip()

        # Operator / Company
        operator = None
        op_match = re.search(r"(?:Operator|Entity|Company|Organization|Entity Name)[:\s]+([^\n]+)", self.full_text, re.IGNORECASE)
        if op_match:
            operator = op_match.group(1).strip()
        else:
            # Common Indian Oil & Gas Operators lookup
            for company in ["GAIL", "IOCL", "BPCL", "HPCL", "ONGC", "OIL", "Gujarat Gas", "Adani Total Gas", "Indraprastha Gas", "IGL", "MGL"]:
                if company.lower() in self.full_text.lower():
                    operator = company
                    break

        # Pipeline type
        pipeline_type = "Oil & Gas Pipeline"
        if re.search(r"\b(cgd|city gas distribution|png|cng)\b", self.full_text, re.IGNORECASE):
            pipeline_type = "City Gas Distribution (CGD)"
        elif re.search(r"\b(crude oil|liquid petroleum|petroleum product)\b", self.full_text, re.IGNORECASE):
            pipeline_type = "Crude / Liquid Petroleum Pipeline"
        elif re.search(r"\b(natural gas|cross country gas|trunk line)\b", self.full_text, re.IGNORECASE):
            pipeline_type = "Cross-Country Natural Gas Pipeline"

        # Summary
        summary = None
        sum_match = re.search(r"(?:Executive Summary|Summary of Incident|Brief Description)[:\s\n]+([^#\n\.\?]+[\.\n]{1,3}[^\n]+)", self.full_text, re.IGNORECASE)
        if sum_match:
            summary = sum_match.group(1).strip()[:400]
        else:
            summary = first_page_text[:300] if first_page_text else "PNGRB incident document."

        page_num = self.tracker.locate_phrase_page(self.pages, title or "report", 1)

        return IncidentOverview(
            title=title,
            incident_date=date_str,
            location=location,
            operator_company=operator,
            pipeline_type=pipeline_type,
            summary=summary,
            source=self.tracker.make_reference(page_num)
        )

    def _extract_casualties(self) -> Casualties:
        """Extract fatality and injury counts with details."""
        fatalities = 0
        injuries = 0
        details = None
        found_page = 1

        # Search for fatalities count
        fat_match = re.search(r"(\d+)\s*(?:fatality|fatalities|fatal|death|deaths|killed)", self.full_text, re.IGNORECASE)
        if fat_match:
            fatalities = int(fat_match.group(1))
            found_page = self.tracker.locate_phrase_page(self.pages, fat_match.group(0), 1)

        # Search for injuries count
        inj_match = re.search(r"(\d+)\s*(?:injury|injuries|injured|hospitalized)", self.full_text, re.IGNORECASE)
        if inj_match:
            injuries = int(inj_match.group(1))
            if found_page == 1:
                found_page = self.tracker.locate_phrase_page(self.pages, inj_match.group(0), 1)

        # Details summary
        detail_match = re.search(r"(?:Casualties|Injuries/Fatalities|Human Impact)[:\s\n]+([^\n]+)", self.full_text, re.IGNORECASE)
        if detail_match:
            details = detail_match.group(1).strip()

        return Casualties(
            fatalities=fatalities,
            injuries=injuries,
            details=details,
            source=self.tracker.make_reference(found_page)
        )

    def _extract_damages(self) -> Damages:
        """Extract property damage, environmental impact, and gas loss quantity."""
        cost = None
        env = None
        gas_loss = None
        found_page = 1

        cost_match = re.search(r"(?:Property Damage|Financial Loss|Cost Impact)[:\s]+([^\n]+)", self.full_text, re.IGNORECASE)
        if cost_match:
            cost = cost_match.group(1).strip()
            found_page = self.tracker.locate_phrase_page(self.pages, cost_match.group(0), 1)

        env_match = re.search(r"(?:Environmental Impact|Spill Volume|Pollution)[:\s]+([^\n]+)", self.full_text, re.IGNORECASE)
        if env_match:
            env = env_match.group(1).strip()

        gas_match = re.search(r"(\d+(?:\.\d+)?\s*(?:SCM|MMSCM|kg|MT|barrels|liters))\s*(?:gas|fuel|oil)?\s*(?:released|lost|leaked)", self.full_text, re.IGNORECASE)
        if gas_match:
            gas_loss = gas_match.group(0).strip()

        return Damages(
            property_damage_cost=cost,
            environmental_impact=env,
            gas_loss_quantity=gas_loss,
            source=self.tracker.make_reference(found_page)
        )

    def _extract_section(self, keywords: List[str]) -> List[SectionItem]:
        """Extract bullet points or paragraphs matching section header keywords across pages."""
        items: List[SectionItem] = []

        for p in self.pages:
            lines = p.text.split("\n")
            in_section = False
            
            for line in lines:
                clean_line = line.strip()
                if not clean_line:
                    continue

                # Header detection
                if any(re.search(rf"\b{kw}\b", clean_line, re.IGNORECASE) for kw in keywords) and len(clean_line) < 80:
                    in_section = True
                    continue
                
                # Exit section if another major header is encountered
                if in_section and re.match(r"^(?:[0-9]+\.|\b[A-Z\s]{4,}\b)", clean_line) and not any(kw in clean_line.lower() for kw in keywords):
                    if len(clean_line) < 60 and not clean_line.startswith("-"):
                        in_section = False

                if in_section:
                    # Strip bullet markers
                    text_content = re.sub(r"^[\-\*•\d+\.]\s*", "", clean_line).strip()
                    if len(text_content) > 15:
                        items.append(
                            SectionItem(
                                content=text_content,
                                source=self.tracker.make_reference(p.page_number)
                            )
                        )

        # Limit items to top 10 per section to keep payloads clean
        return items[:10]

    def _extract_normalized_hazards(self) -> List[str]:
        """Categorize findings and full text into standard Oil & Gas hazard categories."""
        hazards = set()
        text_lower = self.full_text.lower()

        hazard_patterns = {
            "Confined Space": [r"confined space", r"vessel entry", r"tank entry", r"pipeline trench entry"],
            "Energy Isolation (LOTO)": [r"isolation", r"lockout", r"tagout", r"blind", r"spade", r"depressurization"],
            "Line of Fire": [r"line of fire", r"pressurized release", r"flying debris", r"suspended load"],
            "Working at Height": [r"working at height", r"scaffolding", r"fall from", r"elevated platform"],
            "Hot Work": [r"hot work", r"welding", r"grinding", r"cutting", r"ignition source", r"spark"],
            "High Pressure Gas Release": [r"high pressure", r"gas release", r"rupture", r"blowout", r"leakage"],
            "Excavation / Third-Party Damage": [r"excavation", r"trench", r"third party", r"heavy machinery", r"backhoe", r"digger"],
            "Toxic Exposure / Asphyxiation": [r"h2s", r"toxic gas", r"asphyxiation", r"oxygen deficiency"],
            "Structural / Mechanical Failure": [r"corrosion", r"weld defect", r"joint failure", r"valve failure", r"flange leak"]
        }

        for category, patterns in hazard_patterns.items():
            if any(re.search(pat, text_lower) for pat in patterns):
                hazards.add(category)

        return list(hazards)

    def _extract_lsr_mappings(self, normalized_hazards: List[str]) -> List[LSRMapping]:
        """Map extracted hazards and text to Life-Saving Rules with exact source page."""
        mappings: List[LSRMapping] = []
        
        for hazard in normalized_hazards:
            rule_info = map_life_saving_rule(hazard, self.full_text)
            if rule_info.get("rule") != "No direct Life-Saving Rule match":
                page_num = self.tracker.locate_phrase_page(self.pages, hazard, 1)
                mappings.append(
                    LSRMapping(
                        rule=rule_info["rule"],
                        reason=rule_info["reason"],
                        source=self.tracker.make_reference(page_num)
                    )
                )

        return mappings

    def _evaluate_sif_precursor(self, casualties: Casualties, hazards: List[str], failed_controls: List[SectionItem]) -> SIFAssessment:
        """
        Evaluate SIF precursor potential for decision support.
        STATUS IS PERMANENTLY 'NOT_AUTOMATICALLY_LABELED' TO ENSURE COMPLIANCE.
        """
        high_risk_hazards = {
            "Confined Space",
            "Energy Isolation (LOTO)",
            "High Pressure Gas Release",
            "Toxic Exposure / Asphyxiation",
            "Working at Height",
            "Hot Work"
        }

        has_high_energy = any(h in high_risk_hazards for h in hazards)
        has_fatalities_or_injuries = casualties.fatalities > 0 or casualties.injuries > 0
        has_control_failures = len(failed_controls) > 0

        potential = "LOW"
        justifications = []

        if has_high_energy or has_fatalities_or_injuries:
            potential = "HIGH"
            if has_high_energy:
                justifications.append(f"Presence of high-energy hazard(s): {', '.join([h for h in hazards if h in high_risk_hazards])}.")
            if casualties.fatalities > 0:
                justifications.append(f"Recorded {casualties.fatalities} fatality(ies) in incident report.")
            elif casualties.injuries > 0:
                justifications.append(f"Recorded {casualties.injuries} injury(ies) in incident report.")
        elif hazards:
            potential = "MEDIUM"
            justifications.append(f"Identified operational hazard(s): {', '.join(hazards)}.")
        else:
            potential = "UNCERTAIN"
            justifications.append("Limited high-energy hazard indicators identified in extractable text.")

        if has_control_failures:
            justifications.append(f"Documented {len(failed_controls)} safety control failure(s).")

        return SIFAssessment(
            status="NOT_AUTOMATICALLY_LABELED",
            potential_precursor=potential,
            precursor_justification=" ".join(justifications),
            disclaimer="AI-generated decision support. Final assessment remains with qualified HSE personnel."
        )
