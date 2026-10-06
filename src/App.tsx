import React, { useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { ValueSection } from './sections/ValueSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { AnalyzeSection } from './sections/AnalyzeSection';
import { CompareSection } from './sections/CompareSection';
import { SavedAnalysesSection } from './sections/SavedAnalysesSection';
import { AboutSection } from './sections/AboutSection';
import { FaqSection } from './sections/FaqSection';
import { FinalCtaSection } from './sections/FinalCtaSection';
import { Footer } from './components/Footer';
import { SavedAnalysisRecord } from './types';

export function App() {
  const handleNavigate = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSavedAnalysis = (record: SavedAnalysisRecord) => {
    // Scroll to Analyze Section and let user inspect
    handleNavigate('analyze');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Floating Glass Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Hero Section with raw background video and character animations */}
      <Hero
        onAnalyzeClick={() => handleNavigate('analyze')}
        onExploreClick={() => handleNavigate('value-section')}
      />

      {/* Problem / Value Section */}
      <ValueSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Overview */}
      <FeaturesSection />

      {/* Core Analyze Property Section & Analysis Dashboard */}
      <AnalyzeSection
        onCompareRequest={() => handleNavigate('compare')}
      />

      {/* Multi-Property Benchmarking Section */}
      <CompareSection />

      {/* Saved Analyses Archive */}
      <SavedAnalysesSection onOpenAnalysis={handleOpenSavedAnalysis} />

      {/* About Section */}
      <AboutSection />

      {/* FAQ Accordion Section */}
      <FaqSection />

      {/* Final Cinematic Call to Action */}
      <FinalCtaSection onAnalyzeClick={() => handleNavigate('analyze')} />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
