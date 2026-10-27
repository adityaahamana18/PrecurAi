import React from 'react';
import { ShieldAlert, Box, Truck, ZapOff, Flame, EyeOff, Anchor, FileCheck, TrendingUp, CheckCircle } from 'lucide-react';

const LSR_ITEMS = [
  {
    name: "Bypassing Safety Controls",
    icon: ShieldAlert,
    color: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900",
    description: "Obtain authorization before bypassing or disabling safety controls.",
    guidelines: [
      "Understand safety controls and safety critical equipment related to your work.",
      "Obtain authorization before overriding, bridging, or disabling any interlock or relief valve.",
      "Test all emergency shutdown (ESD) and gas detection systems after maintenance."
    ]
  },
  {
    name: "Confined Space Entry",
    icon: Box,
    color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900",
    description: "Obtain authorization before entering a confined space.",
    guidelines: [
      "Confirm atmospheric gas testing for H2S, flammable gas (LEL), and oxygen levels.",
      "Verify isolation of connected energy sources (LOTO).",
      "Ensure a trained standby attendant is stationed at entry at all times."
    ]
  },
  {
    name: "Energy Isolation (LOTO)",
    icon: ZapOff,
    color: "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-900",
    description: "Verify isolation and zero energy state before work begins.",
    guidelines: [
      "Confirm mechanical, electrical, and pressure isolations are locked and tagged out.",
      "Test for zero energy (bleed lines, electrical test meters) before touching equipment.",
      "Never remove another person's personal lock."
    ]
  },
  {
    name: "Hot Work Controls",
    icon: Flame,
    color: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-900",
    description: "Control flammables and ignition sources during hot work.",
    guidelines: [
      "Obtain a valid Hot Work Permit before welding, cutting, or grinding near hydrocarbon assets.",
      "Conduct continuous combustible gas monitoring.",
      "Post a dedicated fire watch with calibrated fire extinguisher during and 30 minutes after hot work."
    ]
  },
  {
    name: "Line of Sight",
    icon: EyeOff,
    color: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900",
    description: "Position yourself outside the line of sight of moving equipment and suspended loads.",
    guidelines: [
      "Never walk or stand directly under a suspended load or crane boom.",
      "Maintain eye contact with heavy machinery operators (excavators, forklifts).",
      "Stay clear of high-tension cables, winch wires, and pinch points."
    ]
  },
  {
    name: "Safe Mechanical Lifting",
    icon: Anchor,
    color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900",
    description: "Plan lifting operations and control the area.",
    guidelines: [
      "Confirm crane capacity, ground stability, and lift plan before hoisting.",
      "Inspect slings, shackles, and rigging gear prior to every use.",
      "Erect barricades to restrict unauthorized entry into crane swing radius."
    ]
  },
  {
    name: "Work Authorization (PTW)",
    icon: FileCheck,
    color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900",
    description: "Work with a valid Permit to Work (PTW) when required.",
    guidelines: [
      "Confirm permit scope, Job Safety Analysis (JSA), and site safety control measures.",
      "Re-evaluate risk controls whenever work scope or weather conditions change.",
      "Formally hand over permit status at shift changes."
    ]
  },
  {
    name: "Working at Height",
    icon: TrendingUp,
    color: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900",
    description: "Protect yourself against falls from height.",
    guidelines: [
      "Inspect full-body harness and double lanyards before climbing above 1.8 meters.",
      "Always maintain 100% tie-off to certified overhead anchor points.",
      "Verify scaffolding green tag and guardrails before accessing platforms."
    ]
  },
  {
    name: "Safe Driving",
    icon: Truck,
    color: "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-900",
    description: "Follow safe driving rules (speed, seatbelts, distraction, fatigue).",
    guidelines: [
      "Fasten seatbelt at all times in light vehicles, haul trucks, and buses.",
      "Do not exceed posted speed limits or operate mobile phones while driving.",
      "Adhere to Journey Management Plans and mandatory fatigue rest breaks."
    ]
  }
];

export default function LifeSavingRules() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          IOGP Standard Life-Saving Rules Taxonomy
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          International Association of Oil & Gas Producers (IOGP) standard rules used by PrecurAi to map precursor risks and safeguards.
        </p>
      </div>

      {/* Grid of 9 Life-Saving Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LSR_ITEMS.map((rule, idx) => {
          const IconComp = rule.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${rule.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rule.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Rule #{idx + 1}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{rule.description}"
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Safeguards:</span>
                  <ul className="space-y-1">
                    {rule.guidelines.map((g, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-tight">
                        <CheckCircle className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
