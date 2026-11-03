/**
 * Brand Configuration for IVY DEVELOPERS
 * Centralized so the pitch demo can be rebranded in 2 minutes.
 */

export interface PropertyListing {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Plot';
  location: string;
  size: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
  image?: string;
}

export const BRAND = {
  name: "IVY DEVELOPERS",
  shortName: "IVY",
  tagline: "Building a better tomorrow",
  phone: "0370 4921264",
  whatsapp: "923704921264",
  whatsappUrl: "https://wa.me/923704921264?text=Hi%2C%20I%20am%20interested%20in%20IVY%20DEVELOPERS%20projects.",
  email: "hello@ivydevelopers.example (demo)",
  address: "Lahore, Pakistan",
  hours: "Mon to Sat, 10 AM to 8 PM",
  logo: "/images/logo.png",
  demoCredit: "Demo concept by ORION IT SOLUTIONS. Sample listings and AI-generated visuals.",
  pitchClient: "IVY DEVELOPERS",
  pitchAgency: "ORION IT SOLUTIONS",
  year: "2026",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Properties", href: "#properties" },
    { label: "Plots", href: "#plots" },
    { label: "Contact", href: "#contact" },
  ],
  stats: [
    { value: "PKR 45B+", label: "Portfolio Delivered" },
    { value: "100%", label: "LDA Approved Masterplans" },
    { value: "1,200+", label: "Elite Investor Clients" },
    { value: "15+", label: "Years of Architectural Excellence" },
  ],
  sampleProperties: [
    {
      id: "ivy-heights-gulberg",
      title: "Ivy Heights & Sky Suites",
      category: "Commercial" as const,
      location: "Main Boulevard, Gulberg III, Lahore",
      size: "1,850 – 5,400 sq.ft.",
      price: "From PKR 4.8 Crore",
      description: "Iconic high-rise corporate towers with penthouses overlooking the Lahore Gymkhana grounds, featuring thermal bronze glazing and private elevator access.",
      features: ["Infinity Sky Deck", "Smart Climate Automation", "High-Speed Japanese Lifts", "Valet Concierge"],
      badge: "Signature Project",
      image: "/images/s3-villa.jpg",
    },
    {
      id: "ivy-palace-dha-phase-6",
      title: "The Grand Sanctuary",
      category: "Residential" as const,
      location: "Sector K, DHA Phase 6, Lahore",
      size: "2 Kanal Custom Villa",
      price: "PKR 21.5 Crore",
      description: "Bespoke contemporary estate featuring Italian marble, basement screening cinema, heated lap pool, and landscaped courtyard with cascading waterfalls.",
      features: ["German Kitchen Fittings", "Solar Inverter Array", "Smart Home OS", "Maid & Driver Quarters"],
      badge: "Ready for Possession",
      image: "/images/s7-pool.jpg",
    },
    {
      id: "ivy-residences-lake-city",
      title: "Ivy Meadow Estates",
      category: "Residential" as const,
      location: "Golf Estate, Lake City, Lahore",
      size: "1 Kanal Golf Vista",
      price: "PKR 9.8 Crore",
      description: "Serene golf-facing modern villas with panoramic floor-to-ceiling curtain walls, open-plan entertaining salons, and sustainable zero-carbon construction.",
      features: ["Golf Course Access", "Gated Security Tier 3", "Double Height Foyer", "Private Jacuzzi"],
      badge: "Limited Release",
      image: "/images/s1-aerial.jpg",
    },
  ],
  samplePlots: [
    {
      id: "plot-dha-phase-8",
      title: "Prime Corner Commercial Plot",
      category: "Plot" as const,
      location: "Commercial Broadway, DHA Phase 8, Lahore",
      size: "8 Marla Commercial",
      price: "PKR 8.2 Crore",
      description: "Direct frontage on the main boulevard with 7-storey building permission. Ideal for flagship corporate headquarters or luxury boutique retail.",
      features: ["Corner Facing", "150ft Boulevard Access", "Immediate Registry", "All Dues Cleared"],
      badge: "Commercial Hot Property",
      image: "/images/s2-gate.jpg",
    },
    {
      id: "plot-dha-phase-7",
      title: "Executive Residential Plot",
      category: "Plot" as const,
      location: "Sector U, DHA Phase 7, Lahore",
      size: "1 Kanal Residential",
      price: "PKR 3.9 Crore",
      description: "Elevated park-facing corner plot situated in a quiet cul-de-sac. Underground utilities, fiber optic network, and walking distance to central civic mosque.",
      features: ["Direct Park View", "Underground Electricity", "Immediate Possession", "Clear Soil Test"],
      badge: "Park Facing",
      image: "/images/s6-bedroom.jpg",
    },
    {
      id: "plot-gulberg-enterprise",
      title: "Zafar Ali Road Commercial Plot",
      category: "Plot" as const,
      location: "Zafar Ali Road, Gulberg V, Lahore",
      size: "2 Kanal Commercial",
      price: "PKR 42.0 Crore",
      description: "Ultra-rare prime Gulberg land parcel suited for high-density multi-use luxury hotel, branded residences, or multinational consulate office.",
      features: ["2 Kanal Frontage", "Multi-Storey Bylaws Approved", "Direct Main Arterial Access", "Clean Title"],
      badge: "Institutional Grade",
      image: "/images/s4-living.jpg",
    },
  ],
};
