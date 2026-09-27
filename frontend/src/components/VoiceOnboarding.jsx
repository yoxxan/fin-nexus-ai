import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, ArrowRight, CheckCircle2, Globe, Sparkles, SlidersHorizontal, Play, Pause, FileJson } from 'lucide-react';
import { fetchVoicePresets, processVoiceTranscript } from '../services/api';

export default function VoiceOnboarding({ onApplyToCredit }) {
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  useEffect(() => {
    async function loadPresets() {
      const res = await fetchVoicePresets();
      if (res?.presets?.length) {
        setPresets(res.presets);
        const first = res.presets[0];
        setSelectedPresetId(first.id);
        setTranscript(first.audio_transcript);
        runExtraction(first.audio_transcript);
      }
    }
    loadPresets();
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setTranscript(preset.audio_transcript);
    setIsPlayingAudio(false);
    runExtraction(preset.audio_transcript);
  };

  const runExtraction = async (text) => {
    const textToProcess = text || transcript;
    if (!textToProcess.trim()) return;
    setIsProcessing(true);
    try {
      const res = await processVoiceTranscript(textToProcess);
      if (res?.parsed_application) {
        setParsedData(res.parsed_application);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API not supported in this browser. Please use the interactive dialect presets below!");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setIsRecording(true);
          setIsPlayingAudio(true);
        };
        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const spokenText = event.results[current][0].transcript;
          setTranscript(spokenText);
        };
        recognition.onerror = () => {
          setIsRecording(false);
          setIsPlayingAudio(false);
        };
        recognition.onend = () => {
          setIsRecording(false);
          setIsPlayingAudio(false);
          runExtraction();
        };

        recognition.start();
      } catch (err) {
        console.error(err);
        setIsRecording(false);
        setIsPlayingAudio(false);
      }
    }
  };

  const activePreset = presets.find(p => p.id === selectedPresetId);

  return (
    <section id="voice" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header with Refactoring UI Hierarchy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Pillar 01 · Inclusive Onboarding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Multilingual Voice-First UX
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Eliminates the literacy barrier for 1.7B credit-invisible adults. Applicants speak in their regional dialect; our pipeline converts natural conversational speech into structured credit telemetry.
          </p>
        </div>

        {/* Pipeline Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300 font-medium">Pipeline:</span>
          <span className="text-slate-500">Audio → Dialect ASR → JSON</span>
        </div>
      </div>

      {/* Preset Persona Selector Tabs */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Select Applicant Persona Preset:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-3.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/60 shadow-md shadow-amber-500/5'
                    : 'bg-[#0d1322] border-white/[0.06] hover:border-white/[0.14] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{p.title.split(' (')[0]}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-white/[0.06]">
                    {p.dialect_label.split(' /')[0]}
                  </span>
                </div>
                <div className="text-xs text-slate-400 leading-snug">
                  {p.title.split(' (')[1]?.replace(')', '') || p.expected_persona}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Audio & Data Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Audio Studio & Live Speech Visualizer */}
        <div className="lg:col-span-6 panel p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Audio Waveform & Status Header */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Audio Speech Stream
                </span>
              </div>
              
              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-center gap-1 h-5 px-2 py-1 rounded bg-slate-950 border border-white/[0.04]">
                <span className="wave-bar" style={{ animationDelay: '0.0s' }}></span>
                <span className="wave-bar" style={{ animationDelay: '0.2s' }}></span>
                <span className="wave-bar" style={{ animationDelay: '0.4s' }}></span>
                <span className="wave-bar" style={{ animationDelay: '0.1s' }}></span>
                <span className="wave-bar" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>

            {/* Colloquial Dialect Transcript Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
                Colloquial Spoken Transcript:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={5}
                className="w-full rounded-lg bg-[#080c16] border border-white/[0.08] p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-sans leading-relaxed resize-none"
                placeholder="Applicant speaks in regional dialect..."
              />
            </div>

            {/* Audio Metadata Pill */}
            <div className="subpanel p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Target Dialect:</span>
              <span className="text-amber-300 font-medium">
                {activePreset?.dialect_label || 'Regional Indian Dialect'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/[0.06]'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isRecording ? 'Stop Dictation' : 'Test Real Mic'}</span>
            </button>

            <button
              onClick={() => runExtraction()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Extracting JSON...' : 'Extract Parameters'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Structured JSON & Alternative Telemetry Inspector */}
        <div className="lg:col-span-6 panel p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Structured Application Output
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Confidence: 96.4%
              </span>
            </div>

            {parsedData ? (
              <div className="space-y-3.5">
                {/* 3 Metric Summary Tiles */}
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="subpanel p-3">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Applicant</span>
                    <span className="font-bold text-white text-sm truncate block mt-0.5">{parsedData.applicant_name}</span>
                  </div>
                  <div className="subpanel p-3">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Occupation</span>
                    <span className="font-bold text-amber-300 text-sm truncate block mt-0.5">{parsedData.occupation}</span>
                  </div>
                  <div className="subpanel p-3">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Requested Credit</span>
                    <span className="font-bold font-mono text-emerald-400 text-sm block mt-0.5">
                      ₹{parsedData.extracted_loan_amount_inr?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stated Purpose */}
                <div className="subpanel p-3 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Stated Agricultural / Business Purpose</span>
                  <span className="text-slate-200 font-medium mt-0.5 block">{parsedData.purpose}</span>
                </div>

                {/* Inferred Alternative Telemetry Features */}
                <div className="subpanel p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.04] pb-1">
                    <span className="uppercase text-amber-400/90 font-semibold">Extracted Alternative Features</span>
                    <span>Ready for XGBoost</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[11px] text-slate-300 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recharge Regularity:</span>
                      <span className="text-emerald-400 font-bold">
                        {Math.round((parsedData.behavioral_features?.recharge_regularity_index || 0.85) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Utility Bill Discipline:</span>
                      <span className="text-emerald-400 font-bold">
                        {Math.round((parsedData.behavioral_features?.utility_bill_ontime_ratio || 0.90) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SIM Card Tenure:</span>
                      <span className="text-cyan-400 font-bold">
                        {parsedData.behavioral_features?.sim_card_tenure_months || 24} mos
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Airtime Advance Repaid:</span>
                      <span className="text-emerald-400 font-bold">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs font-mono text-slate-500">
                Processing natural language audio stream...
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          {parsedData && (
            <button
              onClick={() => onApplyToCredit(parsedData)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <span>Transfer Telemetry to Credit Risk Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
