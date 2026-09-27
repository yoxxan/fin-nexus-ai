import React from 'react';
import { Mic, Cpu, Radio, Shield, Activity, ChevronRight } from 'lucide-react';

export default function Navbar({ onSelectSection, activeSection }) {
  const navItems = [
    { id: 'voice', num: '01', label: 'Voice Interface', icon: Mic },
    { id: 'credit', num: '02', label: 'Credit Scoring', icon: Cpu },
    { id: 'insurance', num: '03', label: 'Parametric Insurance', icon: Radio },
    { id: 'compare', num: '04', label: 'Market Edge', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080c16]/95 backdrop-blur-md border-b border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Context */}
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400 text-sm shadow-sm">
            FN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-sans">
                FIN-NEXUS
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded">
                AI
              </span>
              <span className="hidden sm:inline-block text-slate-600 text-xs">•</span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Tech Horizon 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono tracking-tight hidden md:block">
              Fintech Track · Team CodeCommit
            </p>
          </div>
        </div>

        {/* Center: Clean Segmented Tab Control (Refactoring UI pattern) */}
        <nav className="flex items-center bg-[#0d1322] p-1 rounded-lg border border-white/[0.06] text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-white/[0.08]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                  {item.num}
                </span>
                <span className="hidden sm:inline">{item.label}</span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry & Network Health */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-white/[0.06] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Polygon L2</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-white/[0.06] text-[11px] font-mono">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-400">Chainlink IoT</span>
          </div>

          <button
            onClick={() => onSelectSection('voice')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <span>Live Demo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
