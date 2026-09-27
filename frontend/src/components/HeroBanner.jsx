import React from 'react';
import { Users, Clock, TrendingUp, ShieldCheck, ArrowRight, Play, Terminal, Mic, Cpu, Zap } from 'lucide-react';

export default function HeroBanner({ onQuickDemo, onOpenZkModal }) {
  return (
    <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0b1020] to-[#080c16]">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-[11px] font-mono text-slate-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Financial Inclusion & DeFi Infrastructure</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400">IEEE Tech Horizon 2.0</span>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Decentralized Behavioral Credit & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
              Parametric Micro-Insurance
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Unlocking micro-liquidity for 1.7 billion unbanked adults through voice-driven dialect onboarding, machine learning behavioral risk modeling, and sub-5-second smart contract disaster payouts.
          </p>

          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-slate-900/90 border border-white/[0.06] text-xs font-mono text-slate-300 shadow-inner">
              <span className="text-amber-400 font-bold">Thesis:</span>
              <span className="text-slate-300">“Current financial systems are built on history — We build on BEHAVIOR.”</span>
            </div>
          </div>
        </div>

        {/* Hackathon Judge Action Bar (Refactoring UI: Elevated control panel) */}
        <div className="max-w-3xl mx-auto panel p-4 space-y-3 text-left">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-wider font-semibold text-slate-300">Judge Walkthrough Console</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Click to trigger live pipeline steps</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => onQuickDemo('voice')}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-white/[0.06] hover:border-amber-500/40 text-left transition-all group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Voice Onboarding</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Dialect speech to JSON</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => onQuickDemo('credit')}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-white/[0.06] hover:border-amber-500/40 text-left transition-all group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Credit Risk Engine</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">XGBoost alternative proxy</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => onQuickDemo('insurance')}
              className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group shadow-sm"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. 5-Sec L2 Payout</span>
                </div>
                <div className="text-[10px] text-amber-400/70 font-mono">Chainlink IoT trigger</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 4 Core Quantitative Metrics (Refactoring UI: Clear tabular metrics) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-6xl mx-auto pt-2">
          <div className="panel panel-hover p-4 text-left">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Target Scale</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">1.7B</div>
            <div className="text-xs text-slate-400 mt-1 leading-snug">Credit-invisible adults lacking standard bank paperwork</div>
          </div>

          <div className="panel panel-hover p-4 text-left">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Latency Reduction</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tracking-tight">
              45d <span className="text-slate-500 text-lg font-normal font-sans">→</span> 2.4s
            </div>
            <div className="text-xs text-slate-400 mt-1 leading-snug">From manual bureaucracy to automated smart contract execution</div>
          </div>

          <div className="panel panel-hover p-4 text-left">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Market Potential</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">$3.7T</div>
            <div className="text-xs text-slate-400 mt-1 leading-snug">Global GDP growth unlocked by micro-liquidity inclusion</div>
          </div>

          <div 
            onClick={onOpenZkModal}
            className="panel panel-hover p-4 text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Privacy Model</span>
              <ShieldCheck className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-300 tracking-tight flex items-center justify-between">
              <span>ZK-Edge</span>
              <span className="text-xs font-sans text-purple-400 underline font-normal">View Circuit</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 leading-snug">Sensitive phone logs never leave the applicant's device</div>
          </div>
        </div>
      </div>
    </section>
  );
}
