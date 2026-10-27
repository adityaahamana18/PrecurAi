"""
Script to generate a comprehensive 150-example synthetic DEMO training dataset
for PrecurAi precursor classification based on Oil & Gas high-energy hazards.
Grounded in data/sif_training/labeling_guidelines.md.
"""

import os
import csv
import json

DATA_DIR = os.path.abspath(os.path.dirname(__file__))
OUTPUT_CSV = os.path.join(DATA_DIR, "sif_training", "demo_sif_training.csv")


def generate_demo_dataset():
    records = []
    idx = 1

    # --- 1. HIGH SIF POTENTIAL EXAMPLES (High-Energy Hazard + Critical Barrier Failure) ---
    high_examples = [
        # Energy Isolation (LOTO)
        ("A technician opened the drain valve on high pressure gas separator V-101 before LOTO energy isolation was confirmed. Residual gas pressure blew off the valve cap.", "Near Miss", "Line Depressurization", "High Pressure Gas Release", "Opened drain valve without confirming LOTO isolation", "Pressurized hydrocarbon gas separator V-101", "High-pressure explosion / Projectile impact / Fatality", "Energy Isolation", ["high pressure gas separator", "before LOTO energy isolation was confirmed", "blew off the valve cap"]),
        ("Instrument mechanic disconnected a transmitter on a 1500 psi natural gas line. Blinding was not completed and line was still under pressure.", "Unsafe Act", "Instrument Maintenance", "High Pressure Gas Release", "Disconnected transmitter on pressurized gas line without blinding", "1500 psi pressurized line", "Hydrocarbon release / Flammable gas blowout / Fatality", "Energy Isolation", ["1500 psi natural gas line", "Blinding was not completed", "still under pressure"]),
        ("Fitter unbolted flange on diesel fuel supply line without performing lock-out tag-out. Fuel sprayed across hot pump casing.", "Near Miss", "Piping Overhaul", "Hot Work / Flammable Fuel Ignition", "Unbolted flange without lockout tagout", "Hot pump casing near fuel spray", "Flash fire / Major burn fatality", "Energy Isolation", ["without performing lock-out tag-out", "Fuel sprayed across hot pump casing"]),
        ("Technician opened high pressure hydrocarbon line valve V-104 before LOTO energy isolation was verified by permit issuer. Residual pressure gauge was showing 140 PSI.", "Near Miss", "Pipe & Valve Maintenance", "High Pressure Hydrocarbon Release", "Opened high pressure valve without LOTO verification", "140 PSI residual pressure on unisolated line", "Hydrocarbon release / Explosion fatality", "Energy Isolation", ["high pressure hydrocarbon line valve", "before LOTO energy isolation was verified", "140 PSI"]),
        ("Pipefitter removed blind flange on live pressurized flare line under 300 psi pressure. Hydrocarbon gas discharged.", "Near Miss", "Flare Line Maintenance", "High Pressure Hydrocarbon Release", "Removed blind on live 300 psi line", "Live 300 psi flare line", "High pressure blowout / Fire fatality", "Energy Isolation", ["removed blind flange on live pressurized flare line", "300 psi pressure"]),
        ("Boiler maintenance crew opened 100 psi steam valve V-302 without lock-out tag-out verification. Live steam discharged into workspace.", "Near Miss", "Boiler Servicing", "High Pressure Steam Release", "Opened steam valve without LOTO verification", "Live 100 psi steam valve", "Severe thermal steam burns / Fatality", "Energy Isolation", ["100 psi steam valve", "without lock-out tag-out verification", "Live steam discharged"]),
        ("Electrician touched 440V motor control center (MCC) busbar without insulating gloves or arc flash suit.", "Unsafe Act", "MCC Overhaul", "High Voltage Electrocution", "Touching 440V busbar without PPE", "Live 440V MCC busbar", "Electrocution / Fatal arc blast", "Energy Isolation", ["440V motor control center", "without insulating gloves"]),
        ("High voltage transformer door was left unlocked with 33kV exposed live terminals near main walkway.", "Unsafe Condition", "Substation Inspection", "High Voltage Electrocution", "Leaving 33kV transformer door unlocked", "Exposed live 33kV electrical terminals", "Electrocution / Fatal arc flash", "Energy Isolation", ["33kV exposed live terminals", "unlocked", "near main walkway"]),
        ("Electrician opened 6.6kV switchgear cubicle door with metal screwdriver while busbar was energized. Flashover arc occurred.", "Near Miss", "Substation Maintenance", "High Voltage Arc Flash", "Opened energized 6.6kV cubicle with metal tool", "Live 6.6kV high voltage busbar", "Arc flash blast / Electrocution / Fatality", "Energy Isolation", ["6.6kV switchgear cubicle", "busbar was energized", "Flashover arc occurred"]),

        # Confined Space
        ("During turnaround maintenance activity, a worker entered a 6-meter deep vessel. Required gas testing had not been completed before entry.", "Near Miss", "Vessel Inspection", "Confined Space / Toxic Gas Entry", "Entered confined vessel without gas testing", "Unmonitored vessel atmosphere", "Toxic exposure / Asphyxiation / Fatality", "Confined Space", ["entered a 6-meter deep vessel", "gas testing had not been completed"]),
        ("During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before planned entry. Supervisor stopped the activity.", "Near Miss", "Vessel Maintenance", "Confined Space Entry", "Preparing to enter confined space without gas test", "Untested atmospheric gas in confined vessel", "Asphyxiation / Toxic atmosphere exposure", "Confined Space", ["enter a confined space", "gas testing had not been completed"]),
        ("Contractor technician stepped inside crude oil storage tank T-302 without standby attendant or lifeline tether. H2S concentration was 45 ppm.", "Unsafe Act", "Tank Cleaning", "Toxic H2S Exposure", "Stepped inside storage tank without attendant or lifeline", "45 ppm H2S toxic gas atmosphere in storage tank", "H2S poisoning / Instant knockdown / Fatality", "Confined Space", ["inside crude oil storage tank", "without standby attendant", "H2S concentration was 45 ppm"]),
        ("Welder entered pipeline trench excavated to 2.5m depth without shoring or gas monitoring. Trench wall showed signs of sloughing.", "Unsafe Condition", "Trench Welding", "Excavation Collapse / Asphyxiation", "Entered 2.5m deep unshored trench", "Unshored trench wall sloughing", "Trench cave-in / Suffocation / Fatality", "Confined Space", ["entered pipeline trench", "2.5m depth without shoring", "wall showed signs of sloughing"]),
        ("Worker entered glycol reboiler vessel without lockout tagout or confined space entry permit. Oxygen level was 15%.", "Near Miss", "Vessel Maintenance", "Confined Space / Oxygen Deficiency", "Entered reboiler without LOTO or PTW", "15% oxygen deficient vessel atmosphere", "Asphyxiation fatality", "Confined Space", ["entered glycol reboiler vessel without lockout tagout", "Oxygen level was 15%"]),
        ("Worker entered nitrogen purged vessel before gas clearance certificate was issued. Nitrogen concentration 98%.", "Near Miss", "Vessel Inspection", "Confined Space / Nitrogen Asphyxiation", "Entered nitrogen purged vessel without clearance", "98% nitrogen atmosphere", "Instant asphyxiation / Fatality", "Confined Space", ["nitrogen purged vessel before gas clearance", "Nitrogen concentration 98%"]),
        ("Contractor entered separator vessel without gas test or BA set. H2S alarm sounded at 60 ppm.", "Near Miss", "Separator Inspection", "Toxic H2S Exposure", "Entered separator without BA set or gas test", "60 ppm H2S toxic gas in separator", "H2S poisoning fatality", "Confined Space", ["entered separator vessel without gas test", "H2S alarm sounded at 60 ppm"]),
        ("Instrument tech entered unventilated valve pit sump without atmospheric gas test. Oxygen level measured 16.2%.", "Near Miss", "Sump Inspection", "Confined Space / Oxygen Deficiency", "Entered unventilated pit without gas test", "16.2% oxygen level in valve pit", "Asphyxiation fatality", "Confined Space", ["unventilated valve pit sump", "without atmospheric gas test", "Oxygen level measured 16.2%"]),

        # Working at Height
        ("Scaffolder was working on 4th level platform at 12 meters height without wearing full body harness or tie-off lanyard. No perimeter guardrail installed.", "Unsafe Act", "Scaffold Erection", "Working at Height / Fall Exposure", "Working at 12m height without harness or lanyard", "Missing perimeter guardrail at 12m height", "Fall from height / Fatal trauma", "Working at Height", ["12 meters height", "without wearing full body harness", "No perimeter guardrail"]),
        ("Scaffolder working at 6m height on platform piping rack without harness tie-off lanyard attached to anchor point.", "Unsafe Act", "Scaffold Erection", "Working at Height", "Working at 6m height without harness tie-off", "Unprotected elevated piping rack", "Fall from 6m height / Fatal trauma", "Working at Height", ["6m height on platform piping rack", "without harness tie-off lanyard"]),
        ("Rigger disconnected harness lanyard to cross derrick beam at 18 meters height. Lost foot grip momentarily but grabbed structural diagonal.", "Near Miss", "Derrick Maintenance", "Working at Height", "Unclipped safety lanyard at 18 meters height", "Unprotected derrick beam crossing", "18-meter fall to derrick floor / Fatality", "Working at Height", ["disconnected harness lanyard", "18 meters height", "Lost foot grip"]),
        ("Floor grating section on 3rd floor monkey board was unbolted and left open without barricades or warning signs. Worker almost stepped through.", "Unsafe Condition", "Rig Floor Operations", "Floor Opening / Fall Exposure", "Left grating unbolted without barricade", "Unprotected floor opening at elevation", "Fall through floor opening / Fatality", "Working at Height", ["grating section", "unbolted and left open", "without barricades"]),
        ("Operator was working on platform 8m above deck without safety harness. Handrail section was missing.", "Unsafe Act", "Platform Cleaning", "Working at Height", "Working at 8m height without harness", "Missing handrail section at 8m height", "Fall to deck / Fatal trauma", "Working at Height", ["platform 8m above deck without safety harness", "Handrail section was missing"]),
        ("Scaffold platform 15 meters high had unfastened planks. Planks slipped when painter stepped on edge.", "Near Miss", "Scaffold Painting", "Working at Height", "Stepping on unfastened scaffold planks at 15m", "Unfastened planks on 15m scaffold", "Fall from 15m height / Fatality", "Working at Height", ["Scaffold platform 15 meters high", "unfastened planks", "Planks slipped"]),

        # Line of Fire / Lifting
        ("During lifting operations, a suspended load was moved over an area where workers were present. The lifting activity was stopped after unsafe condition was observed.", "Unsafe Condition", "Lifting Operations", "Suspended Load / Line of Fire", "Moving suspended load over active workers", "Suspended load over unprotected personnel area", "Crush injury / Dropped load fatality", "Line of Fire", ["suspended load", "moved over an area where workers were present"]),
        ("Rigger stood directly underneath a 14-ton drill pipe load being lifted by offshore crane. Crane wire jerked due to gusting wind.", "Unsafe Act", "Crane Lifting", "Suspended Load / Line of Fire", "Standing directly under 14-ton suspended load", "Gusting wind during heavy crane lift", "Crush injury / Dropped load fatality", "Line of Fire", ["underneath a 14-ton drill pipe load", "lifted by offshore crane", "wire jerked"]),
        ("Rigger standing under 12-ton crane load hoisted to upper module on FPSO Deck B. Tag line was loose and no exclusion barrier was placed.", "Unsafe Act", "Rigging Operations", "Suspended Load / Line of Fire", "Standing under 12-ton suspended load", "No exclusion zone barrier during 12-ton lift", "Crush injury / Dropped load fatality", "Line of Fire", ["under 12-ton crane load", "tag line was loose", "no exclusion zone barrier"]),
        ("Synthetic web sling snapped during 8-ton valve lift because sling was damaged and overloaded. Valve dropped onto rig floor, missing helper by 0.5m.", "Near Miss", "Heavy Equipment Lifting", "Dropped Load / Lifting Gear Failure", "Using damaged and overloaded sling", "Damaged synthetic web lifting sling", "Struck by dropped 8-ton valve / Fatality", "Safe Mechanical Lifting", ["sling snapped during 8-ton valve lift", "damaged and overloaded", "missing helper by 0.5m"]),
        ("Heavy 5-ton motor dropped 6 meters from hoist hook due to unlatched safety latch during engine room overhaul.", "Near Miss", "Engine Overhaul", "Dropped Heavy Load", "Using hoist without safety latch engaged", "Unlatched hoist safety hook", "Struck by 5-ton motor / Fatality", "Safe Mechanical Lifting", ["5-ton motor dropped 6 meters", "unlatched safety latch"]),
        ("Rigger stood inside winch cable bight while pulling 10-ton skid. Cable snapped under tension.", "Near Miss", "Winch Towing", "Line of Fire / Snapback Cable", "Standing inside winch cable bight under tension", "Overloaded winch cable", "Snapback cable strike / Fatal amputation", "Line of Fire", ["stood inside winch cable bight", "10-ton skid", "Cable snapped under tension"]),
        ("Offshore crane operator attempted to lift a 16-ton subsea manifold exceeding crane rated load capacity by 20%. Load wire squealed.", "Unsafe Act", "Subsea Crane Lifting", "Overloaded Crane / Dropped Load", "Lifting load 20% above crane rated capacity", "Overloaded crane winch wire", "Crane boom collapse / Dropped load / Fatality", "Safe Mechanical Lifting", ["16-ton subsea manifold", "exceeding crane rated load capacity", "wire squealed"]),

        # Hot Work / Flammable Vapors
        ("Welder started oxy-acetylene torch cutting on pipe support located 2 meters from hydrocarbon gas vent line without gas test or fire watch.", "Unsafe Act", "Torch Cutting", "Hot Work / Explosive Atmosphere", "Cutting near gas vent without gas test or fire watch", "Active hydrocarbon gas vent nearby", "Vapor cloud explosion / Flash fire fatality", "Hot Work", ["oxy-acetylene torch cutting", "near hydrocarbon gas vent line", "without gas test"]),
        ("Grinding sparks fell directly onto crude oil drip tray containing liquid hydrocarbons. Small fire ignited and was extinguished by supervisor.", "Near Miss", "Grinding", "Hot Work / Flammable Liquid Fire", "Grinding above open crude oil drip tray", "Crude oil drip tray uncovered", "Major crude oil fire / Severe thermal burns / Fatality", "Hot Work", ["Grinding sparks fell directly onto crude oil", "Small fire ignited"]),
        ("Hot work welding started inside chemical tank without continuous gas monitoring. Spark ignited solvent vapors.", "Near Miss", "Tank Welding", "Hot Work / Chemical Explosion", "Welding without gas monitoring", "Solvent vapors inside chemical tank", "Tank explosion / Burn fatality", "Hot Work", ["welding started inside chemical tank", "without continuous gas monitoring", "Spark ignited solvent vapors"]),
        ("Welder initiated hot work cutting on petroleum storage tank roof without gas clearance. Flammable hydrocarbon vapor present.", "Near Miss", "Tank Repair", "Hot Work / Flammable Vapors", "Torch cutting without gas clearance certificate", "Flammable vapor atmosphere on tank roof", "Tank explosion / Thermal burn fatality", "Hot Work", ["cutting on petroleum storage tank roof", "without gas clearance"]),

        # Bypassing Safety Controls / Gas Release
        ("Hydrocarbon gas leak occurred from corroded flange on 8-inch high pressure gas export line. H2S alarm triggered.", "Near Miss", "Gas Processing", "High Pressure Gas Release", "Operating line with severe flange corrosion", "Corroded flange on high pressure gas line", "Gas blowout / H2S exposure / Fatality", "Bypassing Safety Controls", ["corroded flange on 8-inch high pressure gas export line", "H2S alarm triggered"]),
        ("Technician bypassed ESD high-level shutoff switch on crude oil storage tank. Tank overflowed near generator.", "Near Miss", "Tank Filling", "Bypassing Safety Controls", "Bypassed ESD shutoff switch", "Crude oil overflow near ignition source", "Major tank fire / Explosion fatality", "Bypassing Safety Controls", ["bypassed ESD high-level shutoff switch", "Tank overflowed near generator"]),
        ("Excavator dug into buried 10-inch high pressure natural gas pipeline without underground utility scan.", "Near Miss", "Site Excavation", "High Pressure Pipeline Rupture", "Excavating without utility locator scan", "Buried high pressure gas pipeline", "Pipeline rupture / Massive gas fire fatality", "Bypassing Safety Controls", ["dug into buried 10-inch high pressure natural gas pipeline", "without underground utility scan"]),
        ("Crane boom contact occurred with overhead 11kV electrical power lines during pipe unloading operation.", "Near Miss", "Crane Offloading", "High Voltage Electrocution", "Operating crane within 3m of overhead power lines", "Overhead 11kV power line near unloading bay", "Electrocution fatality / Equipment fire", "Bypassing Safety Controls", ["Crane boom contact occurred with overhead 11kV", "electrical power lines"]),
        ("Backhoe excavator operator reversed blindly near pipe storage yard without spotter. A pedestrian surveyor was walking in operator blind spot.", "Near Miss", "Excavation Yard Work", "Heavy Equipment Interaction", "Reversing excavator without spotter", "Excavator blind spot near walkway", "Runover / Crushing fatality", "Line of Fire", ["backhoe excavator operator reversed blindly", "without spotter", "walking in operator blind spot"]),
        ("Dump truck tipped over while raising bed near 22kV overhead electrical line. Bed contacted power line.", "Near Miss", "Civil Hauling", "High Voltage Electrocution", "Raising dump bed under overhead line", "Overhead 22kV line above dumping zone", "Electrocution fatality / Truck fire", "Line of Fire", ["Dump truck tipped over", "near 22kV overhead electrical line", "contacted power line"])
    ]

    for t_text, t_type, t_act, t_haz, t_act_u, t_cond_u, t_cons, t_lsr, t_ev in high_examples:
        records.append({
            "report_id": f"DEMO-SIF-{idx:03d}",
            "report_text": t_text,
            "observation_type": t_type,
            "activity": t_act,
            "hazard": t_haz,
            "unsafe_act": t_act_u,
            "unsafe_condition": t_cond_u,
            "potential_consequence": t_cons,
            "life_saving_rule": t_lsr,
            "sif_potential": "HIGH",
            "evidence": json.dumps(t_ev),
            "annotator_notes": "[DEMO TRAINING EXAMPLE] High energy hazard with critical barrier failure."
        })
        idx += 1

    # --- 2. MEDIUM SIF POTENTIAL EXAMPLES (Moderate Hazard / Partial Barrier Issue) ---
    medium_examples = [
        ("Scaffold on 2nd level platform at 4m height lacked toe boards and double guardrail was loose.", "Unsafe Condition", "Scaffolding", "Working at Height / Dropped Objects", None, "Missing toe boards and loose guardrail at 4m", "Fall or falling object injury / Fracture", "Working at Height", ["4m height lacked toe boards", "double guardrail was loose"]),
        ("Fitter used portable angle grinder without eye protection shield. Small metal spark hit safety glasses side gap.", "Near Miss", "Pipe Grinding", "Eye Injury / Flying Particles", "Grinding without full face shield", "Flying metal grinding sparks", "Eye laceration / Partial vision loss", "Hot Work", ["angle grinder without eye protection shield", "metal spark hit"]),
        ("Chemical transfer hose leaked minor drop of hydraulic fluid near workshop walkway during pump transfer.", "Unsafe Condition", "Fluid Transfer", "Chemical Splash / Slip", None, "Leaking hydraulic fluid hose near walkway", "Slip injury / Minor chemical burn", "No direct Life-Saving Rule match", ["hydraulic fluid near workshop walkway", "Leaking hose"]),
        ("Worker was carrying 25 kg valve up stairs without using handrail. Slipped on step but maintained balance.", "Near Miss", "Material Transport", "Manual Handling / Stairs Fall", "Carrying heavy load on stairs without handrail", "Cluttered stair steps", "Stair fall / Musculoskeletal injury", "No direct Life-Saving Rule match", ["25 kg valve up stairs", "without using handrail", "Slipped"]),
        ("Forklift driver operated at 15 km/h inside warehouse aisle where speed limit is 5 km/h.", "Unsafe Act", "Warehouse Transport", "Vehicle Speeding", "Driving forklift over speed limit in aisle", "High forklift speed in narrow aisle", "Collision with rack / Foot crush injury", "Driving", ["Forklift driver operated at 15 km/h", "speed limit is 5 km/h"]),
        ("Air compressor pressure hose had missing safety whip-check cable at coupling connection.", "Unsafe Condition", "Pneumatic Work", "Pressurized Air Hose Whip", None, "Missing whip-check safety cable on air hose", "Whipping hose impact / Bruising", "Line of Fire", ["Air compressor pressure hose", "missing safety whip-check cable"]),
        ("Lab technician handled toluene solvent sample without wearing chemical apron or nitrile gloves.", "Unsafe Act", "Lab Testing", "Chemical Contact", "Handling solvent without chemical apron/gloves", "Exposed chemical solvent beaker", "Skin dermatitis / Chemical irritation", "No direct Life-Saving Rule match", ["toluene solvent sample without wearing chemical apron"]),
        ("Overhead crane hook safety latch spring was weak and did not snap back completely into closed position.", "Unsafe Condition", "Rigging Maintenance", "Crane Hook Latch", None, "Weak safety latch spring on crane hook", "Sling dislodgement / Minor dropped load", "Safe Mechanical Lifting", ["crane hook safety latch spring was weak"]),
        ("Electrician replaced 220V light bulb while standing on wooden stepladder without turning off local switch.", "Unsafe Act", "Lighting Repair", "Low Voltage Shock", "Replacing 220V bulb on live switch", "Live 220V lighting fixture", "Electric shock / Fall from stepladder", "Energy Isolation", ["replaced 220V light bulb", "without turning off local switch"]),
        ("Pressure gauge on utility water line was cracked and leaking minor stream of non-hazardous wash water.", "Unsafe Condition", "Utility Maintenance", "Low Pressure Water Leak", None, "Cracked water pressure gauge", "Water spray / Wet floor slip", "No direct Life-Saving Rule match", ["Pressure gauge on utility water line", "leaking minor stream"]),
        ("Helper used screwdriver as chisel during gasket removal, causing tool to slip and scratch leather glove.", "Near Miss", "Gasket Removal", "Hand Tool Safety", "Using wrong tool for task", "Worn hand tools", "Hand laceration / Cut", "No direct Life-Saving Rule match", ["used screwdriver as chisel", "tool to slip and scratch"]),
        ("Contractor truck parked in front of fire hydrant near main workshop during lunch break.", "Unsafe Condition", "Site Parking", "Emergency Access Obstruction", None, "Vehicle blocking fire hydrant access", "Delayed fire response / Facility impact", "Driving", ["truck parked in front of fire hydrant"]),
        ("Welding cable insulation was chafed near ground clamp, exposing copper wire on 40V welding circuit.", "Unsafe Condition", "Welding Prep", "Electrical Insulation Damage", None, "Chafed welding cable insulation", "Minor electric shock / Sparking", "Hot Work", ["Welding cable insulation was chafed", "exposing copper wire"]),
        ("Worker operated bench grinder with tool rest gap set at 8mm instead of maximum 3mm.", "Unsafe Condition", "Workshop Maintenance", "Machine Guarding", None, "Bench grinder tool rest gap too wide", "Workpiece jam / Hand pinch injury", "No direct Life-Saving Rule match", ["tool rest gap set at 8mm instead of maximum 3mm"]),
        ("Diesel forklift exhaust pipe emitted heavy black smoke inside covered pipe yard bay.", "Unsafe Condition", "Yard Operations", "Exhaust Fumes / Air Quality", None, "Exhaust smoke in covered bay", "Respiratory discomfort / Headache", "Driving", ["exhaust pipe emitted heavy black smoke inside covered"]),
        ("Lab tech spilled minor 50ml solvent sample on workbench, causing strong chemical odor.", "Unsafe Condition", "Lab Analysis", "Chemical Vapor", None, "Spilled solvent sample on bench", "Minor eye irritation", "No direct Life-Saving Rule match", ["spilled minor 50ml solvent sample"]),
        ("Painter used 2m step ladder on uneven gravel surface without second worker holding ladder base.", "Unsafe Act", "Facility Painting", "Low Height Fall", "Using step ladder on uneven gravel", "Unstable gravel base", "Step ladder tip / Ankle sprain", "Working at Height", ["2m step ladder on uneven gravel"]),
        ("Pipe yard forklift horn was inoperative during afternoon shift.", "Unsafe Condition", "Yard Moving", "Inoperative Horn", None, "Inoperative forklift horn", "Pedestrian warning failure", "Driving", ["forklift horn was inoperative"]),
        ("Contractor truck parked on shoulder of plant access road without hazard warning lights.", "Unsafe Act", "Road Transport", "Improper Parking", "Parking on shoulder without hazard lights", "Unlit parked truck on shoulder", "Low speed vehicle bump", "Driving", ["parked on shoulder", "without hazard warning lights"]),
        ("Technician used damaged adjustable wrench with worn jaw teeth while tightening 1-inch instrument tubing fitting.", "Unsafe Act", "Instrument Repair", "Hand Tool Slippage", "Using worn adjustable wrench", "Worn wrench jaw teeth", "Hand knuckle scrape / Minor cut", "No direct Life-Saving Rule match", ["damaged adjustable wrench with worn jaw teeth"]),
        ("Compressor room floor had minor oil film near lube oil fill plug due to slow dripping drain plug.", "Unsafe Condition", "Compressor Maintenance", "Oil Film Slip", None, "Lube oil film on concrete floor", "Slip on level floor / Bruise", "No direct Life-Saving Rule match", ["minor oil film near lube oil fill plug"]),
        ("Scaffold wooden plank had minor 10cm split near edge but remained structurally sound under load.", "Unsafe Condition", "Scaffold Inspection", "Plank Defect", None, "Split scaffold plank edge", "Trip / Minor splinter", "Working at Height", ["Scaffold wooden plank had minor 10cm split"]),
        ("Mechanic used non-sparking brass hammer that had loose wooden handle wedge.", "Unsafe Condition", "Pump Overhaul", "Tool Maintenance", None, "Loose handle on brass hammer", "Tool head detachment / Foot bruise", "No direct Life-Saving Rule match", ["brass hammer that had loose wooden handle"]),
        ("Contractor van driven at 25 km/h in 15 km/h plant access road zone.", "Unsafe Act", "Site Transit", "Vehicle Speeding", "Exceeding plant speed limit", "Excessive speed on plant road", "Minor vehicle bump", "Driving", ["driven at 25 km/h in 15 km/h plant access road"]),
        ("Maintenance worker used step stool on linoleum office floor without anti-slip rubber pads.", "Unsafe Act", "Facility Maintenance", "Low Elevation Slip", "Using stool without anti-slip pads", "Unstable stool base", "Stool slip / Minor ankle twist", "No direct Life-Saving Rule match", ["step stool on linoleum office floor without anti-slip"]),
        ("Grinding shield safety glass on workshop pedestal grinder was pitted and dusty.", "Unsafe Condition", "Pedestal Grinding", "Machine Guarding Vision", None, "Pitted grinding shield glass", "Reduced visibility / Minor eye dust", "Hot Work", ["Grinding shield safety glass", "pitted and dusty"]),
        ("Rig floor water hose nozzle was left un-stowed on walkway grating.", "Unsafe Condition", "Rig Washdown", "Trip Hazard", None, "Water hose on walkway grating", "Trip on hose / Stumble", "No direct Life-Saving Rule match", ["water hose nozzle was left un-stowed"]),
        ("Electrician left panel door open on low-voltage 24V control circuit cabinet during troubleshooting.", "Unsafe Condition", "Control System Check", "Low Voltage Cabinet", None, "Open 24V cabinet door", "Accidental contact with 24V wiring", "Energy Isolation", ["left panel door open on low-voltage 24V"]),
        ("Forklift operator carried pallet loaded 1.2m high, slightly obstructing lower right vision.", "Unsafe Act", "Cargo Transfer", "Material Handling Vision", "Carrying tall load on forklift", "Partial view obstruction", "Minor pallet tip / Rack bump", "Driving", ["carried pallet loaded 1.2m high", "obstructing lower right vision"]),
        ("Chemical storage room ventilation fan belt was squeaking during operation.", "Unsafe Condition", "Store Maintenance", "Equipment Noise", None, "Squeaking fan belt", "Noise distraction", "No direct Life-Saving Rule match", ["ventilation fan belt was squeaking"])
    ]

    for t_text, t_type, t_act, t_haz, t_act_u, t_cond_u, t_cons, t_lsr, t_ev in medium_examples:
        records.append({
            "report_id": f"DEMO-SIF-{idx:03d}",
            "report_text": t_text,
            "observation_type": t_type,
            "activity": t_act,
            "hazard": t_haz,
            "unsafe_act": t_act_u,
            "unsafe_condition": t_cond_u,
            "potential_consequence": t_cons,
            "life_saving_rule": t_lsr,
            "sif_potential": "MEDIUM",
            "evidence": json.dumps(t_ev),
            "annotator_notes": "[DEMO TRAINING EXAMPLE] Moderate hazard or partial barrier issue without SIF potential."
        })
        idx += 1

    # --- 3. LOW SIF POTENTIAL EXAMPLES (Low Energy Housekeeping / PPE / Office / Minor Issues) ---
    low_examples = [
        ("An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified.", "Unsafe Act", "Routine Operations", "PPE Observation", "Walking without safety helmet in low hazard area", None, "Minor head bump / Non-SIF PPE observation", "No direct Life-Saving Rule match", ["without a safety helmet", "No hazardous energy"]),
        ("Employee observed walking near workshop office bay without wearing safety glasses. Area had no active machining or grinding in progress.", "Unsafe Act", "Office Walkway", "PPE Non-Compliance", "Walking without safety glasses in non-active area", None, "Minor dust exposure", "No direct Life-Saving Rule match", ["without wearing safety glasses", "no active machining"]),
        ("Worker entered store room without wearing high-visibility vest during day shift. No mobile equipment operating in room.", "Unsafe Act", "Store Inspection", "PPE Observation", "Walking in store without high-vis vest", None, "PPE compliance observation", "No direct Life-Saving Rule match", ["without wearing high-visibility vest"]),
        ("Technician wore safety shoes with worn heel tread while walking on dry concrete walkway.", "Unsafe Condition", "Pedestrian Walk", "Worn PPE Tread", None, "Worn shoe heel tread on dry surface", "Minor slip / Shoe replacement item", "No direct Life-Saving Rule match", ["safety shoes with worn heel tread"]),
        ("Field specialist wore cotton work gloves instead of leather gloves while moving clean plastic drums.", "Unsafe Act", "Plastic Drum Moving", "PPE Selection", "Using cotton gloves for drum moving", None, "Minor hand chafe", "No direct Life-Saving Rule match", ["cotton work gloves instead of leather"]),
        ("Empty cardboard boxes were stacked near workshop entrance door causing minor floor clutter.", "Unsafe Condition", "Housekeeping", "Obstruction", None, "Cardboard boxes near doorway", "Tripping hazard / Minor bump", "No direct Life-Saving Rule match", ["Empty cardboard boxes", "stacked near workshop entrance"]),
        ("Office computer monitor cable was trailing across walkway behind desk in administration building.", "Unsafe Condition", "Office Ergonomics", "Trailing Cable", None, "Trailing computer cable in office walkway", "Minor trip / Stumble", "No direct Life-Saving Rule match", ["monitor cable was trailing across walkway"]),
        ("Safety glasses had minor scratches on outer lens surface but were still wearable.", "Unsafe Condition", "PPE Maintenance", "Scratched PPE", None, "Scratched safety glasses lens", "Minor eye strain", "No direct Life-Saving Rule match", ["Safety glasses had minor scratches"]),
        ("Janitor spilled small amount of soapy wash water on restroom tile floor and forgot to place wet floor sign.", "Unsafe Condition", "Janitorial Work", "Slippery Floor", None, "Wet tile floor without sign", "Slip on level surface / Minor contusion", "No direct Life-Saving Rule match", ["soapy wash water on restroom tile floor", "forgot to place wet floor sign"]),
        ("Field specialist left coffee mug without lid on top of filing cabinet in control room.", "Unsafe Act", "Office Work", "Liquid Spill", "Leaving un-covered coffee mug on cabinet", None, "Minor spill / Desk mess", "No direct Life-Saving Rule match", ["left coffee mug without lid on top of filing cabinet"]),
        ("Paper recycling bin in office printer room was full and overflowing onto carpet.", "Unsafe Condition", "Office Housekeeping", "Overflowing Bin", None, "Overflowing paper recycling bin", "Minor clutter", "No direct Life-Saving Rule match", ["Paper recycling bin in office", "overflowing onto carpet"]),
        ("Employee failed to use handrail while walking up 3 steps to cafeteria entrance.", "Unsafe Act", "Walking", "Pedestrian Safety", "Failing to use handrail on 3 steps", None, "Minor trip on 3-step stairs", "No direct Life-Saving Rule match", ["failed to use handrail while walking up 3 steps"]),
        ("Workplace safety poster on hallway notice board was torn and unreadable.", "Unsafe Condition", "Safety Notice Board", "Damaged Poster", None, "Torn safety poster", "Lack of visual reminder", "No direct Life-Saving Rule match", ["safety poster on hallway notice board was torn"]),
        ("Worker left lunch container on bench table in break room after shift change.", "Unsafe Act", "Break Room Housekeeping", "Clutter", "Leaving food container on break bench", None, "Minor mess", "No direct Life-Saving Rule match", ["left lunch container on bench table"]),
        ("Desk chair in control room had slightly squeaky height adjustment lever.", "Unsafe Condition", "Office Furniture", "Furniture Maintenance", None, "Squeaky chair adjustment lever", "Minor annoyance", "No direct Life-Saving Rule match", ["Desk chair in control room had slightly squeaky"]),
        ("Office desk phone wire was twisted around chair leg in safety office.", "Unsafe Condition", "Office Work", "Twisted Cable", None, "Twisted desk phone cable", "Minor annoyance", "No direct Life-Saving Rule match", ["phone wire was twisted"]),
        ("Paper towels ran out in 2nd floor office washroom dispenser.", "Unsafe Condition", "Facility Housekeeping", "Missing Towels", None, "Empty paper towel dispenser", "Minor inconvenience", "No direct Life-Saving Rule match", ["Paper towels ran out"]),
        ("Safety poster on office breakroom wall was peeling at corners.", "Unsafe Condition", "Breakroom Audit", "Peeling Poster", None, "Peeling safety poster", "Visual clutter", "No direct Life-Saving Rule match", ["poster on office breakroom wall was peeling"]),
        ("Empty plastic water bottle left on conference room table.", "Unsafe Act", "Meeting Housekeeping", "Clutter", "Leaving plastic bottle on table", None, "Minor mess", "No direct Life-Saving Rule match", ["Empty plastic water bottle left"]),
        ("Field operator noticed earplug dispenser outside quiet office corridor was empty.", "Unsafe Condition", "PPE Store", "Empty Dispenser", None, "Empty earplug dispenser in quiet area", "Minor inconvenience", "No direct Life-Saving Rule match", ["earplug dispenser outside quiet office corridor"]),
        ("Control room keyboard had sticky letter key from dried tea drop.", "Unsafe Condition", "Office Hardware", "Keyboard Maintenance", None, "Sticky keyboard key", "Minor typing delay", "No direct Life-Saving Rule match", ["Control room keyboard had sticky letter key"]),
        ("Small dried mud footprint noticed on admin office entrance carpet.", "Unsafe Condition", "Office Cleaning", "Carpet Dirt", None, "Mud footprint on carpet", "Minor carpet dirt", "No direct Life-Saving Rule match", ["dried mud footprint noticed on admin office entrance"]),
        ("Conference room whiteboard marker was dried out and needed replacement.", "Unsafe Condition", "Meeting Room", "Stationery Supply", None, "Dried whiteboard marker", "Minor inconvenience", "No direct Life-Saving Rule match", ["whiteboard marker was dried out"]),
        ("Employee left umbrella dripping near office coat rack without placing in holder.", "Unsafe Act", "Office Entry", "Floor Drip", "Leaving wet umbrella near coat rack", None, "Minor water drip", "No direct Life-Saving Rule match", ["umbrella dripping near office coat rack"]),
        ("Safety glasses container on office desk was missing lid.", "Unsafe Condition", "Office Desk", "Desk Organization", None, "Missing container lid", "Minor clutter", "No direct Life-Saving Rule match", ["Safety glasses container on office desk was missing"]),
        ("Light dust noticed on top of office filing cabinet during weekly 5S check.", "Unsafe Condition", "Office 5S", "Cabinet Dust", None, "Dust on filing cabinet top", "Housekeeping note", "No direct Life-Saving Rule match", ["Light dust noticed on top of office filing cabinet"]),
        ("Cardboard shipping tag fell off spare part box on warehouse shelf 1.", "Unsafe Condition", "Warehouse Tagging", "Tag Attachment", None, "Loose shipping tag", "Minor labelling item", "No direct Life-Saving Rule match", ["Cardboard shipping tag fell off spare part box"]),
        ("Worker used ballpoint pen with low ink to fill out daily sign-in log.", "Unsafe Act", "Log Recording", "Stationery", "Using low ink pen", None, "Faint writing", "No direct Life-Saving Rule match", ["ballpoint pen with low ink"]),
        ("Office air conditioner remote control battery door was held with tape.", "Unsafe Condition", "Office AC", "Remote Control", None, "Taped battery door", "Minor annoyance", "No direct Life-Saving Rule match", ["remote control battery door was held with tape"]),
        ("Visitor badge clip was slightly loose on visitor jacket lapel.", "Unsafe Condition", "Security Desk", "Badge Attachment", None, "Loose badge clip", "Badge alignment item", "No direct Life-Saving Rule match", ["Visitor badge clip was slightly loose"])
    ]

    for t_text, t_type, t_act, t_haz, t_act_u, t_cond_u, t_cons, t_lsr, t_ev in low_examples:
        records.append({
            "report_id": f"DEMO-SIF-{idx:03d}",
            "report_text": t_text,
            "observation_type": t_type,
            "activity": t_act,
            "hazard": t_haz,
            "unsafe_act": t_act_u,
            "unsafe_condition": t_cond_u,
            "potential_consequence": t_cons,
            "life_saving_rule": t_lsr,
            "sif_potential": "LOW",
            "evidence": json.dumps(t_ev),
            "annotator_notes": "[DEMO TRAINING EXAMPLE] Low energy housekeeping or office item with zero SIF potential."
        })
        idx += 1

    # --- 4. NOT_ENOUGH_INFORMATION EXAMPLES (Vague / Minimalist / Ambiguous Narratives) ---
    nei_examples = [
        ("Shift turnover completed smoothly. Routine safety observation logged by observer.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Shift turnover completed"]),
        ("Observation logged for shift.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Observation logged"]),
        ("No details provided.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["No details"]),
        ("Check status tomorrow morning.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Check status"]),
        ("Field entry logged by observer 12.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Field entry logged"]),
        ("General notes recorded.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["General notes"]),
        ("Units checked during round.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Units checked"]),
        ("Follow up needed.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Follow up"]),
        ("Routine log entry 405.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Routine log entry"]),
        ("Site walkthrough completed.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Site walkthrough"]),
        ("Record filed in system.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Record filed"]),
        ("Pending feedback from team.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Pending feedback"]),
        ("Daily checklist signed.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Daily checklist"]),
        ("Status unchanged.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Status unchanged"]),
        ("Item logged under section B.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Item logged"]),
        ("Observer note 88.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Observer note"]),
        ("Update pending.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Update pending"]),
        ("Check log tomorrow.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Check log"]),
        ("Field memo recorded.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Field memo"]),
        ("Turnover note filed.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Turnover note"]),
        ("Log sheet 12 updated.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Log sheet"]),
        ("Activity noted.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Activity noted"]),
        ("Check entry.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Check entry"]),
        ("Routine update.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Routine update"]),
        ("Note logged by shift lead.", "Near Miss", "General Safety Observation", "Unspecified Hazard", None, None, "Unknown due to missing context", "No direct Life-Saving Rule match", ["Note logged"])
    ]

    for nei_text, nei_type, nei_act, nei_haz, nei_act_u, nei_cond_u, nei_cons, nei_lsr, nei_ev in nei_examples:
        records.append({
            "report_id": f"DEMO-SIF-{idx:03d}",
            "report_text": nei_text,
            "observation_type": nei_type,
            "activity": nei_act,
            "hazard": nei_haz,
            "unsafe_act": nei_act_u,
            "unsafe_condition": nei_cond_u,
            "potential_consequence": nei_cons,
            "life_saving_rule": nei_lsr,
            "sif_potential": "NOT_ENOUGH_INFORMATION",
            "evidence": json.dumps(nei_ev),
            "annotator_notes": "[DEMO TRAINING EXAMPLE] Vague narrative lacking hazard mechanism or energy context."
        })
        idx += 1

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

    fieldnames = [
        "report_id", "report_text", "observation_type", "activity", "hazard",
        "unsafe_act", "unsafe_condition", "potential_consequence",
        "life_saving_rule", "sif_potential", "evidence", "annotator_notes"
    ]

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Demo training dataset generated successfully at: {OUTPUT_CSV}")
    print(f"Total records created: {len(records)}")

    class_counts = {}
    for r in records:
        sp = r["sif_potential"]
        class_counts[sp] = class_counts.get(sp, 0) + 1

    print("Class Distribution:")
    for k, v in class_counts.items():
        print(f"  - {k}: {v} ({round(v/len(records)*100, 1)}%)")


if __name__ == "__main__":
    generate_demo_dataset()
