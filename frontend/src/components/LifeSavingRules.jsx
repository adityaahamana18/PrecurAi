import React, { useState } from 'react';
import { 
  ShieldAlert, Box, Truck, ZapOff, Flame, EyeOff, Anchor, 
  FileCheck, TrendingUp, CheckCircle, Search, Sparkles, BookOpen, ChevronRight
} from 'lucide-react';

const LSR_ITEMS = [
  {
    name: "Bypassing Safety Controls",
    icon: ShieldAlert,
    category: "Controls & Interlocks",
    color: "from-[#FF3B30] to-[#2C3480]",
    glow: "rgba(255, 59, 48, 0.4)",
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
    category: "Enclosed Atmosphere",
    color: "from-[#FF9500] to-[#2C3480]",
    glow: "rgba(255, 149, 0, 0.4)",
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
    category: "Hazardous Energy",
    color: "from-[#2C3480] to-[#4E5BC9]",
    glow: "rgba(78, 91, 201, 0.4)",
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
    category: "Ignition Prevention",
    color: "from-[#FF9500] to-[#FF3B30]",
    glow: "rgba(255, 149, 0, 0.4)",
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
    category: "Proximity & Movement",
    color: "from-[#2C3480] to-[#5B73D1]",
    glow: "rgba(44, 52, 128, 0.5)",
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
    category: "Heavy Rigging",
    color: "from-[#4E5BC9] to-[#2C3480]",
    glow: "rgba(78, 91, 201, 0.4)",
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
    category: "Permit Systems",
    color: "from-[#34C759] to-[#2C3480]",
    glow: "rgba(52, 199, 89, 0.4)",
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
    category: "Fall Protection",
    color: "from-[#FF3B30] to-[#5B73D1]",
    glow: "rgba(255, 59, 48, 0.4)",
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
    category: "Transport Safety",
    color: "from-[#2C3480] to-[#34C759]",
    glow: "rgba(44, 52, 128, 0.5)",
    description: "Follow safe driving rules (speed, seatbelts, distraction, fatigue).",
    guidelines: [
      "Fasten seatbelt at all times in light vehicles, haul trucks, and buses.",
      "Do not exceed posted speed limits or operate mobile phones while driving.",
      "Adhere to Journey Management Plans and mandatory fatigue rest breaks."
    ]
  }
];

export default function LifeSavingRules() {
  const [search, setSearch] = useState("");

  const filteredRules = LSR_ITEMS.filter(rule => {
    const term = search.toLowerCase();
    return !search || (
      rule.name.toLowerCase().includes(term) ||
      rule.description.toLowerCase().includes(term) ||
      rule.category.toLowerCase().includes(term) ||
      rule.guidelines.some(g => g.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="corp-card p-6 rounded-2xl border border-[#2C3480] shadow-cobalt-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#2C3480]/30 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2C3480] border border-[#4E5BC9] flex items-center justify-center shadow-lg shadow-[#2C3480]/50">
                <BookOpen className="w-4 h-4 text-[#FFFFFF]" />
              </div>
              <h2 className="text-lg font-bold text-[#FFFFFF] tracking-tight">
                IOGP 9 Life-Saving Rules Taxonomy
              </h2>
            </div>
            <p className="text-xs text-[#BAC4EB] leading-relaxed max-w-xl">
              International Association of Oil &amp; Gas Producers (IOGP) standard barriers embedded in PrecurAi's neural feature attribution model.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#000000] p-2.5 rounded-xl border border-[#2C3480] text-xs text-[#FFFFFF] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#5B73D1] animate-pulse" />
            <span>9 Universal Safety Safeguards</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 pt-4 border-t border-[#2C3480]/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B73D1]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter rules by keyword (e.g. 'gas test', 'LOTO', 'harness', 'lifting')..."
              className="dark-input w-full pl-10 pr-4 py-2 text-xs text-[#FFFFFF]"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-[#BAC4EB] hover:text-[#FFFFFF] px-3.5 py-2 rounded-xl bg-[#0A0D18] border border-[#2C3480] transition"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid of 9 Life-Saving Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {filteredRules.map((rule, idx) => {
          const IconComp = rule.icon;
          return (
            <div
              key={rule.name}
              className="corp-card p-5 rounded-2xl border border-[#2C3480] shadow-lg flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
            >
              {/* Top ambient color strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rule.color}`}
              />

              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${rule.color} text-[#FFFFFF] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0 border border-[#FFFFFF]/30`}
                      style={{ boxShadow: `0 4px 18px ${rule.glow}` }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#5B73D1] transition-colors">
                        {rule.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-[#BAC4EB] font-mono tracking-wider">
                        {rule.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#BAC4EB] bg-[#000000] px-2 py-0.5 rounded border border-[#2C3480]">
                    Rule #{idx + 1}
                  </span>
                </div>

                {/* Description Quote */}
                <p className="text-xs text-[#FFFFFF] font-semibold leading-relaxed bg-[#000000]/80 p-3 rounded-xl border border-[#2C3480]">
                  "{rule.description}"
                </p>

                {/* Guidelines Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-[#BAC4EB] uppercase tracking-wider block">
                    Mandatory Controls:
                  </span>
                  <ul className="space-y-1.5">
                    {rule.guidelines.map((g, i) => (
                      <li key={i} className="text-xs text-[#FFFFFF] flex items-start gap-2 leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-[#5B73D1] shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#2C3480]/50 flex items-center justify-between text-[11px] text-[#BAC4EB]">
                <span className="font-mono text-[10px]">IOGP 459 Standard</span>
                <span className="text-[#5B73D1] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold text-[10px]">
                  Safety Rule Active ›
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
