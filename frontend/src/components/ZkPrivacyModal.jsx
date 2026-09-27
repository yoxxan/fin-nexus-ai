import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Smartphone, Server, Check, Copy } from 'lucide-react';

export default function ZkPrivacyModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const proofSample = '{"pi_a":["0x2f91a...","0x10b4c..."],"pi_b":[["0x09e8...","0x77c2..."],["0x1a4f...","0x88d1..."]],"pi_c":["0x33b1...","0x99e0..."]}';

  const copyProof = () => {
    navigator.clipboard?.writeText(proofSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="panel max-w-2xl w-full p-6 space-y-6 border border-white/[0.14] bg-[#0c111e] text-slate-200 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Zero-Knowledge Edge Processing Architecture
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Privacy Pillar (Slide 05) · Client-Side ZK-SNARK Circuit
            </p>
          </div>
        </div>

        {/* 3 Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Step 1: On-Device Processing */}
          <div className="subpanel p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>1. Client Device</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Raw SMS transaction records and call intervals are parsed <strong className="text-white">locally inside the device sandbox</strong>.
            </p>
            <div className="px-2 py-1 rounded bg-slate-900 border border-white/[0.04] text-[10px] font-mono text-emerald-400">
              Raw data never transmitted
            </div>
          </div>

          {/* Step 2: ZK-SNARK Prover */}
          <div className="subpanel p-4 space-y-2 border-purple-500/20 bg-purple-950/10">
            <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>2. ZK Circuit Prover</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Circom/Groth16 compiles behavioral features into a cryptographic proof:
            </p>
            <div className="p-2 rounded bg-slate-950 border border-purple-500/30 font-mono text-[10px] text-purple-300 break-all">
              π = (A, B, C) valid
            </div>
          </div>

          {/* Step 3: Public Verifier */}
          <div className="subpanel p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
              <Server className="w-4 h-4" />
              <span>3. Smart Verifier</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Polygon L2 contract verifies proof in <strong className="text-white">14ms</strong> without reading a single private balance.
            </p>
            <div className="px-2 py-1 rounded bg-slate-900 border border-white/[0.04] text-[10px] font-mono text-emerald-400">
              Verified: TRUE (0x01)
            </div>
          </div>
        </div>

        {/* Cryptographic Proof Snippet Box */}
        <div className="subpanel p-3.5 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.04] pb-1.5">
            <span>GENERATED GROTH16 PROOF PAYLOAD</span>
            <button
              onClick={copyProof}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-300 break-all bg-slate-950 p-2.5 rounded border border-white/[0.04]">
            {proofSample}
          </div>
        </div>

        {/* Slide Deck Context Box */}
        <div className="subpanel p-3.5 text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-amber-400 font-mono text-[11px] uppercase block">
            Why this matters to judges:
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Predatory fintech loan apps scrape contact books and photos to blackmail vulnerable borrowers. Fin-Nexus uses zero-knowledge cryptography to preserve complete privacy while unlocking institutional credit.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
