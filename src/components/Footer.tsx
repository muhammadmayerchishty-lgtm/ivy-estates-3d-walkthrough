import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowUp } from 'lucide-react';
import { BRAND } from '../data/brand';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-[#8A6A2B]/20 text-[#A89F8D] font-sans pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#1b1a17]">
          {/* Brand & Logo column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-black p-1 rounded inline-block">
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  className="h-16 w-auto object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A89F8D] max-w-sm leading-relaxed">
              {BRAND.tagline}. Leading the standard for luxury real estate and masterplanned
              developments across Lahore, Pakistan.
            </p>

            <div className="pt-2">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-sm hover:opacity-95 transition-opacity"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-black stroke-none" />
                <span>WhatsApp: {BRAND.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Nav links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-[0.16em] text-[#F3EBDD]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {BRAND.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#E6C36A] transition-colors flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-[0.16em] text-[#F3EBDD]">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <p className="flex items-start gap-2.5 text-[#F3EBDD]">
                <Phone className="w-3.5 h-3.5 text-[#E6C36A] shrink-0 mt-0.5" />
                <a href={`tel:${BRAND.phone.replace(/\s+/g, '')}`} className="hover:text-[#E6C36A]">
                  {BRAND.phone}
                </a>
              </p>
              <p className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#E6C36A] shrink-0 mt-0.5" />
                <span className="break-all">{BRAND.email}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C36A] shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-[#E6C36A] shrink-0 mt-0.5" />
                <span>{BRAND.hours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar with required Demo Concept note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-[#A89F8D]">
          <div className="space-y-1">
            <p className="text-gold-gradient font-medium">
              {BRAND.demoCredit}
            </p>
            <p className="text-[#A89F8D]/80">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved. Lahore, Pakistan.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-2.5 rounded-full bg-[#0B0B0C] border border-[#8A6A2B]/30 hover:border-[#E6C36A] text-[#F3EBDD] transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
