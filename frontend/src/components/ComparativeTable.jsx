import React from 'react';
import { Check, X, Shield, Sparkles } from 'lucide-react';

export default function ComparativeTable() {
  const comparisonData = [
    {
      feature: "Collateral Requirement",
      detail: "Assets pledged to secure credit",
      traditional: "Mandatory (Land, Gold, Deeds)",
      isTraditionalBad: true,
      wallets: "Not Supported",
      finNexus: "Zero Collateral (Behavioral Proxy)",
      isFinNexusGood: true,
    },
    {
      feature: "Credit Decision Latency",
      detail: "Time required to evaluate eligibility",
      traditional: "3–7 Business Days",
      isTraditionalBad: true,
      wallets: "Not Applicable",
      finNexus: "Instant (< 1.2 Seconds)",
      isFinNexusGood: true,
    },
    {
      feature: "Disaster Insurance Claim Latency",
      detail: "Manual loss adjuster vs IoT oracle",
      traditional: "45–60 Calendar Days",
      isTraditionalBad: true,
      wallets: "Not Applicable",
      finNexus: "Sub-5 Seconds (Polygon L2)",
      isFinNexusGood: true,
    },
    {
      feature: "Target User Demographic",
      detail: "Primary underserved cohort",
      traditional: "Salaried / Formally Documented",
      isTraditionalBad: false,
      wallets: "Urban Gen-Z Smartphone Users",
      finNexus: "1.7B Rural & Informal Micro-Vendors",
      isFinNexusGood: true,
    },
    {
      feature: "Data Privacy Architecture",
      detail: "Protection of personal telephony & chats",
      traditional: "Centralized Bank Database",
      isTraditionalBad: true,
      wallets: "Centralized KYC Data Warehouse",
      finNexus: "Zero-Knowledge Mobile Edge Proofs",
      isFinNexusGood: true,
    },
  ];

  return (
    <section id="compare" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Pillar 04 · Market Differentiation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Architectural Comparative Edge
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Side-by-side benchmark comparing Fin-Nexus AI against legacy commercial lenders and centralized urban neo-wallets.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Slide 06 Verification Benchmark
        </div>
      </div>

      {/* Refactoring UI: Clean Data Table */}
      <div className="panel overflow-hidden border border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#090d18] text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
              <tr>
                <th className="py-4 px-6 font-semibold">Evaluation Dimension</th>
                <th className="py-4 px-6 font-semibold">Traditional Banks</th>
                <th className="py-4 px-6 font-semibold">Digital Wallets</th>
                <th className="py-4 px-6 font-bold text-amber-300 bg-amber-500/[0.04] border-l border-r border-amber-500/20">
                  Fin-Nexus AI (Ours) ✦
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  {/* Feature Title & Description */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white text-sm">{row.feature}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{row.detail}</div>
                  </td>

                  {/* Traditional Banks */}
                  <td className="py-4 px-6 text-xs font-mono text-slate-400">
                    {row.isTraditionalBad ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <X className="w-3 h-3 shrink-0" />
                        {row.traditional}
                      </span>
                    ) : (
                      <span>{row.traditional}</span>
                    )}
                  </td>

                  {/* Digital Wallets */}
                  <td className="py-4 px-6 text-xs font-mono text-slate-400">
                    <span>{row.wallets}</span>
                  </td>

                  {/* Fin-Nexus AI (Elevated Column) */}
                  <td className="py-4 px-6 text-xs font-mono bg-amber-500/[0.03] border-l border-r border-amber-500/20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{row.finNexus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
