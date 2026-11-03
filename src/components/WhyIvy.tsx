import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ShieldCheck, CreditCard, Headphones, Sparkles } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const WhyIvy: React.FC = () => {
  const cards = [
    {
      icon: MapPin,
      title: 'Prime Locations',
      tagline: 'High-Velocity Corridors',
      description:
        'Strategic positioning in Lahore’s premier growth epicenters—DHA Phase 7 & 8, Main Boulevard Gulberg, and Lake City—guaranteeing elite tenancy and enduring appreciation.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Dealing',
      tagline: '100% Legal Certainty',
      description:
        'Every square foot backed by verified LDA masterplan sanctions, clear mutation registries, zero litigation, and institutional due diligence before marketing.',
    },
    {
      icon: CreditCard,
      title: 'Flexible Plans',
      tagline: 'Tailored Capital Schedules',
      description:
        'Bespoke 24-to-36-month construction-linked milestone schedules, balloon payment options, and investor liquidity structures aligned with cash flow.',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      tagline: 'Private Client Concierge',
      description:
        'A dedicated relationship officer, bespoke architectural customization engineers, real-time site video feeds, and white-glove handover protocols.',
    },
  ];

  const stats = [
    { number: 'PKR 45B+', label: 'Delivered Portfolio', sub: 'Sample Metric' },
    { number: '1,200+', label: 'Discerning Investors', sub: 'Sample Metric' },
    { number: '100%', label: 'Sanctioned LDA Clearances', sub: 'Sample Metric' },
    { number: '15+ Years', label: 'Architectural Excellence', sub: 'Sample Metric' },
  ];

  return (
    <section id="why-ivy" className="py-20 sm:py-24 bg-black relative border-t border-[#8A6A2B]/15 overflow-hidden w-full">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-full h-[400px] pointer-events-none opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #8A6A2B 0%, #E6C36A 30%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header with Reveal-on-scroll */}
        <RevealOnScroll direction="up" className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E6C36A] font-sans flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E6C36A]" />
            <span>The Competitive Edge</span>
          </span>
          <h2 className="mt-3 text-[clamp(1.65rem,3.5vw,2.75rem)] font-heading font-semibold text-[#F3EBDD] tracking-[0.08em] leading-tight text-balance">
            Why Discerning Investors <span className="text-gold-gradient">Choose IVY</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-[#A89F8D] font-sans leading-relaxed px-2">
            We bridge visionary architectural mastery with institutional transparency to build
            generational wealth in Pakistan’s real estate landscape.
          </p>
        </RevealOnScroll>

        {/* 4 Glass Cards Grid with Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-14 sm:mb-16">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <RevealOnScroll key={idx} delay={idx * 0.1} direction="up" className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#0B0B0C] border border-[#8A6A2B]/25 hover:border-[#E6C36A]/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 group hover:shadow-[0_12px_30px_rgba(230,195,106,0.1)] h-full"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-black border border-[#8A6A2B]/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#E6C36A] transition-all duration-300">
                      <IconComp className="w-6 h-6 text-[#E6C36A]" />
                    </div>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#E6C36A] block mb-1">
                      {card.tagline}
                    </span>

                    <h3 className="text-base sm:text-lg font-heading font-semibold text-[#F3EBDD] tracking-[0.05em] mb-2.5 group-hover:text-[#E6C36A] transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-xs text-[#A89F8D] font-sans leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Count-Up Strip with Sample Numbers Labelled "Sample" */}
        <RevealOnScroll direction="up" delay={0.2}>
          <div className="bg-[#0B0B0C] border border-[#8A6A2B]/30 rounded-2xl p-5 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#1f1e1b] text-center">
              {stats.map((stat, i) => (
                <div key={i} className={`pt-3 sm:pt-0 ${i > 0 ? 'sm:pl-6' : ''}`}>
                  <span className="text-xl sm:text-3xl lg:text-4xl font-heading font-bold text-gold-gradient block tabular-nums">
                    {stat.number}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F3EBDD] block mt-1">
                    {stat.label}
                  </span>
                  <span className="inline-block mt-1 text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#8A6A2B]/30 text-[#E6C36A] font-mono">
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
