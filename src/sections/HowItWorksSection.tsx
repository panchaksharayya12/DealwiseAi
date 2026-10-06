import React from 'react';
import { Reveal } from '../components/Reveal';
import { FileEdit, BarChart3, AlertOctagon, Trophy } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Enter Property',
      desc: 'Input basic purchase details, expected rental income, loan structure, and maintenance parameters.',
      icon: FileEdit,
    },
    {
      num: '02',
      title: 'Calculate the Numbers',
      desc: 'DealWise executes deterministic financial modeling for capitalization yields, amortization EMI, and net cashflow.',
      icon: BarChart3,
    },
    {
      num: '03',
      title: 'Understand the Risks',
      desc: 'System detects hidden leverage vulnerabilities, maintenance drag, and compares against benchmark yields.',
      icon: AlertOctagon,
    },
    {
      num: '04',
      title: 'Make a Smarter Decision',
      desc: 'Receive an overall Deal Score, 5-year projections, due-diligence verification checklists, and investor PDF reports.',
      icon: Trophy,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-3 block">
              Methodology
            </span>
            <h2 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-white leading-tight">
              From property details to a smarter decision.
            </h2>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light">
              Four structured steps to evaluate any residential or commercial acquisition.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.num} delay={idx * 120}>
                <div className="liquid-glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400">
                        STEP {step.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                    <span>STATUS: READY</span>
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
