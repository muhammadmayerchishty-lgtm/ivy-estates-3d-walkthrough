export type PropertyType = 'House' | 'Villa' | 'Apartment' | 'Plot' | 'Commercial';
export type PropertyPurpose = 'Buy' | 'Rent';

export interface PropertyItem {
  id: string;
  title: string;
  area: string;
  areaKey: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  size: string;
  sizeCategory: string;
  bedrooms?: number;
  bathrooms?: number;
  price: string;
  priceNumeric: number; // in PKR for budget filtering
  priceLabel: string; // e.g. "Sample"
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  badge?: string;
  possession: string;
}

export const PROPERTIES: PropertyItem[] = [
  {
    id: 'ivy-residence-dha7',
    title: 'IVY Residence',
    area: 'DHA Phase 7, Lahore',
    areaKey: 'DHA Phase 7',
    type: 'House',
    purpose: 'Buy',
    size: '10 Marla',
    sizeCategory: '10 Marla',
    bedrooms: 4,
    bathrooms: 5,
    price: 'PKR 4.85 Crore',
    priceNumeric: 48500000,
    priceLabel: 'Sample',
    description: 'Contemporary multi-level residence with Italian marble foyer, floor-to-ceiling thermal glazing, custom walnut cabinetry, and private landscaped courtyard.',
    features: ['Imported Kitchen with Island', 'Smart Climate & Security Automation', 'Servant Quarters', '2-Car Covered Garage'],
    amenities: [
      'Italian Calacatta Marble',
      'Dual-Zone Inverter HVAC',
      'Solar Power Integration (10kW)',
      'Underground Fiber Optic',
      'German Sanitary Fittings',
      'Automated Irrigation Lawn',
    ],
    images: ['/images/p1-1.jpg', '/images/p1-2.jpg', '/images/s4-living.jpg'],
    badge: 'Ready for Possession',
    possession: 'Immediate',
  },
  {
    id: 'ivy-villas-bahria',
    title: 'IVY Villas',
    area: 'Bahria Town, Lahore',
    areaKey: 'Bahria Town',
    type: 'Villa',
    purpose: 'Buy',
    size: '1 Kanal',
    sizeCategory: '1 Kanal',
    bedrooms: 5,
    bathrooms: 6,
    price: 'PKR 8.75 Crore',
    priceNumeric: 87500000,
    priceLabel: 'Sample',
    description: 'Lavish contemporary architectural villa featuring double-height reception salons, heated private courtyard plunge pool, German sanitary fittings, and expansive master suite terrace.',
    features: ['Private Plunge Pool & Deck', 'Double-Height Foyer', 'Sub-Zero & Miele Fitted Appliances', 'Basement Home Cinema'],
    amenities: [
      'Heated Outdoor Plunge Pool',
      'Dolby Atmos 9-Seat Cinema',
      'Miele MasterChef Kitchen',
      'Basement Lounge & Bar',
      'Spanish Porcelain Facade',
      'Smart Fingerprint Access',
    ],
    images: ['/images/p2-1.jpg', '/images/p2-2.jpg', '/images/s7-pool.jpg'],
    badge: 'Luxury Villa',
    possession: 'Ready to Move',
  },
  {
    id: 'ivy-heights-gulberg',
    title: 'IVY Heights',
    area: 'Gulberg III, Lahore',
    areaKey: 'Gulberg III',
    type: 'Apartment',
    purpose: 'Rent',
    size: '2,650 sq.ft.',
    sizeCategory: 'Apartment',
    bedrooms: 3,
    bathrooms: 4,
    price: 'PKR 3.5 Lakh / month',
    priceNumeric: 350000, // Monthly rental
    priceLabel: 'Sample',
    description: 'Designer high-floor apartment overlooking the Lahore skyline and Gymkhana fairways. Fully serviced with valet, infinity rooftop pool, and 24/7 power backup.',
    features: ['Panoramic Skyline Views', 'Full Concierge & Valet', 'Rooftop Infinity Lounge', 'Executive Fitness Club'],
    amenities: [
      '24/7 Dedicated Valet Parking',
      'Rooftop Temperature Pool',
      'Biometric Elevator Access',
      '100% Uninterrupted Power Backup',
      'Resident Executive Lounge',
      'Floor-to-Ceiling Soundproof Glass',
    ],
    images: ['/images/p3-1.jpg', '/images/p3-2.jpg', '/images/s3-villa.jpg'],
    badge: 'Rental Trophy',
    possession: 'Immediate Occupancy',
  },
  {
    id: 'ivy-commercial-plaza',
    title: 'IVY Commercial Plaza',
    area: 'Johar Town, Lahore',
    areaKey: 'Johar Town',
    type: 'Commercial',
    purpose: 'Buy',
    size: '8,400 sq.ft.',
    sizeCategory: 'Commercial',
    price: 'PKR 14.5 Crore',
    priceNumeric: 145000000,
    priceLabel: 'Sample',
    description: 'Flagship corporate headquarters building featuring sleek gold and bronze aluminum mullions, grand double-height retail ground atrium, and high-speed OTIS glass elevators.',
    features: ['Ground Floor Retail Anchor', 'Corporate Grade A Offices', 'Multi-Level Dedicated Parking', '100% Redundant Generators'],
    amenities: [
      'Double-Height Glass Atrium',
      'High-Speed OTIS Glass Elevators',
      'Fire Suppression & Smoke Control',
      '200-Car Basement Parking',
      'Triple-Phase Industrial Power',
      'Broadband Fiber Backbone',
    ],
    images: ['/images/p4-1.jpg', '/images/p4-2.jpg', '/images/s5-kitchen.jpg'],
    badge: 'High Yield Commercial',
    possession: 'Possession Dec 2026',
  },
  {
    id: 'ivy-gardens-gated',
    title: 'IVY Gardens',
    area: 'Gated Township, Lahore',
    areaKey: 'Gated Township',
    type: 'Plot',
    purpose: 'Buy',
    size: '5 Marla Plot',
    sizeCategory: '5 Marla',
    price: 'PKR 48 Lakh',
    priceNumeric: 4800000,
    priceLabel: 'Sample',
    description: 'Demarcated residential plot in an exclusive masterplanned gated community with underground utilities, wide asphalt boulevards, family recreation parks, and 24/7 security gatehouses.',
    features: ['100% LDA Approved Masterplan', 'Underground Electrification', 'Immediate Demarcation', 'Flexible 18-Month Plan'],
    amenities: [
      'Gated Boundary Security',
      '60ft Main Carpeted Boulevard',
      'Central Community Mosque',
      'Children Playland & Green Park',
      'Direct Ring Road Access',
      'Underground Water Filtration',
    ],
    images: ['/images/p5-1.jpg', '/images/p5-2.jpg', '/images/s1-aerial.jpg'],
    badge: 'Hot Investment',
    possession: 'Immediate Balloting',
  },
  {
    id: 'ivy-signature-estate-dha8',
    title: 'IVY Signature Estate',
    area: 'DHA Phase 8, Lahore',
    areaKey: 'DHA Phase 8',
    type: 'Plot',
    purpose: 'Buy',
    size: '2 Kanal Plot',
    sizeCategory: '2 Kanal',
    price: 'PKR 9.8 Crore',
    priceNumeric: 98000000,
    priceLabel: 'Sample',
    description: 'Trophy 2 Kanal corner plot facing a grand civic central park in DHA Phase 8. Wide dual-carriageway access, clean title deed, and zero litigation for immediate custom villa construction.',
    features: ['Direct Park-Facing Corner', '120ft Main Avenue Frontage', 'Immediate Possession', 'High Capital Velocity'],
    amenities: [
      'Prime Corner Facing Civic Park',
      '120ft Dual Carriageway Frontage',
      'Underground Electrical Grid',
      'Direct DHA Clear Registry',
      'Zero Litigation Guarantee',
      'Soil Density Test Verified',
    ],
    images: ['/images/p6-1.jpg', '/images/p6-2.jpg', '/images/s2-gate.jpg'],
    badge: 'Trophy Parcel',
    possession: 'Immediate Possession',
  },
];
