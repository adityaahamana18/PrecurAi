import React, { useState } from 'react';
import { 
  ShieldAlert, Box, Truck, ZapOff, Flame, EyeOff, Anchor, 
  FileCheck, TrendingUp, CheckCircle, Search, Sparkles, BookOpen, ExternalLink
} from 'lucide-react';

const LSR_ITEMS = [
  {
    name: "Bypassing Safety Controls",
    icon: ShieldAlert,
    category: "Controls & Interlocks",
    color: "from-red-600 via-rose-600 to-coral-500",
    glow: "rgba(239, 68, 68, 0.35)",
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
    color: "from-amber-600 via-apricot-500 to-coral-500",
    glow: "rgba(251, 198, 124, 0.35)",
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
    color: "from-coral-500 via-apricot-400 to-amber-500",
    glow: "rgba(237, 148, 119, 0.35)",
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
    color: "from-orange-600 via-coral-500 to-apricot-400",
    glow: "rgba(249, 115, 22, 0.35)",
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
    color: "from-plum-600 via-velvet-600 to-coral-400",
    glow: "rgba(128, 56, 108, 0.4)",
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
    color: "from-velvet-600 via-plum-600 to-apricot-500",
    glow: "rgba(67, 35, 84, 0.4)",
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
    color: "from-emerald-600 via-teal-600 to-apricot-400",
    glow: "rgba(16, 185, 129, 0.35)",
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
    color: "from-rose-600 via-coral-500 to-apricot-400",
    glow: "rgba(225, 29, 72, 0.35)",
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
    color: "from-teal-600 via-plum-600 to-coral-500",
    glow: "rgba(13, 148, 136, 0.35)",
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
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredRules = LSR_ITEMS.filter(rule => {
    const term = search.toLowerCase();
    const matchesSearch = !search || (
      rule.name.toLowerCase().includes(term) ||
      rule.description.toLowerCase().includes(term) ||
      rule.category.toLowerCase().includes(term) ||
      rule.guidelines.some(g => g.toLowerCase().includes(term))
    );
    const matchesCategory = selectedCategory === "ALL" || rule.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="corp-card p-6 rounded-2xl shadow-card-sunset border border-plum-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-coral-500/15 via-plum-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-plum-700 to-coral-500 flex items-center justify-center shadow-lg shadow-coral-500/20">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                IOGP 9 Life-Saving Rules Taxonomy
              </h2>
            </div>
            <p className="text-xs text-plum-300/80 leading-relaxed max-w-xl">
              International Association of Oil &amp; Gas Producers (IOGP) standard barriers embedded in PrecurAi's neural feature attribution model.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-velvet-950/80 p-2 rounded-xl border border-plum-800/60 text-xs text-apricot-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-coral-400 animate-pulse" />
            <span>9 Universal Safety Safeguards</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 pt-4 border-t border-plum-800/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-coral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter rules by keyword (e.g. 'gas test', 'LOTO', 'harness', 'lifting')..."
              className="dark-input w-full pl-10 pr-4 py-2 text-xs text-white"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-plum-300 hover:text-white px-3 py-2 rounded-lg bg-velvet-900 border border-plum-800 transition"
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
              className="corp-card p-5 rounded-2xl border border-plum-700/40 shadow-card-sunset flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
            >
              {/* Top ambient color strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rule.color}`}
              />

              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${rule.color} text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0`}
                      style={{ boxShadow: `0 4px 18px ${rule.glow}` }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-coral-300 transition-colors">
                        {rule.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-apricot-400/90 font-mono tracking-wider">
                        {rule.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-plum-400 bg-velvet-950/80 px-2 py-0.5 rounded border border-plum-800/60">
                    Rule #{idx + 1}
                  </span>
                </div>

                {/* Description Quote */}
                <p className="text-xs text-plum-100 font-semibold leading-relaxed bg-velvet-950/70 p-3 rounded-xl border border-plum-800/60">
                  "{rule.description}"
                </p>

                {/* Guidelines Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-plum-300 uppercase tracking-wider block">
                    Mandatory Controls:
                  </span>
                  <ul className="space-y-1.5">
                    {rule.guidelines.map((g, i) => (
                      <li key={i} className="text-xs text-plum-200/90 flex items-start gap-2 leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-coral-400 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-plum-800/50 flex items-center justify-between text-[11px] text-plum-400">
                <span className="font-mono text-[10px]">IOGP 459 Standard</span>
                <span className="text-coral-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold text-[10px]">
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
