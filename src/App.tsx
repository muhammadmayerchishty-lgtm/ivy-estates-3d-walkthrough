/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CinematicExperience } from './components/CinematicExperience';
import { WhyIvy } from './components/WhyIvy';
import { PropertiesSection } from './components/PropertiesSection';
import { PlotsSection } from './components/PlotsSection';
import { ContactSection } from './components/ContactSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { VoiceConcierge } from './components/VoiceConcierge';
import { BRAND } from './data/brand';
import { MessageCircle } from 'lucide-react';

function MainWebsite() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'experience', 'why-ivy', 'properties', 'plots', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-[#F3EBDD] min-h-screen relative selection:bg-[#E6C36A]/20 selection:text-[#E6C36A] overflow-x-hidden w-full">
      {/* Initial cinematic loading screen */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <Header activeSection={activeSection} />

      <main className="w-full overflow-x-hidden">
        <Hero />
        {/* Pinned Three.js Cinematic Scroll Experience with 7 Scenes */}
        <CinematicExperience />
        {/* Why IVY Glass Cards & Count-Up Strip */}
        <WhyIvy />
        {/* Properties with Live Filters & 3D Tilt Cards */}
        <PropertiesSection />
        {/* Plots with Interactive SVG Site Plan (36 plots, 3 blocks, payment plan) */}
        <PlotsSection />
        {/* Book a Visit Form, Contact Info & Stylised SVG Map */}
        <ContactSection />
      </main>

      <Footer />

      {/* Vapi AI Voice Concierge "Ivy" (Floating Orb & Glass Panel with Live/Demo Modes) */}
      <VoiceConcierge />

      {/* Floating WhatsApp Action Pill with Tooltip & Pulse */}
      <aside aria-label="Contact actions" className="fixed bottom-6 right-6 z-30">
        <a
          href={BRAND.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 min-h-[44px] rounded-full bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] text-black font-semibold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(230,195,106,0.35)] hover:shadow-[0_6px_25px_rgba(230,195,106,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageCircle className="w-4 h-4 fill-black stroke-none group-hover:rotate-12 transition-transform" />
          <span className="font-sans font-bold">WhatsApp</span>
        </a>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="*" element={<MainWebsite />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
