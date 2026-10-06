import React from 'react';
import { Reveal } from '../components/Reveal';
import { ArrowUpRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onAnalyzeClick: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onAnalyzeClick }) => {
  return (
    <section className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <Reveal>
          <div className="liquid-glass rounded-3xl p-10 md:p-16 border border-white/15 shadow-2xl relative overflow-hidden">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-4 block">
              Start Your Evaluation
            </span>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[-0.04em] text-white leading-tight mb-6">
              Before you buy the property,<br />
              understand the deal.
            </h2>

            <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-light leading-relaxed mb-10">
              Run your numbers through deterministic yield checks, risk flags, and 5-year projections in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onAnalyzeClick}
                className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-xl font-medium text-sm md:text-base hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95"
              >
                <span>Analyze a Property</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
