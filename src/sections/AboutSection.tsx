import React from 'react';
import { Reveal } from '../components/Reveal';
import { Target, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-2 block">
                About DealWise AI
              </span>
              <h2 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-white leading-tight">
                Built for smarter property decisions.
              </h2>
              <p className="mt-6 text-base md:text-lg text-zinc-300 font-light leading-relaxed">
                DealWise AI brings financial calculations, property analysis and AI-assisted reasoning into one simple platform.
              </p>
              <p className="mt-4 text-sm text-zinc-400 font-light leading-relaxed">
                Most homebuyers and real estate investors make multi-crore buying decisions based on emotional impressions, architectural renders, or broker hype. DealWise AI restores balance by placing cold, verifiable numbers, debt amortization, and stress-tested risk analysis front and center.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Deterministic Financial Precision</h4>
                    <p className="text-xs text-zinc-400 font-light">Calculations are never hallucinated by large language models.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Clear Risk Taxonomy</h4>
                    <p className="text-xs text-zinc-400 font-light">Explicit warnings on negative cashflow carry, excessive debt, and operational leaks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Objective Deal Scoring</h4>
                    <p className="text-xs text-zinc-400 font-light">Weighted scoring algorithm evaluating yields, leverage safety, and liquidity factors.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-8 border border-white/15 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <ShieldCheck className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-lg font-medium text-white">Ethical Analytics Standard</h3>
                  <p className="text-xs text-zinc-400 font-light">Transparent modeling without bias or broker incentives</p>
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
                <p>
                  We believe that real estate evaluation should be as rigorous and data-driven as equity portfolio management. DealWise does not sell properties, take commissions, or partner with promoters.
                </p>
                <p className="text-zinc-400">
                  <strong>Important Notice:</strong> DealWise AI is an analytical software platform created to support your independent research. DealWise is not a registered investment advisor, real estate broker, or legal practice.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                <Compass className="w-5 h-5 text-zinc-400 shrink-0" />
                <span className="text-xs text-zinc-300 font-mono">
                  Guiding principle: Protect capital before chasing appreciation.
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
