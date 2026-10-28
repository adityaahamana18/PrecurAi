import React, { useState } from 'react';
import { 
  ShieldAlert, Box, Truck, ZapOff, Flame, EyeOff, Anchor, 
  FileCheck, TrendingUp, CheckCircle, Search, Sparkles, BookOpen, ChevronRight,
  Shield, Layers
} from 'lucide-react';

const LSR_ITEMS = [
  {
    name: "Bypassing Safety Controls",
    icon: ShieldAlert,
    category: "Controls & Interlocks",
    color: "from-[#FF4757] to-[#8B5CF6]",
    glow: "rgba(255, 71, 87, 0.4)",
    ruleNumber: 1,
    linkedIncidents: 12,
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
    color: "from-[#FFB020] to-[#FF4757]",
    glow: "rgba(255, 176, 32, 0.4)",
    ruleNumber: 2,
    linkedIncidents: 21,
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
    color: "from-[#00E5FF] to-[#8B5CF6]",
    glow: "rgba(0, 229, 255, 0.4)",
    ruleNumber: 3,
    linkedIncidents: 26,
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
    color: "from-[#FF4757] to-[#FFB020]",
    glow: "rgba(255, 71, 87, 0.4)",
    ruleNumber: 4,
    linkedIncidents: 18,
    description: "Control flammables and ignition sources during hot work.",
    guidelines: [
      "Obtain a valid Hot Work Permit before welding, cutting, or grinding near hydrocarbon assets.",
      "Conduct continuous combustible gas monitoring.",
      "Post a dedicated fire watch with calibrated fire extinguisher during and 30 minutes after hot work."
    ]
  },
  {
    name: "Line of Fire",
    icon: EyeOff,
    category: "Proximity & Movement",
    color: "from-[#8B5CF6] to-[#00E5FF]",
    glow: "rgba(139, 92, 246, 0.4)",
    ruleNumber: 5,
    linkedIncidents: 19,
    description: "Position yourself outside the line of fire of moving equipment and suspended loads.",
    guidelines: [
      "Never walk or stand directly under a suspended load or crane boom envelope.",
      "Maintain active eye contact with heavy machinery and excavator operators.",
      "Stay clear of high-tension cables, winch wires, and pressurized relief headers."
    ]
  },
  {
    name: "Safe Mechanical Lifting",
    icon: Anchor,
    category: "Heavy Rigging",
    color: "from-[#00E5FF] to-[#8B5CF6]",
    glow: "rgba(0, 229, 255, 0.4)",
    ruleNumber: 6,
    linkedIncidents: 24,
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
    color: "from-[#2EE59D] to-[#00E5FF]",
    glow: "rgba(46, 229, 157, 0.4)",
    ruleNumber: 7,
    linkedIncidents: 31,
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
    color: "from-[#FF4757] to-[#00E5FF]",
    glow: "rgba(255, 71, 87, 0.5)",
    ruleNumber: 8,
    linkedIncidents: 32,
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
    color: "from-[#2EE59D] to-[#8B5CF6]",
    glow: "rgba(46, 229, 157, 0.4)",
    ruleNumber: 9,
    linkedIncidents: 9,
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

  const categories = ["ALL", "Fall Protection", "Hazardous Energy", "Ignition Prevention", "Heavy Rigging", "Permit Systems"];

  const filteredRules = LSR_ITEMS.filter(rule => {
    if (selectedCategory !== "ALL" && rule.category !== selectedCategory) return false;
    const term = search.toLowerCase();
    return !search || (
      rule.name.toLowerCase().includes(term) ||
      rule.description.toLowerCase().includes(term) ||
      rule.category.toLowerCase().includes(term) ||
      rule.guidelines.some(g => g.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-[#F4F7FB]">
      
      {/* ── Header Banner ── */}
      <div className="cinematic-card p-6 rounded-2xl border border-white/[0.08] bg-[#0F1626]/70 backdrop-blur-xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00E5FF]/10 via-[#8B5CF6]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-[#070B14] shadow-md font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-[#F4F7FB] tracking-tight">
                IOGP 9 Life-Saving Rules Taxonomy Explorer
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xl">
              International Association of Oil &amp; Gas Producers (IOGP) standard safeguards deterministically mapped by PrecurAi's neural feature attribution model.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#080C14] p-2.5 rounded-xl border border-white/[0.08] text-xs text-[#00E5FF] font-mono shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            <span>9 Universal Safeguards</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00E5FF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords (e.g. 'gas test', 'LOTO', 'harness', 'lifting', 'crane')..."
              className="dark-input w-full pl-10 pr-4 py-2 text-xs text-[#F4F7FB] bg-[#080C14] border border-white/[0.08] rounded-xl focus:border-cyan-400/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  selectedCategory === cat
                    ? "bg-[#00E5FF] text-[#070B14] shadow-md"
                    : "bg-[#080C14] text-[#94A3B8] border border-white/[0.08] hover:text-[#F4F7FB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid of 9 Life-Saving Rules ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {filteredRules.map((rule) => {
          const IconComp = rule.icon;
          return (
            <div
              key={rule.name}
              className="cinematic-card p-5 rounded-2xl border border-white/[0.08] bg-[#0F1626]/70 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:scale-[1.01] hover:border-cyan-400/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Gradient Top Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rule.color}`}
              />

              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${rule.color} text-[#FFFFFF] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 shrink-0 border border-white/20`}
                      style={{ boxShadow: `0 4px 18px ${rule.glow}` }}
                    >
                      <IconComp className="w-5 h-5 text-[#FFFFFF]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F4F7FB] group-hover:text-[#00E5FF] transition-colors">
                        {rule.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] font-mono tracking-wider">
                        {rule.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#00E5FF] bg-[#080C14] px-2 py-0.5 rounded border border-white/[0.08]">
                    Rule #{rule.ruleNumber}
                  </span>
                </div>

                {/* Description Quote */}
                <p className="text-xs text-[#F4F7FB] font-semibold leading-relaxed bg-[#080C14] p-3 rounded-xl border border-white/[0.06]">
                  "{rule.description}"
                </p>

                {/* Guidelines Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block font-mono">
                    Mandatory Safeguards:
                  </span>
                  <ul className="space-y-1.5">
                    {rule.guidelines.map((g, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-2 leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="font-mono text-[10px] text-[#00E5FF]">
                  {rule.linkedIncidents} Associated Observations
                </span>
                <span className="text-[#8B5CF6] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold text-[10px]">
                  IOGP Standard ›
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
