import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOWNSHIP_PLOTS, PlotData, PlotStatus } from '../data/plots';
import { BRAND } from '../data/brand';
import { RevealOnScroll } from './RevealOnScroll';
import {
  MapPin,
  Calendar,
  MessageCircle,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Info,
  Maximize2,
} from 'lucide-react';

export const PlotsSection: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(TOWNSHIP_PLOTS[0]);
  const [hoveredPlot, setHoveredPlot] = useState<PlotData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [filterBlock, setFilterBlock] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredPlots = TOWNSHIP_PLOTS.filter((plot) => {
    if (filterBlock !== 'All' && plot.block !== filterBlock) return false;
    if (filterStatus !== 'All' && plot.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: PlotStatus, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return '#E6C36A'; // Bright Gold
    if (status === 'Available') return isHovered ? '#f7dca3' : '#b89442';
    if (status === 'Reserved') return isHovered ? '#fb923c' : '#c2410c';
    return isHovered ? '#4b5563' : '#262626'; // Sold (Charcoal/Dark slate)
  };

  const getStatusBadge = (status: PlotStatus) => {
    if (status === 'Available') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Available
        </span>
      );
    }
    if (status === 'Reserved') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
          Reserved
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700">
        Sold Out
      </span>
    );
  };

  const calculatePaymentPlan = (priceNumeric: number) => {
    const downPayment = Math.round(priceNumeric * 0.2);
    const confirmation = Math.round(priceNumeric * 0.1);
    const quarterly = Math.round((priceNumeric * 0.6) / 8);
    const possession = Math.round(priceNumeric * 0.1);

    const formatPKR = (val: number) => {
      if (val >= 10000000) return `PKR ${(val / 10000000).toFixed(2)} Crore`;
      return `PKR ${(val / 100000).toFixed(2)} Lakh`;
    };

    return [
      { milestone: 'Down Payment (20%)', amount: formatPKR(downPayment), schedule: 'At Booking' },
      { milestone: 'Allocation Confirmation (10%)', amount: formatPKR(confirmation), schedule: 'Within 30 Days' },
      { milestone: '8 Quarterly Installments (60%)', amount: `${formatPKR(quarterly)} / qtr`, schedule: 'Over 2 Years' },
      { milestone: 'On Possession & Registry (10%)', amount: formatPKR(possession), schedule: 'Upon Handover' },
    ];
  };

  const getWhatsAppPlotUrl = (plot: PlotData) => {
    const text = encodeURIComponent(
      `Hello ${BRAND.name}, I am inquiring regarding availability, registry and site visit for Plot ${plot.plotNumber} in ${plot.block} (${plot.size}, Sample: ${plot.priceSample}).`
    );
    return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
  };

  return (
    <section id="plots" className="py-20 sm:py-24 bg-[#0B0B0C] relative border-t border-[#8A6A2B]/15 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header with RevealOnScroll */}
        <RevealOnScroll direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E6C36A] font-sans flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#E6C36A]" />
                <span>Masterplanned Land Inventory</span>
              </span>
              <h2 className="mt-2 text-[clamp(1.65rem,3.5vw,2.75rem)] font-heading font-semibold text-[#F3EBDD] tracking-[0.08em] leading-tight text-balance">
                Township Interactive Site Plan
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#A89F8D] font-sans max-w-xl">
                Explore 36 executive plots across Blocks A, B, and C. Click any parcel to inspect dimensions, sample pricing, and installment schedules.
              </p>
            </div>

            {/* Block Filters (>=44px touch targets) */}
            <div className="flex items-center gap-1.5 p-1.5 bg-black border border-[#8A6A2B]/25 rounded-full flex-wrap self-start md:self-auto">
              {['All', 'Block A', 'Block B', 'Block C'].map((block) => (
                <button
                  key={block}
                  type="button"
                  onClick={() => setFilterBlock(block)}
                  className={`px-3.5 py-2 min-h-[44px] rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    filterBlock === block
                      ? 'bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] text-black font-semibold shadow-sm'
                      : 'text-[#A89F8D] hover:text-[#F3EBDD]'
                  }`}
                >
                  {block === 'All' ? 'All Blocks' : block}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Legend & Stats Banner */}
        <div className="bg-black/60 border border-[#8A6A2B]/20 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Status Legend */}
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#A89F8D]">
              Legend:
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#b89442] border border-[#E6C36A]" />
              <span className="text-[#F3EBDD]">Available ({TOWNSHIP_PLOTS.filter((p) => p.status === 'Available').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#c2410c] border border-amber-500" />
              <span className="text-[#F3EBDD]">Reserved ({TOWNSHIP_PLOTS.filter((p) => p.status === 'Reserved').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#262626] border border-neutral-700" />
              <span className="text-[#A89F8D]">Sold Out ({TOWNSHIP_PLOTS.filter((p) => p.status === 'Sold').length})</span>
            </div>
          </div>

          <div className="text-[#A89F8D] text-[11px] font-mono hidden md:block">
            Tip: Hover for instant preview · Click plot to open dossier
          </div>
        </div>

        {/* Masterplan Layout: SVG Map (Left/Center) + Side Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SVG Site Plan Container */}
          <div className="lg:col-span-8 bg-black border border-[#8A6A2B]/30 rounded-2xl p-4 sm:p-6 overflow-hidden relative shadow-2xl">
            {/* SVG Canvas */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[360px] overflow-x-auto">
              <svg
                viewBox="0 0 880 500"
                className="w-full h-full select-none"
                style={{ minWidth: '700px' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="siteGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(138, 106, 43, 0.08)" strokeWidth="0.5" />
                  </pattern>
                  {/* Tree icon pattern */}
                  <radialGradient id="parkGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.25)" />
                    <stop offset="100%" stopColor="rgba(20, 83, 45, 0.05)" />
                  </radialGradient>
                </defs>

                {/* Background Grid */}
                <rect width="880" height="500" fill="#000000" />
                <rect width="880" height="500" fill="url(#siteGrid)" />

                {/* BOULEVARDS & ARTERIAL ROADS */}
                {/* Main 80ft Boulevard */}
                <rect x="0" y="260" width="880" height="40" fill="#141416" stroke="rgba(230, 195, 106, 0.25)" strokeWidth="1" />
                <line x1="0" y1="280" x2="880" y2="280" stroke="#E6C36A" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
                <text x="440" y="284" fill="#A89F8D" fontSize="10" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.2em" opacity="0.8">
                  MAIN 80 FT CARPETED BOULEVARD
                </text>

                {/* North-South Central Spine */}
                <rect x="470" y="0" width="40" height="500" fill="#141416" stroke="rgba(230, 195, 106, 0.25)" strokeWidth="1" />
                <line x1="490" y1="0" x2="490" y2="500" stroke="#E6C36A" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />

                {/* Central Civic Green Park */}
                <rect x="520" y="270" width="330" height="200" rx="16" fill="url(#parkGlow)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1.5" />
                <text x="685" y="360" fill="#4ade80" fontSize="13" fontFamily="Cinzel, serif" textAnchor="middle" letterSpacing="0.1em" fontWeight="bold">
                  CENTRAL CIVIC PARK & LAKE
                </text>
                <text x="685" y="380" fill="#86efac" fontSize="9" fontFamily="sans-serif" textAnchor="middle" opacity="0.8">
                  Jogging Track · Children's Playland · Botanical Flora
                </text>

                {/* BLOCK A LABEL & BOUNDARY */}
                <rect x="35" y="45" width="415" height="205" rx="12" fill="none" stroke="rgba(138, 106, 43, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="50" y="62" fill="#E6C36A" fontSize="12" fontFamily="Cinzel, serif" fontWeight="600" letterSpacing="0.1em">
                  BLOCK A · EXECUTIVE BOULEVARD
                </text>

                {/* BLOCK B LABEL & BOUNDARY */}
                <rect x="520" y="45" width="330" height="205" rx="12" fill="none" stroke="rgba(138, 106, 43, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="530" y="62" fill="#E6C36A" fontSize="12" fontFamily="Cinzel, serif" fontWeight="600" letterSpacing="0.1em">
                  BLOCK B · PARK RESIDENCES
                </text>

                {/* BLOCK C LABEL & BOUNDARY */}
                <rect x="35" y="295" width="415" height="190" rx="12" fill="none" stroke="rgba(138, 106, 43, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="50" y="312" fill="#E6C36A" fontSize="12" fontFamily="Cinzel, serif" fontWeight="600" letterSpacing="0.1em">
                  BLOCK C · GARDEN ENCLAVE
                </text>

                {/* PLOTS RENDERING */}
                {TOWNSHIP_PLOTS.map((plot) => {
                  const isSelected = selectedPlot?.id === plot.id;
                  const isHovered = hoveredPlot?.id === plot.id;
                  const fillColor = getStatusColor(plot.status, isHovered, isSelected);
                  const isDimmed = filterBlock !== 'All' && plot.block !== filterBlock;

                  return (
                    <g
                      key={plot.id}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => setSelectedPlot(plot)}
                      onMouseEnter={() => setHoveredPlot(plot)}
                      onMouseLeave={() => setHoveredPlot(null)}
                      opacity={isDimmed ? 0.25 : 1}
                    >
                      {/* Plot Rect */}
                      <rect
                        x={plot.x}
                        y={plot.y}
                        width={plot.width}
                        height={plot.height}
                        rx="4"
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.95 : plot.status === 'Available' ? 0.45 : 0.6}
                        stroke={isSelected ? '#ffffff' : isHovered ? '#E6C36A' : 'rgba(230, 195, 106, 0.3)'}
                        strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 1}
                      />

                      {/* Plot Number */}
                      <text
                        x={plot.x + plot.width / 2}
                        y={plot.y + plot.height / 2 - 2}
                        fill={isSelected ? '#000000' : '#ffffff'}
                        fontSize="10"
                        fontFamily="Cinzel, serif"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                      >
                        {plot.plotNumber}
                      </text>

                      {/* Plot Size */}
                      <text
                        x={plot.x + plot.width / 2}
                        y={plot.y + plot.height / 2 + 10}
                        fill={isSelected ? '#111111' : '#E6C36A'}
                        fontSize="8"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                      >
                        {plot.size}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip */}
              {hoveredPlot && (
                <div
                  className="absolute pointer-events-none z-30 px-3 py-2 rounded-lg bg-black/90 backdrop-blur-md border border-[#E6C36A]/50 text-white shadow-2xl text-xs space-y-0.5"
                  style={{
                    left: `${Math.min(tooltipPos.x + 15, 680)}px`,
                    top: `${Math.max(10, tooltipPos.y - 70)}px`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading font-bold text-[#E6C36A]">
                      Plot {hoveredPlot.plotNumber}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#A89F8D]">
                      {hoveredPlot.block}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#F3EBDD]">
                    {hoveredPlot.size} ({hoveredPlot.dimensions})
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-gold-gradient font-semibold">
                      {hoveredPlot.priceSample} (Sample)
                    </span>
                    <span className={hoveredPlot.status === 'Available' ? 'text-emerald-400' : hoveredPlot.status === 'Reserved' ? 'text-amber-400' : 'text-neutral-400'}>
                      {hoveredPlot.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#A89F8D] font-mono">
              <span>Township Masterplan Revision 2026</span>
              <span>Total Parcels: 36 Verified</span>
            </div>
          </div>

          {/* SIDE CARD: Selected Plot Dossier & Sample Payment Plan */}
          <div className="lg:col-span-4">
            {selectedPlot ? (
              <div className="bg-black border border-[#8A6A2B]/35 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-[#1f1e1b]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#E6C36A] font-mono block">
                      {selectedPlot.block}
                    </span>
                    <h3 className="text-xl font-heading font-semibold text-[#F3EBDD] mt-0.5">
                      Plot {selectedPlot.plotNumber}
                    </h3>
                    <p className="text-xs text-[#A89F8D] mt-1">{selectedPlot.facing}</p>
                  </div>

                  <div>{getStatusBadge(selectedPlot.status)}</div>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0B0B0C] border border-[#1f1e1b]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">
                      Size & Area
                    </span>
                    <span className="text-sm font-semibold text-[#F3EBDD] block mt-0.5">
                      {selectedPlot.size}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">
                      Dimensions
                    </span>
                    <span className="text-sm font-semibold text-[#F3EBDD] block mt-0.5">
                      {selectedPlot.dimensions}
                    </span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-[#1a1917]">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">
                      Sample Total Price
                    </span>
                    <span className="text-lg font-bold text-gold-gradient block mt-0.5">
                      {selectedPlot.priceSample}{' '}
                      <span className="text-xs font-normal text-[#A89F8D]">(Sample)</span>
                    </span>
                  </div>
                </div>

                {/* Sample Payment Plan Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs uppercase tracking-wider font-heading font-semibold text-[#E6C36A]">
                      Sample Payment Plan
                    </h4>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#8A6A2B]/40 text-white font-mono">
                      Sample
                    </span>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-[#1f1e1b] bg-[#0B0B0C]">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#1f1e1b] bg-black/60 text-[10px] text-[#A89F8D] uppercase tracking-wider">
                          <th className="py-2 px-3">Milestone</th>
                          <th className="py-2 px-3">Amount (Sample)</th>
                          <th className="py-2 px-3">Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#181715] text-[11px]">
                        {calculatePaymentPlan(selectedPlot.priceNumeric).map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-3 text-[#F3EBDD]">{row.milestone}</td>
                            <td className="py-2 px-3 font-semibold text-gold-gradient whitespace-nowrap">
                              {row.amount}
                            </td>
                            <td className="py-2 px-3 text-[#A89F8D] whitespace-nowrap">
                              {row.schedule}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions (>=44px touch targets) */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href="#contact"
                    className="w-full py-3 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book a Site Visit</span>
                  </a>

                  <a
                    href={getWhatsAppPlotUrl(selectedPlot)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-[#F3EBDD] bg-[#141310] border border-[#8A6A2B]/40 hover:border-[#E6C36A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E6C36A]" />
                    <span>WhatsApp Plot Inquiry</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-black border border-[#8A6A2B]/20 rounded-2xl p-8 text-center text-[#A89F8D] space-y-3">
                <Info className="w-8 h-8 text-[#E6C36A] mx-auto" />
                <p className="text-xs">Click any plot on the site plan to inspect details and payment breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
