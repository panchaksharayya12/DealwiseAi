import React from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate(id);
    }
  };

  return (
    <footer className="w-full bg-black border-t border-white/10 px-6 md:px-12 lg:px-16 py-16 text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-semibold tracking-tight text-white">
                DEALWISE AI
              </span>
            </div>
            <p className="text-sm text-zinc-400 font-light">
              Know the deal before you buy.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8 text-sm">
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('analyze')}
              className="hover:text-white transition-colors"
            >
              Analyze
            </button>
            <button
              onClick={() => scrollTo('compare')}
              className="hover:text-white transition-colors"
            >
              Compare
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="hover:text-white transition-colors"
            >
              FAQ
            </button>
            <span className="text-zinc-600 hover:text-zinc-400 cursor-pointer">
              Privacy
            </span>
            <span className="text-zinc-600 hover:text-zinc-400 cursor-pointer">
              Terms
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-light gap-4">
          <p>© 2026 DealWise AI. All rights reserved.</p>
          <p>
            Deterministic Valuation Engine • Real Estate Analytics Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};
