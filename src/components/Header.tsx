import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { BRAND } from '../data/brand';

interface HeaderProps {
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-[#E6C36A]/20 py-3 shadow-2xl'
            : 'bg-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo - small, height 48px, keeps aspect ratio */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E6C36A]"
            aria-label={`${BRAND.name} Home`}
          >
            <div className="bg-black rounded p-0.5 flex items-center justify-center">
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-heading font-medium tracking-[0.14em] text-[#F3EBDD]/85">
            {BRAND.navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative py-1 transition-colors duration-200 hover:text-[#E6C36A] ${
                    isActive ? 'text-[#E6C36A]' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop WhatsApp Action */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-sm hover:shadow-[0_0_20px_rgba(230,195,106,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black stroke-none" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat"
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] text-black hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 fill-black stroke-none" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] text-[#F3EBDD] hover:text-[#E6C36A] transition-colors focus:outline-none flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`absolute top-0 right-0 bottom-0 w-full max-w-xs bg-[#0B0B0C] border-l border-[#E6C36A]/20 flex flex-col justify-between p-6 shadow-2xl transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  className="h-10 w-auto object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 min-h-[44px] min-w-[44px] text-[#A89F8D] hover:text-[#F3EBDD] focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mt-8">
              {BRAND.navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="px-3 py-3 min-h-[44px] text-sm font-heading tracking-[0.14em] text-[#F3EBDD] hover:text-[#E6C36A] hover:bg-black/50 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#A89F8D]" />
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Bottom Info & WhatsApp CTA */}
          <div className="pt-6 border-t border-[#222] flex flex-col gap-4">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 min-h-[44px] rounded-full text-center text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-black stroke-none" />
              <span>Direct WhatsApp Inquiry</span>
            </a>

            <div className="text-xs text-[#A89F8D] space-y-1 text-center font-sans">
              <p className="flex items-center justify-center gap-1.5 text-[#F3EBDD]">
                <Phone className="w-3.5 h-3.5 text-[#E6C36A]" />
                <a href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}>{BRAND.phone}</a>
              </p>
              <p>{BRAND.address}</p>
              <p className="text-[11px] text-[#A89F8D]/80">{BRAND.hours}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
