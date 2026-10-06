import React, { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const faqs: FaqItem[] = [
    {
      q: 'What does DealWise AI analyze?',
      a: 'DealWise AI evaluates key real estate quantitative fundamentals including price per sq.ft, capitalization rate, gross and net rental yield, monthly loan EMI obligations, total interest payable across loan tenure, Loan-to-Value (LTV) ratio, monthly carrying cashflow, and an aggregate weighted Deal Score.',
    },
    {
      q: 'Is the Deal Score guaranteed?',
      a: 'No. The Deal Score is a deterministic diagnostic tool designed to highlight quantitative strengths and vulnerabilities based on current parameters entered by the user. It is not a guarantee of future property value appreciation, rental occupancy, or returns.',
    },
    {
      q: 'How is rental yield calculated?',
      a: 'Gross rental yield is computed as: (Expected Annual Rent / Asking Price) * 100. Net rental yield subtracts annual society maintenance: ((Expected Annual Rent - Annual Maintenance) / Asking Price) * 100.',
    },
    {
      q: 'Can I compare properties?',
      a: 'Yes. DealWise includes a side-by-side benchmarking module that allows you to compare two or more properties across asking price, yield, EMI, price per sq.ft, monthly carry, and overall Deal Score, automatically identifying the strongest deal.',
    },
    {
      q: 'Can I save my analysis?',
      a: 'Yes. When Supabase is configured via environment variables, analyses are stored in your secure Supabase database. When unconfigured, analyses are automatically saved locally in your browser storage so you can retrieve or delete them at any time.',
    },
    {
      q: 'Can I generate a report?',
      a: 'Yes. You can generate and download a comprehensive, professional investment due diligence PDF report by clicking the "Generate Deal Report" button on any analyzed property.',
    },
    {
      q: 'Is this financial advice?',
      a: 'No. DealWise AI is an analytical software tool for informational and decision-support purposes only. It is not a substitute for professional legal, tax, appraisal, or financial advisory services. Buyers must always independently verify municipal sanctions, RERA registration, and physical title deeds.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-2 block">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-white leading-tight">
              Questions & answers.
            </h2>
            <p className="mt-3 text-sm md:text-base text-zinc-400 font-light">
              Everything you need to know about DealWise AI calculations and methodology.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={idx} delay={idx * 50}>
                <div
                  className={`liquid-glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-white/30 bg-white/[0.04]' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg font-normal text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-xs md:text-sm text-zinc-300 font-light leading-relaxed border-t border-white/5 mt-1 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
