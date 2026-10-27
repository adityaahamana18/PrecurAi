# SIF Precursor Annotation Guidelines for Oil & Gas Safety Intelligence

**Project**: PrecurAi — Safety Intelligence Platform (SIH 2026)  
**Target Audience**: HSE Engineers, Safety Subject Matter Experts, NLP Data Annotators  
**Version**: 1.0.0

---

> [!IMPORTANT]
> **CORE ANNOTATION PRINCIPLE**:
> **Serious Injury or Fatality (SIF) potential represents the credible potential for a life-altering injury or fatality based on high-energy hazard exposure, barrier failure, and credible potential consequence — NOT simply the actual historical outcome.**
>
> An incident resulting in zero injuries (a Near Miss) can have **HIGH** SIF potential if a high-energy barrier failed. Conversely, an incident resulting in days lost (e.g., an ankle sprain from tripping) may have **LOW** SIF potential if no high-energy hazard was involved.

---

## 1. What Qualifies as a SIF Precursor?

A **SIF Precursor** is a high-risk safety event, condition, or procedural non-compliance where:
1. A **High-Energy Hazard** is present (e.g., pressure >100 psi, electrical >440V, height >1.8m, suspended load >1000 kg, toxic H2S release, flammable atmosphere).
2. A **Critical Safety Barrier** (e.g., LOTO isolation, gas testing, fall protection, relief valve, PTW authorization) is absent, bypassed, defective, or breached.
3. If an unplanned event occurred or continued, the **credible potential consequence** would be a fatality or life-altering permanent disability.

---

## 2. Difference Between Actual Consequence and Potential Consequence

Annotators **MUST NOT** assign SIF potential based solely on actual historical injury outcomes.

| Dimension | Actual Outcome / Consequence | Credible Potential Consequence |
| :--- | :--- | :--- |
| **Definition** | What actually occurred (e.g., zero injury, minor abrasion, 3 days lost). | What *could credibly have occurred* given the energy release & barrier failure. |
| **SIF Evaluation Focus** | **DO NOT USE** as primary SIF classification trigger. | **PRIMARY FOCUS** for SIF precursor determination. |
| **Example Scenario 1** | A 12-ton pipe load slipped from a crane hook and landed 1 meter from a rigger. **Actual Outcome**: Zero injury. | **Potential Consequence**: Crushing fatality. **SIF Potential**: **HIGH**. |
| **Example Scenario 2** | Worker tripped over a garden hose on a flat pathway. **Actual Outcome**: Fractured wrist, 21 days lost. | **Potential Consequence**: Minor fall on same level. **SIF Potential**: **LOW**. |

---

## 3. How to Handle Near Misses

- **Rule**: Do **NOT** assume Near Miss = HIGH SIF potential.
- Evaluate the energy release and barrier failure:
  - If a Near Miss involved a **high-energy hazard** (e.g., near miss entry into un-tested gas vessel, dropped heavy object from derrick), assign **HIGH**.
  - If a Near Miss involved a **low-energy hazard** (e.g., near miss trip over office cable), assign **LOW**.

---

## 4. How to Handle Unsafe Acts

- **Rule**: Evaluate whether the human behavior bypassed a critical life-saving barrier.
- **High SIF Unsafe Act Examples**: Working inside derrick without fall protection lanyard tied off; opening pressurized hydrocarbon flange prior to LOTO verification; performing welding without combustible gas test.
- **Low SIF Unsafe Act Examples**: Carrying a coffee cup without lid; failing to use handrail on 2-step office staircase.

---

## 5. How to Handle Unsafe Conditions

- **Rule**: Evaluate the physical state of equipment, barriers, and environmental hazards.
- **High SIF Unsafe Condition Examples**: Missing guardrails on 10-meter scaffold platform; defective relief valve PSV on gas separator; uncalibrated H2S gas monitor in gas plant.
- **Low SIF Unsafe Condition Examples**: Stacked cardboard boxes in workshop corner; dirty office window; minor water puddle near washroom.

---

## 6. SIF Potential Decision Matrix & Classes

Annotators must select exactly one of the 4 valid classes:

```
                          ┌───────────────────────────┐
                          │   Is High-Energy Hazard   │
                          │     Present & Exposed?    │
                          └─────────────┬─────────────┘
                                        │
                       ┌────────────────┴────────────────┐
                      YES                                NO
                       │                                 │
           ┌───────────┴───────────┐         ┌───────────┴───────────┐
           │ Critical Barrier     │         │ Moderate Hazard /     │
           │ Failed or Missing?    │         │ Low Energy Hazard?    │
           └─────┬───────────┬─────┘         └─────┬───────────┬─────┘
                YES          NO                   YES          NO
                 │           │                     │           │
                 ▼           ▼                     ▼           ▼
               HIGH        MEDIUM                 LOW         NOT ENOUGH
             PRECURSOR   PRECURSOR             PRECURSOR     INFORMATION
```

### Class 1: `HIGH`
- **Criteria**: Presence of a High-Energy Hazard **AND** failure, bypass, or absence of a critical safety barrier, creating a credible path to fatality or permanent disability.
- **Key Indicators**: LOTO non-compliance on live lines, un-tested confined space entry, hot work near gas leaks, working at height >1.8m without fall arrest, standing under suspended loads, bypassed ESD/PSV valves.

### Class 2: `MEDIUM`
- **Criteria**: Presence of moderate energy hazards OR partial barrier degradation, where serious injury is possible but fatality/permanent disability is improbable due to secondary controls.
- **Key Indicators**: Missing toe boards on scaffold, uncalibrated gas detector where line is depressurized, minor chemical splash risk with partial PPE, unorganized heavy tools at elevation.

### Class 3: `LOW`
- **Criteria**: Low energy hazards (housekeeping, ergonomics, minor slips/trips on level ground, low voltage <50V) with zero potential for serious injury or fatality.
- **Key Indicators**: Cluttered office hallway, missing safety glasses while sweeping floor, minor office thumb pinch, worn gloves during light manual sorting.

### Class 4: `NOT_ENOUGH_INFORMATION`
- **Criteria**: The text narrative is too ambiguous, vague, or short to identify the hazard mechanism, energy level, or barrier status.
- **Key Indicators**: "Incidents occurred in unit 2.", "Worker reported safety issue.", "Check equipment tomorrow."

---

## 7. How to Identify Evidence Phrases

Annotators must quote **exact, verbatim substrings** from `report_text` into the `evidence` array.

- **Guidelines**:
  - Keep phrases concise (2 to 8 words).
  - Quote the specific phrase describing the hazard or barrier failure.
  - Do NOT paraphrase or invent text outside the original report text.
  - Example `report_text`: `"Worker entered the 4m storage vessel without gas testing completed."`
  - Correct `evidence`: `["entered the 4m storage vessel", "without gas testing completed"]`

---

## 8. How to Map IOGP Life-Saving Rules

Annotators must map context against standard IOGP Life-Saving Rules:
1. **Bypassing Safety Controls**: Overriding ESD, PSV, interlocks, or gas detectors.
2. **Confined Space**: Entry into tanks, vessels, sumps, or deep trenches.
3. **Driving**: Vehicle operation, seatbelts, speeding, distracted driving.
4. **Energy Isolation**: LOTO, zero energy verification, blind flanges, depressurization.
5. **Hot Work**: Welding, grinding, cutting, open flame in hazardous zones.
6. **Line of Fire / Sight**: Suspended loads, pinch points, winch lines, crane radii.
7. **Safe Mechanical Lifting**: Crane lift plans, rigging gear, barricades.
8. **Work Authorization**: Permit-to-Work (PTW) and JSA requirements.
9. **Working at Height**: Elevated work >1.8m, fall harnesses, scaffolding, floor openings.

---

## 9. When NOT to Force a Life-Saving Rule Match

- **Rule**: If the safety observation or incident does not fall cleanly under one of the 9 IOGP rules (e.g. general office housekeeping, minor slip on flat ground, ergonomic keyboard setup), annotators **MUST** select:
  `"life_saving_rule": "No direct Life-Saving Rule match"`
- Never force an arbitrary match.

---

## 10. Hypothetical Annotation Examples

> [!NOTE]
> The following records are **HYPOTHETICAL ANNOTATION EXAMPLES** designed strictly to illustrate correct labeling methodology. They do not represent records from any actual dataset.

### Example A: `HIGH` SIF Potential (Near Miss with Zero Injury)
```json
{
  "report_id": "HYPO-EX-001",
  "report_text": "A technician opened the drain valve on high pressure gas separator V-101 before LOTO energy isolation was confirmed. Gas pressure blew off valve cap.",
  "observation_type": "Near Miss",
  "activity": "Line Depressurization / Valve Operation",
  "hazard": "High Pressure Hydrocarbon Gas Release",
  "unsafe_act": "Opening drain valve prior to LOTO confirmation",
  "unsafe_condition": "Pressurized vessel line V-101",
  "potential_consequence": "High-pressure gas explosion / Struck by projectile / Fatality",
  "life_saving_rule": "Energy Isolation",
  "sif_potential": "HIGH",
  "evidence": [
    "high pressure gas separator",
    "before LOTO energy isolation was confirmed",
    "blew off valve cap"
  ],
  "annotator_notes": "[HYPOTHETICAL EXAMPLE ONLY] High-energy hydrocarbon pressure exposure coupled with missing LOTO barrier creates clear SIF precursor."
}
```

### Example B: `LOW` SIF Potential (Low Energy Housekeeping)
```json
{
  "report_id": "HYPO-EX-002",
  "report_text": "Empty cardboard boxes were stacked near the electrical room entrance door during morning shift.",
  "observation_type": "Unsafe Condition",
  "activity": "Housekeeping",
  "hazard": "Tripping Hazard / Entrance Obstruction",
  "unsafe_act": null,
  "unsafe_condition": "Stacked cardboard boxes obstructing door",
  "potential_consequence": "Minor trip / Contusion",
  "life_saving_rule": "No direct Life-Saving Rule match",
  "sif_potential": "LOW",
  "evidence": [
    "Empty cardboard boxes",
    "obstructing door"
  ],
  "annotator_notes": "[HYPOTHETICAL EXAMPLE ONLY] Low energy housekeeping clutter with no credible potential for serious injury or fatality."
}
```
