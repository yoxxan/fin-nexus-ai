import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import VoiceOnboarding from './components/VoiceOnboarding';
import CreditScorecard from './components/CreditScorecard';
import ParametricInsurance from './components/ParametricInsurance';
import ComparativeTable from './components/ComparativeTable';
import ZkPrivacyModal from './components/ZkPrivacyModal';

export default function App() {
  const [activeSection, setActiveSection] = useState('voice');
  const [voiceExtractedData, setVoiceExtractedData] = useState(null);
  const [isZkModalOpen, setIsZkModalOpen] = useState(false);

  // Jump smoothly to a section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When applicant data is transferred from Voice-to-JSON
  const handleApplyToCredit = (data) => {
    setVoiceExtractedData(data);
    scrollToSection('credit');
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onSelectSection={scrollToSection} activeSection={activeSection} />

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* Hero & Hackathon Judge Quick Action Bar */}
        <HeroBanner
          onQuickDemo={(section) => scrollToSection(section)}
          onOpenZkModal={() => setIsZkModalOpen(true)}
        />

        {/* Section 1: Voice-First Inclusive UX */}
        <VoiceOnboarding onApplyToCredit={handleApplyToCredit} />

        {/* Section 2: AI Credit Proxy (XGBoost Scoring) */}
        <CreditScorecard externalData={voiceExtractedData} />

        {/* Section 3: Parametric Insurance & Chainlink Oracle */}
        <ParametricInsurance />

        {/* Section 4: Market Comparative Edge Table */}
        <ComparativeTable />
      </main>

      {/* ZK Privacy Modal */}
      <ZkPrivacyModal
        isOpen={isZkModalOpen}
        onClose={() => setIsZkModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-[#050811] py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-mono text-slate-400">
          <span className="font-bold text-amber-400">FIN-NEXUS AI</span>
          <span>·</span>
          <span>Team CodeCommit</span>
          <span>·</span>
          <span>Tech Horizon 2.0</span>
        </div>
        <p className="max-w-xl mx-auto text-slate-500 text-[11px]">
          Empowering the next billion through decentralized behavioral intelligence and autonomous climate risk hedging. Built for IEEE GNITC Open Innovation Hackathon.
        </p>
      </footer>
    </div>
  );
}
