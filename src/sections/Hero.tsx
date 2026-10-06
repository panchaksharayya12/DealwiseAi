import React from 'react';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { FadeIn } from '../components/FadeIn';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick, onExploreClick }) => {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-black"
    >
      {/* 
        CRITICAL HERO BACKGROUND VIDEO:
        Must NOT have dark overlay, gradient overlay, or black transparent layer.
        Raw video remains directly visible.
      */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Top spacing placeholder for navbar */}
      <div className="pt-28" />

      {/* Bottom Aligned Hero Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex-1 flex flex-col justify-end">
        <div className="lg:grid lg:grid-cols-2 lg:items-end gap-12 xl:gap-20">
          
          {/* LEFT COLUMN: Headings & Primary Actions */}
          <div className="flex flex-col items-start max-w-2xl">
            {/* Animated character-by-character title */}
            <AnimatedHeading
              text={"Know the deal\nbefore you buy."}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white leading-[1.05]"
              charDelay={30}
              initialDelay={200}
              duration={500}
            />

            {/* Subheading: Fades in after 800ms */}
            <FadeIn delay={800} duration={600} className="mt-6">
              <p className="text-base md:text-lg text-zinc-300 font-light leading-relaxed">
                Analyze the numbers. Understand the risks. Make smarter property decisions.
              </p>
            </FadeIn>

            {/* CTA Buttons: Fade in after 1200ms */}
            <FadeIn delay={1200} duration={600} className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onAnalyzeClick}
                className="bg-white text-black px-8 py-3 rounded-lg font-medium text-sm md:text-base hover:bg-zinc-200 transition-all duration-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
              >
                Analyze a Property
              </button>

              <button
                onClick={onExploreClick}
                className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-normal text-sm md:text-base hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.98]"
              >
                Explore DealWise
              </button>
            </FadeIn>
          </div>

          {/* RIGHT COLUMN: Glass card + Supporting badge */}
          <div className="mt-10 lg:mt-0 flex flex-col lg:items-end justify-end space-y-6">
            {/* Small glass card: Fades in at 1400ms */}
            <FadeIn delay={1400} duration={700}>
              <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md border border-white/10 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-zinc-400 mb-3">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-xs uppercase tracking-wider font-medium text-zinc-300">
                    Proprietary Valuation Core
                  </span>
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-light text-white leading-snug">
                  AI-powered property intelligence.
                </h2>
                <p className="mt-2 text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
                  Real-time yield modeling, cashflow forecasting, debt stress testing, and structured risk classification.
                </p>
              </div>
            </FadeIn>

            {/* Bottom-right glass badge (Section 12) */}
            <FadeIn delay={1600} duration={600}>
              <div className="liquid-glass rounded-full px-5 py-2 border border-white/15 text-xs text-zinc-300 font-light tracking-wide flex items-center gap-2 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Price • ROI • Rent • Risk • AI</span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Subtle scroll cue */}
        <div className="mt-8 flex justify-center lg:justify-start">
          <button
            onClick={onExploreClick}
            aria-label="Scroll to value section"
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-2"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
