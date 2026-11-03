import React from 'react';
import { Compass, Award, ShieldAlert, Landmark, Building2, Trees, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../data/brand';

export const Experience: React.FC = () => {
  const pillars = [
    {
      icon: Landmark,
      title: 'Architectural Distinctiveness',
      desc: 'Merging monumental geometric silhouettes with climate-adapted materials, expansive double-height volumes, and artisanal stone finishes tailored for Lahore’s climate.',
    },
    {
      icon: ShieldAlert,
      title: 'Flawless Legal & LDA Compliance',
      desc: 'Every IVY masterplan undergoes stringent institutional due diligence, zero-encumbrance title vetting, and LDA/DHA approval before customer launch.',
    },
    {
      icon: Building2,
      title: 'Capital Appreciation & Yield',
      desc: 'Prime high-density commercial assets and private residences consistently positioned along Lahore’s most lucrative arterial corridors for optimum investor returns.',
    },
    {
      icon: Trees,
      title: 'Sustainable Living Environments',
      desc: 'Solar integration, high-performance insulated glazing, rainwater harvesting, and lush courtyards creating microclimates of pure tranquility.',
    },
  ];

  return (
    <section id="heritage" className="py-24 bg-[#0B0B0C] relative border-t border-[#8A6A2B]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E6C36A] font-sans">
            The IVY Standard
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-heading font-semibold text-[#F3EBDD] tracking-[0.08em]">
            Precision Engineering & <span className="text-gold-gradient">Timeless Heritage</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A89F8D] font-sans leading-relaxed">
            Crafting Lahore’s most distinguished residential landmarks and commercial epicenters,
            designed to endure for generations and enrich the urban fabric of Pakistan.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={i}
                className="bg-black/60 border border-[#8A6A2B]/20 rounded-xl p-6 sm:p-7 hover:border-[#E6C36A]/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#141310] border border-[#8A6A2B]/30 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#E6C36A] transition-all">
                    <IconComponent className="w-6 h-6 text-[#E6C36A]" />
                  </div>
                  <h3 className="text-base font-heading font-semibold text-[#F3EBDD] tracking-[0.06em] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A89F8D] font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lahore Strategic Locations Strip */}
        <div className="mt-16 bg-black border border-[#8A6A2B]/25 rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#E6C36A] font-sans font-semibold">
                Strategic Territories
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-white">
                Lahore’s High-Growth Corridors
              </h3>
              <p className="text-xs sm:text-sm text-[#A89F8D] font-sans leading-relaxed">
                Our portfolio spans Lahore’s most prestigious postcodes, commanding high rental yields and capital liquidity.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0B0C] border border-[#8A6A2B]/20">
                <span className="text-xs text-[#E6C36A] font-heading font-medium">Zone 01</span>
                <h4 className="text-base font-heading font-semibold text-[#F3EBDD] mt-1">Gulberg III</h4>
                <p className="text-xs text-[#A89F8D] mt-1">Main Boulevard corporate towers & luxury suites.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0C] border border-[#8A6A2B]/20">
                <span className="text-xs text-[#E6C36A] font-heading font-medium">Zone 02</span>
                <h4 className="text-base font-heading font-semibold text-[#F3EBDD] mt-1">DHA Phase 6 & 8</h4>
                <p className="text-xs text-[#A89F8D] mt-1">Prime commercial broadway & bespoke residential villas.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0C] border border-[#8A6A2B]/20">
                <span className="text-xs text-[#E6C36A] font-heading font-medium">Zone 03</span>
                <h4 className="text-base font-heading font-semibold text-[#F3EBDD] mt-1">Lake City Golf</h4>
                <p className="text-xs text-[#A89F8D] mt-1">Exclusive fairway-facing private custom estates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
