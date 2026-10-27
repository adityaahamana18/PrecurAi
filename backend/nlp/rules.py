"""
PrecurAi - Oil & Gas Safety Intelligence Taxonomy & Rules
Contains IOGP Life-Saving Rules (LSR), high-energy hazard indicators,
Unsafe Act vs. Unsafe Condition pattern definitions, and SIF precursor evaluation criteria.
"""

import re

# Standard IOGP 9 Life-Saving Rules definitions and associated trigger patterns
LIFE_SAVING_RULES = {
    "Bypassing Safety Controls": {
        "id": "LSR_BYPASS",
        "description": "Obtain authorization before bypassing or disabling safety controls.",
        "icon": "ShieldAlert",
        "keywords": [
            "bypass", "bypassed", "disabling", "disabled", "override", "overridden", 
            "interlock", "safety valve", "relief valve", "psv", "esd", "emergency shutdown",
            "gas detector disabled", "alarm silenced", "bridged", "jumper", "tampered", "tripped manually"
        ],
        "sif_weight": 0.85
    },
    "Confined Space": {
        "id": "LSR_CONFINED_SPACE",
        "description": "Obtain authorization before entering a confined space.",
        "icon": "Box",
        "keywords": [
            "confined space", "vessel entry", "storage tank", "reactor", "column", "sump",
            "trench", "excavation", "sewer", "vault", "atmospheric test", "oxygen deficiency",
            "toxic gas", "h2s", "hydrogen sulfide", "lel", "manhole", "gas testing missing"
        ],
        "sif_weight": 0.90
    },
    "Driving": {
        "id": "LSR_DRIVING",
        "description": "Follow safe driving rules (speed, seatbelts, distraction, fatigue).",
        "icon": "Truck",
        "keywords": [
            "driving", "vehicle", "speeding", "seatbelt", "mobile phone", "distracted driving",
            "driver fatigue", "pickup truck", "tanker", "convoy", "rollover", "reversing without spotter"
        ],
        "sif_weight": 0.70
    },
    "Energy Isolation": {
        "id": "LSR_ENERGY_ISOLATION",
        "description": "Verify isolation and zero energy state before work begins.",
        "icon": "ZapOff",
        "keywords": [
            "energy isolation", "loto", "lockout", "tagout", "unisolated", "live electrical",
            "pressurized line", "residual pressure", "zero energy", "blind flange", "spade",
            "bleed valve", "valve opened", "de-energize", "high voltage", "circuit breaker"
        ],
        "sif_weight": 0.92
    },
    "Hot Work": {
        "id": "LSR_HOT_WORK",
        "description": "Control flammables and ignition sources during hot work.",
        "icon": "Flame",
        "keywords": [
            "hot work", "welding", "cutting", "grinding", "spark", "open flame", "ignition source",
            "flammable atmosphere", "gas test", "fire watch", "combustible gas", "hydrocarbon leak",
            "diesel generator", "torch", "welding machine"
        ],
        "sif_weight": 0.88
    },
    "Line of Sight": {
        "id": "LSR_LINE_OF_SIGHT",
        "description": "Position yourself outside the line of sight of moving equipment and suspended loads.",
        "icon": "EyeOff",
        "keywords": [
            "line of sight", "suspended load", "under load", "under a", "under crane", "pinch point", "blind spot",
            "crane radius", "winch wire", "snap back", "moving equipment", "excavator arm",
            "forklift path", "counterweight", "crush zone", "stood under"
        ],
        "sif_weight": 0.85
    },
    "Safe Mechanical Lifting": {
        "id": "LSR_SAFE_LIFTING",
        "description": "Plan lifting operations and control the area.",
        "icon": "Anchor",
        "keywords": [
            "mechanical lifting", "crane", "lifted by crane", "rigging", "sling", "shackle", "hoist", "lift plan",
            "overloaded", "tag line", "rigger", "crane operator", "boom", "outrigger", "exclusion zone",
            "dropped load", "lifting gear defect", "pipe load", "heavy lift"
        ],
        "sif_weight": 0.87
    },
    "Work Authorization": {
        "id": "LSR_WORK_AUTH",
        "description": "Work with a valid Permit to Work (PTW) when required.",
        "icon": "FileCheck",
        "keywords": [
            "permit to work", "ptw", "unpermitted", "expired permit", "jsa", "job safety analysis",
            "toolbox talk", "risk assessment", "unauthorized work", "scope change", "method statement"
        ],
        "sif_weight": 0.75
    },
    "Working at Height": {
        "id": "LSR_WORKING_AT_HEIGHT",
        "description": "Protect yourself against falls from height.",
        "icon": "TrendingUp",
        "keywords": [
            "working at height", "fall protection", "scaffold", "scaffolding", "harness", "lanyard",
            "tie-off", "anchor point", "open grating", "floor opening", "guardrail missing",
            "elevated platform", "mewp", "cherry picker", "ladder", "fall hazard"
        ],
        "sif_weight": 0.90
    }
}

# High-Energy Hazards Indicator Patterns (SIF Precursors)
HIGH_ENERGY_HAZARDS = [
    {
        "name": "Fall from Height (>2m)",
        "keywords": ["fall from height", "scaffold", "harness unhooked", "no tie-off", "open grating", "roof work", "ladder fall", "working at 6m", "working at height"],
        "consequence": "Fatal fall or severe poly-trauma",
        "sif_level": "HIGH"
    },
    {
        "name": "Live Electrical / Arc Flash (>440V)",
        "keywords": ["high voltage", "arc flash", "live conductor", "transformer", "substation", "switchgear", "unisolated cable"],
        "consequence": "Electrocution or severe thermal burns",
        "sif_level": "HIGH"
    },
    {
        "name": "Toxic Atmosphere / Gas Exposure (H2S / CO / Low O2)",
        "keywords": ["h2s", "hydrogen sulfide", "toxic gas", "asphyxiation", "oxygen deficient", "gas release", "sour gas"],
        "consequence": "Immediate fatality or permanent respiratory collapse",
        "sif_level": "HIGH"
    },
    {
        "name": "Pressurized System Release (>100 PSI / Hydrocarbon)",
        "keywords": ["high pressure", "pressurized line", "line rupture", "pipe burst", "hydrocarbon leak", "valve blowback", "flange leak", "hydrocarbon line"],
        "consequence": "High-velocity projectile impact or hydrocarbon explosion",
        "sif_level": "HIGH"
    },
    {
        "name": "Suspended Load Impact / Crane Failure",
        "keywords": ["suspended load", "crane lift", "lifted by crane", "pipe load", "rigging failure", "dropped object", "snapped cable", "crush hazard", "under load", "under a 12-ton", "stood under"],
        "consequence": "Crush injury or fatality from falling heavy equipment",
        "sif_level": "HIGH"
    },
    {
        "name": "Confined Space Trapping / Engulfment",
        "keywords": ["confined space entry", "vessel sump", "excavation collapse", "trench cave-in", "engulfment", "tank entry", "confined space"],
        "consequence": "Asphyxiation or fatal compression",
        "sif_level": "HIGH"
    },
    {
        "name": "Ignition of Hydrocarbon Atmosphere / Explosion",
        "keywords": ["hot work near hydrocarbon", "spark near gas leak", "welding on live pipe", "explosive atmosphere", "lel alarm", "ignition source near gas"],
        "consequence": "Explosion, fire blast, or fatal thermal burns",
        "sif_level": "HIGH"
    }
]

MODERATE_HAZARDS = [
    {
        "name": "Slip, Trip, or Low Fall (<1m)",
        "keywords": ["slip", "trip", "uneven ground", "oil stain on floor", "extension cord", "cluttered walkway"],
        "consequence": "Minor fracture, sprain, or strain",
        "sif_level": "MEDIUM"
    },
    {
        "name": "Pinch Point / Hand Tool Injury",
        "keywords": ["pinch point", "hand tool", "grinder guard missing", "hammer impact", "sharp edge", "glove torn"],
        "consequence": "Laceration or finger crush injury",
        "sif_level": "MEDIUM"
    },
    {
        "name": "Material Handling / Ergonomic Strain",
        "keywords": ["heavy lifting manual", "ergonomic", "back strain", "improper posture", "overexertion"],
        "consequence": "Musculoskeletal strain",
        "sif_level": "MEDIUM"
    },
    {
        "name": "Minor Chemical Splash",
        "keywords": ["chemical splash", "eye wash", "lubricant contact", "cleaning solvent", "skin irritation"],
        "consequence": "Localized skin/eye irritation",
        "sif_level": "MEDIUM"
    }
]

LOW_HAZARDS = [
    {
        "name": "Housekeeping / Storage Disarray",
        "keywords": ["trash", "housekeeping", "litter", "unstacked pallets", "cardboard boxes", "dust accumulation"],
        "consequence": "Minor inconvenience or minor trip hazard",
        "sif_level": "LOW"
    },
    {
        "name": "Paperwork / Administrative Gap",
        "keywords": ["sign-in missing", "expired sticker", "label faded", "paperwork delayed", "board not updated"],
        "consequence": "Administrative non-compliance",
        "sif_level": "LOW"
    },
    {
        "name": "Minor Equipment Wear (Non-Critical)",
        "keywords": ["paint chipping", "minor rust", "loose handle", "scratched goggle", "worn boots tread"],
        "consequence": "Minor wear requiring routine maintenance",
        "sif_level": "LOW"
    }
]

# Patterns for Unsafe Act vs Unsafe Condition
UNSAFE_ACT_INDICATORS = [
    "worker did not", "operator failed to", "employee bypassed", "standing under", "stood under", "not wearing harness",
    "forgot to", "refused to", "without permit", "entered without testing", "removed guard", "driving while",
    "did not tie off", "ignored warning", "operated without authorization", "unhooked lanyard", "rigger stood",
    "technician opened", "welder started without fire watch", "did not lock out", "bypassed interlock", "without tag line"
]

UNSAFE_CONDITION_INDICATORS = [
    "rusted handrail", "broken guardrail", "leaking valve", "uncalibrated sensor", "corroded pipe",
    "missing safety pin", "damaged sling", "frayed wire", "slippery oil deck", "faulty pressure gauge",
    "lighting broken", "crack in weld", "inadequate barrier", "defective ladder", "open hole in platform",
    "valve left unisolated", "pressure gauge stuck"
]

# Activity extraction keyword patterns
ACTIVITY_PATTERNS = {
    "Hot Work & Welding": ["welding", "grinding", "flame cutting", "torch work", "soldering", "brazing"],
    "Working at Height & Scaffolding": ["scaffolding erection", "platform work", "roof inspection", "scaffold dismantling", "ladder climbing", "scaffolder"],
    "Confined Space & Vessel Entry": ["tank cleaning", "vessel inspection", "sump cleaning", "reactor maintenance", "excavation work"],
    "Mechanical Lifting & Rigging": ["crane lift", "rigging", "hoisting heavy equipment", "pipe loading", "container unloading", "crane", "rigger", "lifted by crane"],
    "Pipe & Valve Maintenance": ["line break", "valve replacement", "flange torqueing", "pipeline pigging", "manifold maintenance"],
    "Electrical Maintenance": ["substation wiring", "switchgear inspection", "cable pulling", "motor replacement", "breaker test"],
    "Drilling & Rig Operations": ["tripping pipe", "casing installation", "top drive maintenance", "shale shaker operation"],
    "General Maintenance & Inspection": ["routine inspection", "housekeeping", "equipment lubrication", "visual audit", "gauge reading"]
}


class OilGasRules:
    """Helper rules parser for Oil & Gas safety taxonomy."""

    def extract_hazard(self, text: str) -> str:
        text_lower = text.lower()
        if any(kw in text_lower for kw in ["confined space", "vessel entry", "storage tank entry", "sump entry", "tank sump"]):
            return "Confined Space"
        if any(kw in text_lower for kw in ["loto", "energy isolation", "lockout", "tagout", "unisolated"]):
            return "Energy Isolation"
        if any(kw in text_lower for kw in ["working at height", "scaffold", "harness", "lanyard", "fall from height"]):
            return "Working at Height"
        if any(kw in text_lower for kw in ["hot work", "welding", "cutting", "grinding", "torch"]):
            return "Hot Work"
        if any(kw in text_lower for kw in ["suspended load", "under load", "under crane", "crane lift", "rigging failure"]):
            return "Suspended Load"
        if any(kw in text_lower for kw in ["high pressure", "pressurized line", "gas leak", "pipe burst", "hydrocarbon leak"]):
            return "High Pressure Gas Release"
        if any(kw in text_lower for kw in ["high voltage", "arc flash", "6.6kv", "33kv", "substation"]):
            return "High Voltage Electricity"

        for hz in HIGH_ENERGY_HAZARDS:
            if any(kw in text_lower for kw in hz["keywords"]):
                return hz["name"]
        for hz in MODERATE_HAZARDS:
            if any(kw in text_lower for kw in hz["keywords"]):
                return hz["name"]
        for hz in LOW_HAZARDS:
            if any(kw in text_lower for kw in hz["keywords"]):
                return hz["name"]
        return "General Field Hazard"

    def extract_activity(self, text: str) -> str:
        text_lower = text.lower()
        for act_name, keywords in ACTIVITY_PATTERNS.items():
            if any(kw in text_lower for kw in keywords):
                return act_name
        return "General Maintenance & Operations"

    def extract_unsafe_category(self, text: str) -> str:
        text_lower = text.lower()
        act_count = sum(1 for kw in UNSAFE_ACT_INDICATORS if kw in text_lower)
        cond_count = sum(1 for kw in UNSAFE_CONDITION_INDICATORS if kw in text_lower)
        if act_count >= cond_count and act_count > 0:
            return "Unsafe Act"
        elif cond_count > 0:
            return "Unsafe Condition"
        return "Unsafe Observation"

    def extract_potential_consequence(self, hazard: str, text: str) -> str:
        text_lower = text.lower()
        for hz in HIGH_ENERGY_HAZARDS:
            if hz["name"] == hazard or any(kw in text_lower for kw in hz["keywords"]):
                return hz["consequence"]
        for hz in MODERATE_HAZARDS:
            if hz["name"] == hazard or any(kw in text_lower for kw in hz["keywords"]):
                return hz["consequence"]
        return "Minor injury or workplace disruption"

    def extract_control_failure(self, text: str) -> str | None:
        """
        Extracts explicit missing or failed safety controls, uncompleted testing, or bypassed safeguards from report text.
        Returns clean summary phrase if explicit control failure is present in text, or None.
        """
        if not text or not text.strip():
            return None

        # Pattern 1: "Required [control] (had not been / was not / not) (completed / performed / verified / conducted / done / carried out) [context]"
        p1 = re.search(
            r"\b((?:required\s+)?([a-z0-9\s\-]+?\s+(?:had\s+not\s+been|was\s+not|were\s+not|is\s+not|not)\s+(?:completed|conducted|performed|carried\s+out|done|verified|obtained|installed|used|attached|implemented)(?:\s+(?:before|prior\s+to|during|for)[^\.\;\,]*)?))",
            text,
            re.IGNORECASE
        )
        if p1:
            raw = p1.group(1).strip()
            cleaned = re.sub(r"\b(?:had\s+not\s+been|was\s+not|were\s+not|is\s+not)\b", "not", raw, flags=re.IGNORECASE)
            cleaned = re.sub(r"\s+", " ", cleaned).strip()
            clean_phrase = cleaned[0].upper() + cleaned[1:]
            if not clean_phrase.endswith('.'):
                clean_phrase += '.'
            return clean_phrase

        # Pattern 2: "(failed to / did not / omitted to) (complete / conduct / perform / verify / obtain) [control] [context]"
        p2 = re.search(
            r"\b((?:failed\s+to|did\s+not|omitted\s+to)\s+(?:complete|conduct|perform|obtain|verify|carry\s+out|install|attach|use)\s+([a-z0-9\s\-]+?)(?:\s+(?:before|prior\s+to|during|for)[^\.\;\,]*)?)",
            text,
            re.IGNORECASE
        )
        if p2:
            raw = p2.group(1).strip()
            cleaned = re.sub(r"\s+", " ", raw).strip()
            clean_phrase = cleaned[0].upper() + cleaned[1:]
            if not clean_phrase.endswith('.'):
                clean_phrase += '.'
            return clean_phrase

        # Pattern 3: "without (completing / performing / obtaining) [control] [context]"
        p3 = re.search(
            r"\b(without\s+(?:completing\s+|performing\s+|verifying\s+|obtaining\s+)?([a-z0-9\s\-]+?\s+(?:testing|test|permit|isolation|loto|harness|tie-off|barrier|fire\s+watch|guard|authorization|gas\s+testing|ventilation)[^\.\;\,]*))",
            text,
            re.IGNORECASE
        )
        if p3:
            control_phrase = p3.group(2).strip()
            clean_phrase = f"{control_phrase[0].upper() + control_phrase[1:]} not completed before operation."
            return clean_phrase

        # Pattern 4: "missing / lacking [control]"
        p4 = re.search(
            r"\b((?:missing|absent|lacking)\s+([a-z0-9\s\-]+?\s+(?:testing|test|permit|isolation|loto|harness|tie-off|barrier|fire\s+watch|guard|authorization|gas\s+testing|ventilation|handrail|guardrail)[^\.\;\,]*))",
            text,
            re.IGNORECASE
        )
        if p4:
            raw = p4.group(1).strip()
            cleaned = re.sub(r"\s+", " ", raw).strip()
            clean_phrase = cleaned[0].upper() + cleaned[1:]
            if not clean_phrase.endswith('.'):
                clean_phrase += '.'
            return clean_phrase

        return None

