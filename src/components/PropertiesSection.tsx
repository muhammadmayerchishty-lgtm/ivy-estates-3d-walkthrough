import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROPERTIES, PropertyItem, PropertyType, PropertyPurpose } from '../data/properties';
import { BRAND } from '../data/brand';
import { SafeImage } from './SafeImage';
import { RevealOnScroll } from './RevealOnScroll';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  MessageCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Check,
  Calendar,
  Eye,
  RotateCcw,
  Bot,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface PropertyCardProps {
  property: PropertyItem;
  isFav: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
  onSelect: (prop: PropertyItem) => void;
  onBookVisit: (prop: PropertyItem) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFav,
  onToggleFav,
  onSelect,
  onBookVisit,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // max 6 degrees tilt
    const rX = Math.max(-6, Math.min(6, ((y - centerY) / centerY) * -6));
    const rY = Math.max(-6, Math.min(6, ((x - centerX) / centerX) * 6));
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const getWhatsAppPropertyUrl = (prop: PropertyItem) => {
    const text = encodeURIComponent(
      `Hello ${BRAND.name}, I am interested in "${prop.title}" in ${prop.area} (Sample Price: ${prop.price}). Please share further particulars.`
    );
    return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="perspective-1000 h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="bg-[#0B0B0C] border border-[#8A6A2B]/20 rounded-2xl overflow-hidden hover:border-[#E6C36A]/50 transition-colors duration-300 flex flex-col justify-between h-full group hover:shadow-[0_15px_35px_rgba(230,195,106,0.08)]"
      >
        {/* Cover Image & Badges */}
        <div className="relative aspect-video w-full overflow-hidden bg-black select-none">
          <SafeImage
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/40 pointer-events-none" />

          {/* Top Row: Type, Purpose, Heart Favorite */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-sm border border-[#E6C36A]/30 text-[#E6C36A] font-semibold">
                {property.type}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[#F3EBDD]">
                For {property.purpose}
              </span>
            </div>

            {/* Favorite Heart Button with localStorage (>=44px touch target) */}
            <button
              type="button"
              onClick={(e) => onToggleFav(property.id, e)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/80 backdrop-blur-sm border border-white/10 hover:border-[#E6C36A] transition-colors cursor-pointer group/fav"
              aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'}
              title={isFav ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isFav
                    ? 'fill-[#E6C36A] text-[#E6C36A] scale-110'
                    : 'text-white group-hover/fav:text-[#E6C36A]'
                }`}
              />
            </button>
          </div>

          {/* Sample Tag & Possession Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#8A6A2B]/80 text-white font-mono font-medium">
              Sample
            </span>
            {property.badge && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/80 text-[#F3EBDD] border border-white/10">
                {property.badge}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-heading font-semibold text-[#F3EBDD] tracking-[0.05em] group-hover:text-[#E6C36A] transition-colors">
                {property.title}
              </h3>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-[#A89F8D] font-sans mb-4">
              <MapPin className="w-3.5 h-3.5 text-[#E6C36A] shrink-0" />
              <span>{property.area}</span>
            </p>

            {/* Valuation & Dimension Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-black/50 border border-[#1f1e1b] mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">
                  Price ({property.priceLabel})
                </span>
                <span className="text-sm font-semibold text-gold-gradient block mt-0.5">
                  {property.price}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">
                  Size
                </span>
                <span className="text-sm font-semibold text-[#F3EBDD] block mt-0.5">
                  {property.size}
                </span>
              </div>
            </div>

            {/* Bed & Bath counts if residential */}
            {(property.bedrooms || property.bathrooms) && (
              <div className="flex items-center gap-4 text-xs text-[#A89F8D] pb-3 border-b border-[#1f1e1b] mb-3">
                {property.bedrooms && (
                  <span className="flex items-center gap-1.5 text-[#F3EBDD]">
                    <Bed className="w-4 h-4 text-[#E6C36A]" />
                    <span>{property.bedrooms} Beds</span>
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center gap-1.5 text-[#F3EBDD]">
                    <Bath className="w-4 h-4 text-[#E6C36A]" />
                    <span>{property.bathrooms} Baths</span>
                  </span>
                )}
                <span className="ml-auto text-[10px] uppercase tracking-wider text-[#A89F8D]">
                  {property.possession}
                </span>
              </div>
            )}

            <p className="text-xs text-[#A89F8D] font-sans line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Action Row: View Details & WhatsApp (>=44px touch targets) */}
          <div className="pt-5 border-t border-[#1f1e1b] flex items-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => onSelect(property)}
              className="flex-1 py-3 px-3.5 min-h-[44px] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#F3EBDD] bg-[#141310] border border-[#8A6A2B]/30 hover:border-[#E6C36A] hover:bg-[#1a1916] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#E6C36A]" />
              <span>View Details</span>
            </button>

            <a
              href={getWhatsAppPropertyUrl(property)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inquire about ${property.title} on WhatsApp`}
              className="p-3 min-h-[44px] min-w-[44px] rounded-lg bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] text-black hover:opacity-95 transition-opacity flex items-center justify-center shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-black stroke-none" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PropertiesSection: React.FC = () => {
  // Filter States
  const [purposeFilter, setPurposeFilter] = useState<'All' | 'Buy' | 'Rent'>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sizeFilter, setSizeFilter] = useState<string>('All');
  const [budgetFilter, setBudgetFilter] = useState<string>('All');

  // Favorites state with localStorage try/catch
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ivy_favorites') || '[]');
    } catch {
      return [];
    }
  });

  // Modal State
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [ivyAssistantOpen, setIvyAssistantOpen] = useState(false);
  const [visitModalProperty, setVisitModalProperty] = useState<PropertyItem | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('ivy_favorites', JSON.stringify(next));
      } catch {
        // safe fallback
      }
      return next;
    });
  };

  // Keyboard navigation for detail gallery (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!selectedProperty) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActivePhotoIdx((prev) => (prev + 1) % selectedProperty.images.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(
          (prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length
        );
      } else if (e.key === 'Escape') {
        setSelectedProperty(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProperty]);

  // Reset active photo index when selected property changes
  useEffect(() => {
    setActivePhotoIdx(0);
    setIvyAssistantOpen(false);
  }, [selectedProperty]);

  // Unique options for dropdowns
  const areas = useMemo(
    () => ['All', ...Array.from(new Set(PROPERTIES.map((p) => p.areaKey)))],
    []
  );
  const types = useMemo(
    () => ['All', ...Array.from(new Set(PROPERTIES.map((p) => p.type)))],
    []
  );
  const sizes = useMemo(
    () => ['All', ...Array.from(new Set(PROPERTIES.map((p) => p.sizeCategory)))],
    []
  );

  // Live Filtering Logic
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((item) => {
      // Purpose
      if (purposeFilter !== 'All' && item.purpose !== purposeFilter) return false;
      // Area
      if (areaFilter !== 'All' && item.areaKey !== areaFilter) return false;
      // Type
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      // Size
      if (sizeFilter !== 'All' && item.sizeCategory !== sizeFilter) return false;
      // Budget
      if (budgetFilter === 'under1cr' && item.priceNumeric >= 10000000) return false;
      if (
        budgetFilter === '1to5cr' &&
        (item.priceNumeric < 10000000 || item.priceNumeric > 50000000)
      )
        return false;
      if (
        budgetFilter === '5to10cr' &&
        (item.priceNumeric < 50000000 || item.priceNumeric > 100000000)
      )
        return false;
      if (budgetFilter === '10crPlus' && item.priceNumeric < 100000000) return false;

      return true;
    });
  }, [purposeFilter, areaFilter, typeFilter, sizeFilter, budgetFilter]);

  const hasActiveFilters =
    purposeFilter !== 'All' ||
    areaFilter !== 'All' ||
    typeFilter !== 'All' ||
    sizeFilter !== 'All' ||
    budgetFilter !== 'All';

  const resetFilters = () => {
    setPurposeFilter('All');
    setAreaFilter('All');
    setTypeFilter('All');
    setSizeFilter('All');
    setBudgetFilter('All');
  };

  // Similar properties for Detail Modal
  const similarProperties = useMemo(() => {
    if (!selectedProperty) return [];
    return PROPERTIES.filter(
      (p) =>
        p.id !== selectedProperty.id &&
        (p.type === selectedProperty.type || p.purpose === selectedProperty.purpose)
    ).slice(0, 3);
  }, [selectedProperty]);

  const getWhatsAppDetailUrl = (prop: PropertyItem) => {
    const text = encodeURIComponent(
      `Hello ${BRAND.name}, I am reviewing the architectural dossier for "${prop.title}" (${prop.area}, Sample: ${prop.price}). I would like to schedule a private briefing.`
    );
    return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
  };

  return (
    <section id="properties" className="py-20 sm:py-24 bg-black relative border-t border-[#8A6A2B]/15 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header with RevealOnScroll */}
        <RevealOnScroll direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E6C36A] font-sans flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E6C36A]" />
                <span>Investment Portfolio</span>
              </span>
              <h2 className="mt-2 text-[clamp(1.65rem,3.5vw,2.75rem)] font-heading font-semibold text-[#F3EBDD] tracking-[0.08em] leading-tight text-balance">
                Prime Lahore Properties
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#A89F8D] font-sans max-w-xl">
                Filter through verified masterplans, luxury villas, and high-yielding commercial assets across Lahore's prime growth corridors.
              </p>
            </div>

            {/* Purpose Tabs (Buy / Rent / All) */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#0B0B0C] border border-[#8A6A2B]/25 rounded-full self-start md:self-auto flex-wrap">
              {(['All', 'Buy', 'Rent'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPurposeFilter(tab)}
                  className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    purposeFilter === tab
                      ? 'bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] text-black font-semibold shadow-sm'
                      : 'text-[#A89F8D] hover:text-[#F3EBDD]'
                  }`}
                >
                  {tab === 'All' ? 'All Listings' : `For ${tab}`}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Live Filter Bar */}
        <div className="bg-[#0B0B0C] border border-[#8A6A2B]/25 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Area Filter */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A89F8D] mb-1 font-mono">
                Area
              </label>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs focus:outline-none focus:border-[#E6C36A] transition-colors"
              >
                <option value="All">All Lahore Areas</option>
                {areas
                  .filter((a) => a !== 'All')
                  .map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A89F8D] mb-1 font-mono">
                Asset Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs focus:outline-none focus:border-[#E6C36A] transition-colors"
              >
                <option value="All">All Types</option>
                {types
                  .filter((t) => t !== 'All')
                  .map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A89F8D] mb-1 font-mono">
                Size
              </label>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs focus:outline-none focus:border-[#E6C36A] transition-colors"
              >
                <option value="All">All Dimensions</option>
                {sizes
                  .filter((s) => s !== 'All')
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A89F8D] mb-1 font-mono">
                Budget Bracket
              </label>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs focus:outline-none focus:border-[#E6C36A] transition-colors"
              >
                <option value="All">All Budgets</option>
                <option value="under1cr">Under 1 Crore</option>
                <option value="1to5cr">PKR 1 – 5 Crore</option>
                <option value="5to10cr">PKR 5 – 10 Crore</option>
                <option value="10crPlus">PKR 10 Crore+</option>
              </select>
            </div>

            {/* Live Count & Reset */}
            <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-end justify-between lg:justify-end gap-2 pt-1 lg:pt-0">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3.5 py-2 min-h-[44px] rounded-lg border border-[#8A6A2B]/30 text-[11px] text-[#E6C36A] hover:border-[#E6C36A] hover:bg-black/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}

              <span className="text-xs text-[#A89F8D] font-mono px-3 py-2 min-h-[44px] flex items-center bg-black/60 rounded-lg border border-white/5 whitespace-nowrap">
                <strong className="text-gold-gradient font-bold mr-1">{filteredProperties.length}</strong> of{' '}
                <span className="ml-1">{PROPERTIES.length} Listings</span>
              </span>
            </div>
          </div>
        </div>

        {/* Animated Properties Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFav={favorites.includes(property.id)}
                  onToggleFav={toggleFavorite}
                  onSelect={(p) => setSelectedProperty(p)}
                  onBookVisit={(p) => setVisitModalProperty(p)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 text-center bg-[#0B0B0C] border border-[#8A6A2B]/20 rounded-2xl p-8"
              >
                <Sparkles className="w-8 h-8 text-[#E6C36A]/50 mx-auto mb-3" />
                <h3 className="text-lg font-heading text-[#F3EBDD]">No Properties Match Criteria</h3>
                <p className="text-xs text-[#A89F8D] mt-1 mb-4">
                  Try adjusting your area or budget filter parameters to explore available developments.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] flex items-center justify-center mx-auto cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* DETAIL MODAL WITH GALLERY & SIMILAR PROPERTIES */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0B0B0C] border border-[#8A6A2B]/40 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
            >
              {/* Sticky Close Button (>=44px touch target) */}
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 z-30 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/80 border border-white/20 text-[#A89F8D] hover:text-[#F3EBDD] hover:border-[#E6C36A] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Gallery Header with Thumbnails & Arrow Key Support */}
              <div className="relative bg-black p-4 sm:p-6 border-b border-[#1f1e1b]">
                {/* Active Photo Container */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black select-none">
                  <SafeImage
                    src={selectedProperty.images[activePhotoIdx] || selectedProperty.images[0]}
                    alt={`${selectedProperty.title} photo ${activePhotoIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  {/* Left & Right Arrow Buttons (>=44px touch targets) */}
                  {selectedProperty.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePhotoIdx(
                            (prev) =>
                              (prev - 1 + selectedProperty.images.length) %
                              selectedProperty.images.length
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/75 border border-white/20 text-white hover:text-[#E6C36A] transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="Previous photo (Arrow Left)"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActivePhotoIdx((prev) => (prev + 1) % selectedProperty.images.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/75 border border-white/20 text-white hover:text-[#E6C36A] transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="Next photo (Arrow Right)"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Keyboard hint badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] text-[#A89F8D] font-mono hidden sm:block">
                    Use ← → arrow keys to navigate gallery
                  </div>
                </div>

                {/* Thumbnails Row */}
                {selectedProperty.images.length > 1 && (
                  <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                    {selectedProperty.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePhotoIdx(i)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activePhotoIdx === i
                            ? 'border-[#E6C36A] scale-105 shadow-[0_0_10px_rgba(230,195,106,0.3)]'
                            : 'border-white/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <SafeImage src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Body & Specs */}
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                {/* Title & Valuation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1e1b]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black border border-[#E6C36A]/40 text-[#E6C36A] font-semibold">
                        {selectedProperty.type}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#F3EBDD]">
                        For {selectedProperty.purpose}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#8A6A2B]/70 text-white font-mono">
                        Sample
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#F3EBDD]">
                      {selectedProperty.title}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-[#A89F8D] mt-1 font-sans">
                      <MapPin className="w-4 h-4 text-[#E6C36A] shrink-0" />
                      <span>{selectedProperty.area}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">
                      Asking Valuation ({selectedProperty.priceLabel})
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gold-gradient font-sans">
                      {selectedProperty.price}
                    </span>
                  </div>
                </div>

                {/* Specs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-black border border-[#1f1e1b]">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">Dimension</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-0.5 block">{selectedProperty.size}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-[#1f1e1b]">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">Bedrooms</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-0.5 block">{selectedProperty.bedrooms ?? 'N/A (Plot/Comm)'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-[#1f1e1b]">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">Bathrooms</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-0.5 block">{selectedProperty.bathrooms ?? 'N/A (Plot/Comm)'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-[#1f1e1b]">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89F8D] block">Possession</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#E6C36A] mt-0.5 block">{selectedProperty.possession}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-heading font-semibold text-[#F3EBDD] mb-2">
                    Architectural Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A89F8D] font-sans leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>

                {/* Sample Amenities List */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-heading font-semibold text-[#E6C36A] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#E6C36A]" />
                    <span>Sample Amenities & Infrastructure</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedProperty.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-black/60 border border-[#1f1e1b] text-xs text-[#F3EBDD]">
                        <Check className="w-3.5 h-3.5 text-[#E6C36A] shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs: Book a Visit, WhatsApp, Ask Ivy */}
                <div className="pt-4 border-t border-[#1f1e1b] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="#contact"
                      onClick={() => setSelectedProperty(null)}
                      className="py-3 px-4 min-h-[44px] rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book a Visit</span>
                    </a>

                    <a
                      href={getWhatsAppDetailUrl(selectedProperty)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 min-h-[44px] rounded-xl text-xs font-semibold uppercase tracking-wider text-[#F3EBDD] bg-[#141310] border border-[#8A6A2B]/40 hover:border-[#E6C36A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#E6C36A]" />
                      <span>WhatsApp Dossier</span>
                    </a>

                    {/* Ask Ivy Concierge Button */}
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent('open-ivy-voice', {
                            detail: { propertyTitle: selectedProperty.title },
                          })
                        );
                        setSelectedProperty(null);
                      }}
                      className="py-3 px-4 min-h-[44px] rounded-xl text-xs font-semibold uppercase tracking-wider text-[#E6C36A] bg-black border border-[#E6C36A]/40 hover:border-[#E6C36A] hover:bg-[#E6C36A]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Ask Ivy About Property</span>
                    </button>
                  </div>
                </div>

                {/* Similar Properties Row */}
                {similarProperties.length > 0 && (
                  <div className="pt-6 border-t border-[#1f1e1b]">
                    <h4 className="text-xs uppercase tracking-widest font-heading font-semibold text-[#F3EBDD] mb-4">
                      Similar Portfolio Properties
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {similarProperties.map((sim) => (
                        <div
                          key={sim.id}
                          onClick={() => {
                            setSelectedProperty(sim);
                            setActivePhotoIdx(0);
                          }}
                          className="bg-black border border-[#1f1e1b] rounded-xl p-3 hover:border-[#E6C36A]/50 transition-colors cursor-pointer group/sim"
                        >
                          <div className="aspect-video w-full rounded-lg overflow-hidden mb-2">
                            <SafeImage src={sim.images[0]} alt={sim.title} className="w-full h-full object-cover group-hover/sim:scale-105 transition-transform" />
                          </div>
                          <h5 className="text-xs font-heading font-semibold text-[#F3EBDD] truncate group-hover/sim:text-[#E6C36A]">
                            {sim.title}
                          </h5>
                          <span className="text-[11px] font-semibold text-gold-gradient block mt-0.5">
                            {sim.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
