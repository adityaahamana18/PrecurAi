"""
Script to generate a realistic sample PNGRB Official Incident Investigation PDF Report
for testing end-to-end PDF ingestion, page text extraction, and source traceability.
"""

import os
import fitz  # PyMuPDF


def create_sample_pngrb_pdf():
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "pn_grb_reports"))
    os.makedirs(output_dir, exist_ok=True)
    pdf_path = os.path.join(output_dir, "PNGRB_Incident_2025_GAIL_GasLeak.pdf")

    doc = fitz.open()

    # --- PAGE 1: Executive Summary & Overview ---
    page1 = doc.new_page()
    p1_text = (
        "PETROLEUM AND NATURAL GAS REGULATORY BOARD (PNGRB)\n"
        "INCIDENT INVESTIGATION REPORT\n\n"
        "Document Ref: PNGRB/INV/2025/0412\n"
        "Date of Incident: 14/03/2025\n"
        "Location: Hazira-VTP Pipeline Section, District Surat, Gujarat\n"
        "Operator / Entity Name: GAIL (India) Limited\n"
        "Pipeline Type: Cross-Country Natural Gas Trunkline (30-inch High Pressure)\n\n"
        "1. Executive Summary\n"
        "On 14th March 2025 at approximately 10:15 AM, a high-pressure natural gas release occurred "
        "during hot work maintenance near Valve Station 04 along the Hazira-VTP natural gas trunkline. "
        "The maintenance crew was preparing to weld a sleeve replacement on the pipe. "
        "Hot work was initiated prior to confirming positive LOTO energy isolation and without conducting "
        "mandatory combustible gas testing.\n\n"
        "2. Casualties and Human Impact\n"
        "Fatalities: 0\n"
        "Injuries: 2 technician injuries (burns and minor blast injury, hospitalized, non-fatal).\n"
        "Casualties Detail: Maintenance technicians received thermal burns from localized ignition.\n"
    )
    page1.insert_text((50, 50), p1_text, fontsize=11)

    # --- PAGE 2: Technical Findings, Root Causes & Control Failures ---
    page2 = doc.new_page()
    p2_text = (
        "PETROLEUM AND NATURAL GAS REGULATORY BOARD (PNGRB)\n"
        "Document Ref: PNGRB/INV/2025/0412 - Page 2\n\n"
        "3. Findings / Key Observations\n"
        "- Hot work (welding and grinding) commenced within 3 meters of pressurized natural gas flange.\n"
        "- Combustible gas detector was uncalibrated and continuous atmospheric monitoring was not performed.\n"
        "- Energy isolation tagout (LOTO) valve V-102 was partially passing gas due to worn seal.\n"
        "- Emergency Shutdown (ESD) valve at upstream terminal took 14 minutes to activate manually.\n\n"
        "4. Root Cause Analysis\n"
        "- Primary Cause: Inadequate Permit-to-Work (PTW) verification and failure to enforce Energy Isolation.\n"
        "- Underlying Cause: Deficient pre-job safety risk assessment (JSA) for hot work near active pipeline.\n"
        "- Management Lapses: Ineffective contractor safety supervision during turnarounds.\n\n"
        "5. Failed Controls / Safeguards\n"
        "- Control Failure 1: Mandatory gas testing not completed prior to hot work permit sign-off.\n"
        "- Control Failure 2: Positive physical blind isolation (LOTO) omitted in favor of single valve closure.\n"
        "- Control Failure 3: Fire watch personnel lacked active flame suppression equipment at workspace.\n"
    )
    page2.insert_text((50, 50), p2_text, fontsize=11)

    # --- PAGE 3: Recommendations & Financial Damages ---
    page3 = doc.new_page()
    p3_text = (
        "PETROLEUM AND NATURAL GAS REGULATORY BOARD (PNGRB)\n"
        "Document Ref: PNGRB/INV/2025/0412 - Page 3\n\n"
        "6. Financial and Property Damage\n"
        "Property Damage Cost: INR 45 Lakhs (equipment replacement and line repair)\n"
        "Gas Loss Quantity: 18,500 SCM natural gas vented during emergency containment.\n"
        "Environmental Impact: Minimal ground impact; localized gas dispersion.\n\n"
        "7. Recommendations / Corrective Actions\n"
        "- Recommendation 1: Re-certify all PTW issuers and enforce double-block-and-bleed LOTO isolation for hot work.\n"
        "- Recommendation 2: Mandate calibrated multi-gas detectors with continuous audio-visual alarms at all hot work sites.\n"
        "- Recommendation 3: Conduct audit of ESD automated actuator closure times across Surat pipeline network.\n"
        "- Recommendation 4: Implement contractor safety qualification reviews prior to high-risk maintenance permits.\n\n"
        "Report Signed By:\n"
        "Senior Incident Inspector, PNGRB Safety Committee\n"
        "Date: 28/03/2025\n"
    )
    page3.insert_text((50, 50), p3_text, fontsize=11)

    doc.save(pdf_path)
    doc.close()
    print(f"Sample PNGRB PDF generated successfully at: {pdf_path}")


if __name__ == "__main__":
    create_sample_pngrb_pdf()
