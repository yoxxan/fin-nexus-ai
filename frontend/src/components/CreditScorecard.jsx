import React, { useState, useEffect } from 'react';
import { Cpu, Check, AlertTriangle, Sliders, RefreshCw, Info, UserCheck, Shield } from 'lucide-react';
import { scoreCredit, fetchPersonas } from '../services/api';

export default function CreditScorecard({ externalData }) {
  const [personas, setPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  
  // Telemetry Inputs
  const [applicantName, setApplicantName] = useState('Lakshmi Narayanan');
  const [utilityOntime, setUtilityOntime] = useState(0.95);
  const [rechargeRegularity, setRechargeRegularity] = useState(0.90);
  const [simTenureMonths, setSimTenureMonths] = useState(48);
  const [walletRatio, setWalletRatio] = useState(1.25);
  const [emergencyRepaid, setEmergencyRepaid] = useState(1.0);

  // Score Output
  const [scoreResult, setScoreResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchPersonas();
      if (res?.personas?.length) {
        setPersonas(res.personas);
        const p = res.personas[0];
        setSelectedPersonaId(p.id);
        applyPersona(p);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (externalData) {
      if (externalData.applicant_name) setApplicantName(externalData.applicant_name);
      if (externalData.behavioral_features) {
        const bf = externalData.behavioral_features;
        if (bf.utility_bill_ontime_ratio !== undefined) setUtilityOntime(bf.utility_bill_ontime_ratio);
        if (bf.recharge_regularity_index !== undefined) setRechargeRegularity(bf.recharge_regularity_index);
        if (bf.sim_card_tenure_months !== undefined) setSimTenureMonths(bf.sim_card_tenure_months);
        if (bf.mobile_wallet_in_out_ratio !== undefined) setWalletRatio(bf.mobile_wallet_in_out_ratio);
        if (bf.emergency_airtime_loan_cleared_pct !== undefined) setEmergencyRepaid(bf.emergency_airtime_loan_cleared_pct);
      }
      setSelectedPersonaId('custom_voice');
    }
  }, [externalData]);

  const applyPersona = (persona) => {
    setSelectedPersonaId(persona.id);
    const d = persona.data;
    setApplicantName(d.applicant_name);
    setUtilityOntime(d.utility_bill_ontime_ratio);
    setRechargeRegularity(d.recharge_regularity_index);
    setSimTenureMonths(d.sim_card_tenure_months);
    setWalletRatio(d.mobile_wallet_in_out_ratio);
    setEmergencyRepaid(d.emergency_airtime_loan_cleared_pct);
  };

  const runScoring = async () => {
    setIsCalculating(true);
    try {
      const payload = {
        applicant_name: applicantName,
        utility_bill_ontime_ratio: utilityOntime,
        recharge_regularity_index: rechargeRegularity,
        sim_card_tenure_months: simTenureMonths,
        mobile_wallet_in_out_ratio: walletRatio,
        emergency_airtime_loan_cleared_pct: emergencyRepaid,
        avg_recharge_amount_usd: 5.0,
        recharge_frequency_per_month: 5.0,
        nighttime_activity_ratio: 0.12
      };
      const res = await scoreCredit(payload);
      if (res?.data) {
        setScoreResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runScoring();
    }, 120);
    return () => clearTimeout(timer);
  }, [utilityOntime, rechargeRegularity, simTenureMonths, walletRatio, emergencyRepaid, applicantName]);

  const score = scoreResult?.score || 720;
  // Calculate SVG stroke offset for the circular gauge (circumference: 2 * PI * 54 ≈ 339.29)
  const scorePercent = Math.max(0, Math.min(1, (score - 300) / 600));
  const strokeDashoffset = 339.29 * (1 - scorePercent * 0.75); // 270 degree arc

  return (
    <section id="credit" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header with Refactoring UI Hierarchy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pillar 02 · Behavioral Risk Assessment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Credit Proxy Engine
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Proprietary Gradient Boosting (XGBoost) model trained on alternative telco & utility telemetry. Generates dynamic, explainable creditworthiness without requiring traditional banking history.
          </p>
        </div>

        {/* Persona Segmented Switcher */}
        <div className="flex items-center bg-[#0d1322] p-1 rounded-lg border border-white/[0.06] text-xs">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPersona(p)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                selectedPersonaId === p.id
                  ? 'bg-slate-800 text-white shadow-sm font-semibold border border-white/[0.08]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
          {externalData && (
            <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 font-mono text-[10px] ml-1">
              Voice Applied
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Telemetry Controls & Precision Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hardware-Grade Telemetry Sliders */}
        <div className="lg:col-span-7 panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Alternative Data Telemetry Signals
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: <strong className="text-white font-medium">{applicantName}</strong></span>
            </div>
          </div>

          <div className="space-y-5">
            {/* Control 1: Utility Payment Consistency */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Electricity & Water On-Time Ratio</span>
                <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/[0.04]">
                  {Math.round(utilityOntime * 100)}% on-time
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.02"
                value={utilityOntime}
                onChange={(e) => setUtilityOntime(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0% (Erratic)</span>
                <span>Primary proxy for financial payment discipline</span>
                <span>100% (Flawless)</span>
              </div>
            </div>

            {/* Control 2: Telco Recharge Regularity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Weekly Mobile Recharge Cadence Regularity</span>
                <span className="font-mono text-amber-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/[0.04]">
                  {Math.round(rechargeRegularity * 100)}% consistency
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.02"
                value={rechargeRegularity}
                onChange={(e) => setRechargeRegularity(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Low Consistency</span>
                <span>Proves recurring weekly cashflow without bank slips</span>
                <span>High Consistency</span>
              </div>
            </div>

            {/* Control 3: SIM Card Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Verified SIM & Phone Number Tenure</span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/[0.04]">
                  {simTenureMonths} Months ({Math.round(simTenureMonths / 12 * 10) / 10} yrs)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="84"
                step="1"
                value={simTenureMonths}
                onChange={(e) => setSimTenureMonths(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1 mo (High Churn)</span>
                <span>Geographic & digital identity persistence proxy</span>
                <span>84 mos (Stable)</span>
              </div>
            </div>

            {/* Control 4: Mobile Wallet Inflow/Outflow */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Mobile Wallet Cashflow Ratio (Inflow / Outflow)</span>
                <span className="font-mono text-purple-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/[0.04]">
                  {walletRatio.toFixed(2)}x surplus
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.05"
                value={walletRatio}
                onChange={(e) => setWalletRatio(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0.3x (Deficit)</span>
                <span>Values &gt; 1.0x demonstrate retained working capital</span>
                <span>2.5x (High Surplus)</span>
              </div>
            </div>

            {/* Control 5: Emergency Airtime Advance Repayment */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Emergency Telco Airtime Advance Repayment Rate</span>
                <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/[0.04]">
                  {Math.round(emergencyRepaid * 100)}% repaid
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={emergencyRepaid}
                onChange={(e) => setEmergencyRepaid(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>20% (Default)</span>
                <span>Direct proxy for willingness to honor micro-credit</span>
                <span>100% (Honor)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calibrated Score Gauge & Underwriting Terms */}
        <div className="lg:col-span-5 panel p-6 flex flex-col justify-between space-y-6">
          {/* Top Arc Gauge */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/[0.04] pb-2">
              <span>CALIBRATED CREDIT PROXY SCORE</span>
              {isCalculating ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : (
                <span className="text-emerald-400 font-semibold">XGBOOST V1.2 ACTIVE</span>
              )}
            </div>

            {/* SVG Circular Precision Meter */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center pt-2">
              <svg className="w-full h-full transform -rotate-135" viewBox="0 0 120 120">
                {/* Background track */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                  strokeDasharray="235.6"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Active progress */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={score >= 720 ? "#10b981" : score >= 620 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray="235.6"
                  strokeDashoffset={235.6 * (1 - scorePercent)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                  {score}
                </span>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Scale: 300–900
                </span>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-300">
              {scoreResult?.tier || 'Analyzing Profile...'}
            </div>
          </div>

          {/* Underwriting Terms Card */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="subpanel p-3 text-center">
              <span className="text-[10px] uppercase text-slate-500 block">Eligible Micro-Capital</span>
              <span className="text-lg font-bold text-emerald-400 block mt-0.5">
                ${scoreResult?.max_eligible_loan_usd || 600} USD
              </span>
              <span className="text-[10px] text-slate-500">Instant Liquidity</span>
            </div>

            <div className="subpanel p-3 text-center">
              <span className="text-[10px] uppercase text-slate-500 block">Assigned APR</span>
              <span className="text-lg font-bold text-amber-400 block mt-0.5">
                {scoreResult?.suggested_interest_apr || 5.8}%
              </span>
              <span className="text-[10px] text-slate-500">Zero Collateral</span>
            </div>
          </div>

          {/* Explainability Breakdown (SHAP Proxy Ledger) */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/[0.04] pb-1">
              <span>Explainable Factors (SHAP Proxy)</span>
              <span className="text-amber-400/90 font-medium">Auditable Risk</span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {scoreResult?.positive_factors?.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2 subpanel p-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-300">{f.feature} ({f.impact}): </span>
                    <span className="text-slate-400">{f.detail}</span>
                  </div>
                </div>
              ))}
              {scoreResult?.risk_factors?.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2 subpanel p-2 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-rose-300">{f.feature} ({f.impact}): </span>
                    <span className="text-slate-400">{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Stamp */}
          <div className="subpanel p-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status: <strong className="text-white">{scoreResult?.status || 'APPROVED'}</strong></span>
            </span>
            <span className="text-slate-500">Zero Predatory Terms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
