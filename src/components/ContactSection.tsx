import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Send,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { BRAND } from '../data/brand';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: 'IVY Residence (10 Marla House)',
    preferredDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      errs.phone = 'Please provide a valid 10-11 digit contact number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const stored = JSON.parse(localStorage.getItem('ivy_visit_requests') || '[]');
      const newEntry = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };
      stored.push(newEntry);
      localStorage.setItem('ivy_visit_requests', JSON.stringify(stored));
    } catch {
      // Safe fallback if local storage restricted
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedData({ ...formData });
    }, 500);
  };

  const getWhatsAppForwardUrl = () => {
    if (!submittedData) return BRAND.whatsappUrl;
    const text = encodeURIComponent(
      `Hello ${BRAND.name}, I just scheduled a visit for "${submittedData.interest}". Name: ${submittedData.name}, Phone: ${submittedData.phone}, Preferred Date: ${submittedData.preferredDate || 'Flexible'}.`
    );
    return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
  };

  return (
    <section id="contact" className="py-24 bg-[#0B0B0C] relative border-t border-[#8A6A2B]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E6C36A] font-sans flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E6C36A]" />
            <span>Private Advisory & Site Coordination</span>
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-heading font-semibold text-[#F3EBDD] tracking-[0.08em]">
            Book a Visit & <span className="text-gold-gradient">Connect With Us</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-[#A89F8D] font-sans leading-relaxed">
            Schedule an accompanied inspection of our ongoing masterplans or connect directly with our
            investment partners in Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* BOOK A VISIT FORM (Left Column) */}
          <div className="lg:col-span-7 bg-black border border-[#8A6A2B]/35 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative">
            <div className="pb-4 border-b border-[#1f1e1b] mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E6C36A] block">
                Exclusive Protocol
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F3EBDD] mt-1">
                Book an On-Site Inspection
              </h3>
              <p className="text-xs text-[#A89F8D] mt-1">
                Chauffeured site visits available Monday to Saturday for vetted investors.
              </p>
            </div>

            {isSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E6C36A]/20 border border-[#E6C36A] text-[#E6C36A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h4 className="text-xl font-heading font-semibold text-[#F3EBDD]">
                  Visit Request Registered
                </h4>

                {/* EXACT REQUIRED TEXT */}
                <p className="text-xs text-[#E6C36A] font-mono tracking-wider bg-[#141310] py-2 px-4 rounded-full border border-[#8A6A2B]/40 inline-block">
                  Demo: request stored in this browser only
                </p>

                <p className="text-xs text-[#A89F8D] max-w-md mx-auto leading-relaxed pt-2">
                  Thank you, <strong className="text-white">{submittedData?.name}</strong>. Your preferred visit date for{' '}
                  <strong className="text-white">{submittedData?.interest}</strong> has been noted.
                </p>

                {/* "Also send on WhatsApp" button using brand.ts */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppForwardUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-black stroke-none" />
                    <span>Also Send on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        phone: '',
                        interest: 'IVY Residence (10 Marla House)',
                        preferredDate: '',
                        message: '',
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/20 text-xs text-[#F3EBDD] hover:border-[#E6C36A] transition-colors"
                  >
                    Submit Another Visit
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1.5 font-sans">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mian Shahzaib"
                      className={`w-full px-4 py-2.5 rounded-lg bg-[#0B0B0C] border text-white text-xs sm:text-sm focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-[#8A6A2B]/35 focus:border-[#E6C36A]'
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-400 mt-1 block">{errors.name}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1.5 font-sans">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0370 4921264"
                      className={`w-full px-4 py-2.5 rounded-lg bg-[#0B0B0C] border text-white text-xs sm:text-sm focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-[#8A6A2B]/35 focus:border-[#E6C36A]'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-400 mt-1 block">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Interest */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1.5 font-sans">
                      Property of Interest
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/35 text-white text-xs sm:text-sm focus:outline-none focus:border-[#E6C36A]"
                    >
                      <option value="IVY Residence (10 Marla House)">IVY Residence (10 Marla House)</option>
                      <option value="IVY Villas (1 Kanal Luxury Villa)">IVY Villas (1 Kanal Villa)</option>
                      <option value="IVY Heights (Gulberg Penthouse)">IVY Heights (Gulberg Apt)</option>
                      <option value="IVY Commercial Plaza (Johar Town)">IVY Commercial Plaza</option>
                      <option value="IVY Gardens (5 Marla Gated Plot)">IVY Gardens (5 Marla Plot)</option>
                      <option value="IVY Signature Estate (2 Kanal Plot)">IVY Signature Estate (2 Kanal)</option>
                      <option value="Township Masterplan (Block A/B/C)">Township Masterplan Plots</option>
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1.5 font-sans">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/35 text-white text-xs sm:text-sm focus:outline-none focus:border-[#E6C36A]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1.5 font-sans">
                    Special Requests / Itinerary Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Requesting floorplan elevation and possession verification..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/35 text-white text-xs sm:text-sm focus:outline-none focus:border-[#E6C36A]"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-lg hover:shadow-[0_0_20px_rgba(230,195,106,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Schedule...' : 'Schedule Confidential Viewing'}</span>
                </button>
              </form>
            )}
          </div>

          {/* CONTACT DETAILS & STYLISED SVG MAP (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black border border-[#8A6A2B]/35 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
              <h3 className="text-lg font-heading font-semibold text-[#F3EBDD] pb-3 border-b border-[#1f1e1b]">
                Executive Headquarters
              </h3>

              <div className="space-y-4 text-xs font-sans">
                {/* Phone Tap-to-call */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#E6C36A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block">
                      Telephone (Tap to Call)
                    </span>
                    <a
                      href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                      className="text-sm font-semibold text-[#F3EBDD] hover:text-[#E6C36A] transition-colors"
                    >
                      {BRAND.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/30 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#E6C36A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block">
                      WhatsApp Liaison
                    </span>
                    <a
                      href={BRAND.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold-gradient hover:underline"
                    >
                      +{BRAND.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#E6C36A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block">
                      Corporate Dispatch
                    </span>
                    <span className="text-xs text-[#F3EBDD] break-all">{BRAND.email}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#E6C36A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block">
                      Metropolitan Address
                    </span>
                    <span className="text-xs text-[#F3EBDD]">{BRAND.address}</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0B0B0C] border border-[#8A6A2B]/30 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#E6C36A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block">
                      Operating Hours
                    </span>
                    <span className="text-xs text-[#F3EBDD]">{BRAND.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STYLISED SVG MAP BLOCK */}
            <div className="bg-black border border-[#8A6A2B]/35 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#E6C36A] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#E6C36A]" />
                  <span>Lahore Metropolitan Grid</span>
                </span>
                <span className="text-[10px] text-[#A89F8D] font-mono">Punjab, Pakistan</span>
              </div>

              {/* Vector Map Graphic */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#1f1e1b] bg-[#0c0c0e]">
                <svg viewBox="0 0 400 250" className="w-full h-full">
                  <defs>
                    <radialGradient id="hqPulse" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#E6C36A" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8A6A2B" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Dark Grid Lines */}
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#1f1e1b" strokeWidth="0.8" />
                  <line x1="0" y1="125" x2="400" y2="125" stroke="#1f1e1b" strokeWidth="0.8" />
                  <line x1="0" y1="200" x2="400" y2="200" stroke="#1f1e1b" strokeWidth="0.8" />
                  <line x1="100" y1="0" x2="100" y2="250" stroke="#1f1e1b" strokeWidth="0.8" />
                  <line x1="250" y1="0" x2="250" y2="250" stroke="#1f1e1b" strokeWidth="0.8" />

                  {/* Lahore Ring Road (Loop) */}
                  <path
                    d="M 60 40 C 200 10, 360 40, 360 160 C 360 230, 220 240, 100 210 C 30 180, 20 80, 60 40 Z"
                    fill="none"
                    stroke="#8A6A2B"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    opacity="0.5"
                  />
                  <text x="310" y="90" fill="#A89F8D" fontSize="8" fontFamily="sans-serif">
                    Lahore Ring Road (L-20)
                  </text>

                  {/* Main Boulevard Gulberg (Arterial line) */}
                  <line x1="90" y1="30" x2="260" y2="170" stroke="#E6C36A" strokeWidth="2" opacity="0.7" />
                  <text x="180" y="105" fill="#E6C36A" fontSize="8" fontFamily="sans-serif" transform="rotate(38 180 105)">
                    Main Blvd Gulberg
                  </text>

                  {/* Ferozepur Road */}
                  <line x1="50" y1="230" x2="320" y2="30" stroke="#444" strokeWidth="1.5" />
                  <text x="70" y="210" fill="#A89F8D" fontSize="8" fontFamily="sans-serif">
                    Ferozepur Rd
                  </text>

                  {/* DHA Phase 6/7/8 Boulevard */}
                  <line x1="220" y1="180" x2="380" y2="210" stroke="#E6C36A" strokeWidth="2" opacity="0.6" />
                  <text x="270" y="215" fill="#E6C36A" fontSize="8" fontFamily="sans-serif">
                    DHA Phase 6 / 8 Broadway
                  </text>

                  {/* Landmark nodes */}
                  <circle cx="160" cy="95" r="4" fill="#E6C36A" />
                  <text x="140" y="85" fill="#F3EBDD" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                    Gulberg III
                  </text>

                  <circle cx="310" cy="190" r="4" fill="#E6C36A" />
                  <text x="290" y="180" fill="#F3EBDD" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                    DHA Phase 7/8
                  </text>

                  <circle cx="85" cy="160" r="4" fill="#A89F8D" />
                  <text x="50" y="150" fill="#A89F8D" fontSize="8" fontFamily="sans-serif">
                    Johar Town
                  </text>

                  {/* IVY HQ Pin with Pulsing Glow */}
                  <circle cx="215" cy="135" r="14" fill="url(#hqPulse)" />
                  <circle cx="215" cy="135" r="5" fill="#E6C36A" stroke="#000" strokeWidth="1.5" />
                  <rect x="180" y="148" width="70" height="18" rx="4" fill="#000" stroke="#E6C36A" strokeWidth="1" />
                  <text x="215" y="160" fill="#E6C36A" fontSize="8" fontFamily="Cinzel, serif" fontWeight="bold" textAnchor="middle">
                    IVY DEVELOPERS
                  </text>
                </svg>
              </div>

              {/* "Get Directions" link to Google Maps search for "Lahore, Pakistan" */}
              <div className="mt-4 pt-3 border-t border-[#1f1e1b] flex items-center justify-between">
                <span className="text-[11px] text-[#A89F8D]">Direct navigation link</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Lahore%2C+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5 fill-black stroke-none" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
