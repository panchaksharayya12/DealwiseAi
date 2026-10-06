import React from 'react';
import { Reveal } from '../components/Reveal';
import { Calculator, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ValueSection: React.FC = () => {
  const cards = [
    {
      num: '01',
      title: 'Know the Numbers',
      icon: Calculator,
      description:
        'Understand price per sq.ft, rental yield, ROI, EMI and projected returns with deterministic precision.',
      details: 'Evaluates capitalization rate, loan amortization burden, and net monthly carry.',
    },
    {
      num: '02',
      title: 'See the Risks',
      icon: ShieldAlert,
      description:
        'Identify expensive pricing, weak rental potential and other warning signals before placing capital.',
      details: 'Highlights severe leverage exposure, aging construction liabilities, and negative cashflow.',
    },
    {
      num: '03',
      title: 'Decide With Confidence',
      icon: CheckCircle2,
      description:
        'Turn complex property information into a simple deal assessment backed by transparent scoring.',
      details: 'Compare multiple opportunities side-by-side with clear, objective recommendations.',
    },
  ];

  return (
    <section
      id="value-section"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl mb-16 md:mb-20">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-3 block">
              Investment Philosophy
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[-0.03em] text-white leading-tight">
              Property price is only the beginning.
            </h2>
            <p className="mt-6 text-base md:text-lg text-zinc-400 font-light leading-relaxed">
              Buying a property is a financial decision, not just a location decision. DealWise AI brings price, rental potential, returns and risks together in one clear analysis.
            </p>
          </div>
        </Reveal>

        {/* 3 Premium Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.num} delay={idx * 150}>
                <div className="liquid-glass rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full group hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-2xl font-mono font-light text-zinc-500 group-hover:text-white transition-colors">
                        {card.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/10 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-normal text-white mb-3 tracking-tight">
                      {card.title}
                    </h3>

                    <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed mb-4">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-zinc-500 font-light">
                      {card.details}
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
