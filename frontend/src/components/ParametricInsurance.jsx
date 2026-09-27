import React, { useState, useEffect } from 'react';
import { Radio, Zap, Flame, CloudRain, CheckCircle, Clock, Copy, ExternalLink, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { fetchPolicies, triggerOracle } from '../services/api';

export default function ParametricInsurance() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [simulatedRainfall, setSimulatedRainfall] = useState(8.5);
  const [isExecuting, setIsExecuting] = useState(false);
  const [payoutResult, setPayoutResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchPolicies();
      if (res?.policies?.length) {
        setPolicies(res.policies);
        setSelectedPolicyId(res.policies[0].policy_id);
      }
    }
    load();
  }, []);

  const activePolicy = policies.find(p => p.policy_id === selectedPolicyId) || policies[0];

  const handleSimulateTrigger = async (presetMetric, customEvent) => {
    if (!activePolicy) return;
    const metric = presetMetric !== undefined ? presetMetric : simulatedRainfall;
    setIsExecuting(true);
    setPayoutResult(null);

    try {
      const res = await triggerOracle(activePolicy.policy_id, metric, customEvent);
      setPayoutResult(res);
      const updated = await fetchPolicies();
      if (updated?.policies) setPolicies(updated.policies);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="insurance" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header with Refactoring UI Hierarchy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>Pillar 03 · Autonomous Smart Liquidity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Parametric Climate Micro-Insurance
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Eliminates the 45–60 day manual claim latency. When Chainlink IoT weather sensors detect climate anomalies, smart contracts release micro-liquidity in under 5 seconds.
          </p>
        </div>

        {/* Claim Latency Metric Callout */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">Claim Latency:</span>
          <span className="text-emerald-400 font-bold">45 Days → 2.4s</span>
        </div>
      </div>

      {/* Main Two-Column Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Underwritten Policy Ledger */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">
            Active Parametric Micro-Policies:
          </span>

          <div className="space-y-2.5">
            {policies.map((p) => {
              const isSelected = p.policy_id === selectedPolicyId;
              const isPaid = p.status === 'PAID';
              return (
                <div
                  key={p.policy_id}
                  onClick={() => { setSelectedPolicyId(p.policy_id); setPayoutResult(null); }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/60 shadow-md shadow-amber-500/5'
                      : 'bg-[#0d1322] border-white/[0.06] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-amber-400 font-bold">{p.policy_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      isPaid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">{p.beneficiary_name}</div>
                  <div className="text-xs text-slate-400">{p.crop_or_asset} · {p.region}</div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">{p.trigger_condition}</span>
                    <span className="text-emerald-400 font-bold">{p.payout_matic} MATIC (~${Math.round(p.payout_matic * 0.85)})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chainlink Oracle Simulation & L2 Execution Console */}
        <div className="lg:col-span-7 panel p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Chainlink IoT Weather Oracle Feeder
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Target: <span className="text-white font-medium">{activePolicy?.region}</span>
              </span>
            </div>

            {/* Quick Trigger Buttons (Mission Control Style) */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">
                Simulate Weather Disaster Telemetry:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleSimulateTrigger(8.4, 'Severe Arid Drought: 21-day rainfall fell to 8.4mm')}
                  disabled={isExecuting}
                  className="p-3 rounded-lg bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      Drought
                    </span>
                    <span className="text-[10px] font-mono opacity-80">&lt; 20mm</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1">Sensor: 8.4mm</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">→ Payout Triggered</div>
                </button>

                <button
                  onClick={() => handleSimulateTrigger(285.0, 'Flash Monsoon Flood: 48h rainfall reached 285mm')}
                  disabled={isExecuting}
                  className="p-3 rounded-lg bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5" />
                      Flash Flood
                    </span>
                    <span className="text-[10px] font-mono opacity-80">&gt; 220mm</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1">Sensor: 285mm</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">→ Payout Triggered</div>
                </button>

                <button
                  onClick={() => handleSimulateTrigger(75.0, 'Normal Seasonal Conditions: 75mm rainfall recorded')}
                  disabled={isExecuting}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-white/[0.06] text-left transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      Normal
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Safe</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">Sensor: 75.0mm</div>
                  <div className="text-[10px] text-slate-500 mt-1">No threshold breach</div>
                </button>
              </div>
            </div>

            {/* Polygon L2 Execution Log Terminal */}
            <div className="subpanel p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/[0.04] pb-1.5">
                <span>ON-CHAIN EXECUTION LOG · POLYGON L2</span>
                <span>STATUS: {isExecuting ? "TRANSACTING..." : payoutResult?.breached ? "SETTLED" : "STANDBY"}</span>
              </div>

              {isExecuting && (
                <div className="py-4 text-center text-amber-400 space-y-1.5">
                  <RefreshCw className="w-4 h-4 mx-auto animate-spin" />
                  <p className="text-xs">Chainlink node feeding cryptographically verified telemetry into Polygon smart contract...</p>
                </div>
              )}

              {payoutResult && !isExecuting && (
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{payoutResult.message}</span>
                  </div>

                  {payoutResult.payout && (
                    <div className="space-y-1.5 text-[11px] bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Beneficiary Address:</span>
                        <span className="text-white font-medium">{payoutResult.payout.beneficiary_wallet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Micro-Payout Disbursed:</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {payoutResult.payout.payout_amount_matic} MATIC (~${payoutResult.payout.payout_amount_usd} USD)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Execution Latency:</span>
                        <span className="text-amber-300 font-bold font-mono">
                          {payoutResult.payout.latency_seconds}s (vs 45 Days legacy manual claim!)
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-emerald-500/10 text-slate-400">
                        <span>Polygon Tx Hash:</span>
                        <button
                          onClick={() => copyToClipboard(payoutResult.payout.polygon_tx_hash)}
                          className="flex items-center gap-1 text-cyan-400 hover:underline"
                        >
                          <span>{payoutResult.payout.polygon_tx_hash.slice(0, 18)}...</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!payoutResult && !isExecuting && (
                <div className="py-6 text-center text-slate-500 text-xs">
                  Click a weather disaster preset above to trigger the autonomous Chainlink oracle smart contract.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Latency Guarantee Card */}
          <div className="subpanel p-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Legacy Manual Bureaucracy: <s className="text-rose-400">45–60 Days</s></span>
            <span className="text-emerald-400 font-bold">Autonomous Smart Payout: &lt; 5 Seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
