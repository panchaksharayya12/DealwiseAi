import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', target: 'hero' },
    { name: 'Analyze', target: 'analyze' },
    { name: 'Compare', target: 'compare' },
    { name: 'How It Works', target: 'how-it-works' },
    { name: 'About', target: 'about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-16 pt-6 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="liquid-glass rounded-xl px-4 md:px-6 py-3 flex items-center justify-between pointer-events-auto border border-white/10"
      >
        {/* Left: Brand Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="text-left group flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-white/40 rounded-lg p-1"
        >
          <span className="text-xl md:text-2xl font-semibold tracking-tight text-white transition-opacity group-hover:opacity-90">
            DEALWISE
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
            AI
          </span>
        </button>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300 font-normal">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className="text-zinc-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right: CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo('analyze')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-white text-black px-5 md:px-6 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span>Analyze a Property</span>
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white bg-white/5 rounded-lg border border-white/10 focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 liquid-glass rounded-xl p-4 border border-white/15 pointer-events-auto shadow-2xl transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="text-left px-3 py-2 text-sm text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => scrollTo('analyze')}
                className="w-full text-center bg-white text-black px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Analyze a Property
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
