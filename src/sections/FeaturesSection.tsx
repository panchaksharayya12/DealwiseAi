import React from 'react';
import { Reveal } from '../components/Reveal';
import {
  BrainCircuit,
  Calculator,
  Percent,
  TrendingUp,
  Scale,
  ShieldAlert,
  LineChart,
  Bot,
  FileDown,
  BookmarkCheck,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'AI Deal Analysis',
      desc: 'Qualitative synthesis and strategic due diligence recommendations generated alongside exact mathematical metrics.',
      icon: BrainCircuit,
    },
    {
      title: 'Financial Calculator',
      desc: 'Deterministic calculations for price per sq.ft, capitalization rates, monthly EMI obligations, and carrying costs.',
      icon: Calculator,
    },
    {
      title: 'Rental Yield Analysis',
      desc: 'Evaluates gross vs net rental yield against urban metropolitan market benchmarks and inflation rates.',
      icon: Percent,
    },
    {
      title: 'ROI Estimation',
      desc: 'Models annual cash-on-cash returns, leverage debt costs, and equity growth without misleading claims.',
      icon: TrendingUp,
    },
    {
      title: 'Property Comparison',
      desc: 'Benchmark multiple candidate deals head-to-head with highlighted metric winners and deal classifications.',
      icon: Scale,
    },
    {
      title: 'Risk Detection',
      desc: 'Pinpoints severe leverage (LTV), negative monthly carry, maintenance drag, and aging construction liabilities.',
      icon: ShieldAlert,
    },
    {
      title: '5-Year Projection',
      desc: 'Dynamic interactive scenario modeling simulating capital appreciation and cumulative cash distributions.',
      icon: LineChart,
    },
    {
      title: 'AI Property Assistant',
      desc: 'Inquire directly about valuation sanity, negotiation angles, and risk factors with active property context.',
      icon: Bot,
    },
    {
      title: 'PDF Reports',
      desc: 'Export executive-grade due-diligence valuation reports formatted for investors, lenders, or personal records.',
      icon: FileDown,
    },
    {
      title: 'Saved Analyses',
      desc: 'Secure archive of evaluated properties with dual-layer cloud persistence (Supabase) and offline localStorage.',
      icon: BookmarkCheck,
    },
  ];

  return (
    <section
      id="features"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-white leading-tight">
              Precision tools for high-stakes decisions.
            </h2>
            <p className="mt-4 text-base text-zinc-400 font-light">
              Every feature is built around mathematical rigor and clear risk identification.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Reveal key={feat.title} delay={idx * 60}>
                <div className="liquid-glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/10 transition-colors mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-medium text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
