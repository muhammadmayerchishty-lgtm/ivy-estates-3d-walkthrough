import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowDown, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { BRAND } from '../data/brand';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-black flex flex-col justify-between pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle radial luxury atmospheric glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[400px] pointer-events-none opacity-40 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #8A6A2B 0%, #B98A2E 35%, transparent 70%)',
        }}
      />

      {/* Subtle architectural hairline background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#8A6A2B15_1px,transparent_1px),linear-gradient(to_bottom,#8A6A2B15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-5xl mx-auto w-full text-center my-auto z-10 flex flex-col items-center">
        {/* Hero Logo on pure black with mix-blend-mode: screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 flex justify-center"
        >
          <div className="relative group bg-black p-2 rounded-2xl">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-44 sm:h-56 md:h-64 lg:h-72 w-auto object-contain mx-auto drop-shadow-[0_10px_35px_rgba(230,195,106,0.18)]"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </motion.div>

        {/* Tagline & Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#E6C36A]/30 bg-[#0B0B0C]/80 backdrop-blur-sm text-[10px] sm:text-xs text-[#E6C36A] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans text-center max-w-full">
            <MapPin className="w-3.5 h-3.5 text-[#E6C36A] shrink-0" />
            <span className="truncate sm:whitespace-normal">Lahore, Pakistan · Luxury Real Estate</span>
          </div>

          <h1 className="text-[clamp(1.65rem,4.8vw,3.75rem)] font-heading font-semibold text-white tracking-[0.08em] leading-tight text-balance">
            <span className="text-gold-gradient block">{BRAND.tagline}</span>
          </h1>

          <p className="text-[#A89F8D] font-sans text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Elevating Pakistani architectural standards through visionary masterplans, LDA-approved
            commercial towers, and bespoke residential sanctuaries across Gulberg, DHA, and Lake City.
          </p>
        </motion.div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md mx-auto"
        >
          <button
            type="button"
            onClick={() => scrollTo('properties')}
            className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-lg hover:shadow-[0_0_25px_rgba(230,195,106,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center cursor-pointer"
          >
            Explore Properties
          </button>

          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-[#F3EBDD] bg-[#0B0B0C] border border-[#E6C36A]/40 hover:border-[#E6C36A] hover:bg-[#151517] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#E6C36A] group-hover:scale-110 transition-transform" />
            <span>Inquire on WhatsApp</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#A89F8D]"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E6C36A]" />
            <span>LDA & DHA Vetted Registry</span>
          </div>
          <span className="text-[#8A6A2B] hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6C36A]" />
            <span>Private Concierge & Site Visits</span>
          </div>
        </motion.div>
      </div>

      {/* Signature Stats Bar */}
      <div className="relative max-w-6xl mx-auto w-full mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#8A6A2B]/20 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {BRAND.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-heading font-semibold text-lg sm:text-2xl lg:text-3xl text-gold-gradient tracking-wide tabular-nums">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-[#A89F8D] uppercase tracking-wider font-sans mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => scrollTo('experience')}
          aria-label="Scroll to experience"
          className="text-[#A89F8D]/60 hover:text-[#E6C36A] transition-colors p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
