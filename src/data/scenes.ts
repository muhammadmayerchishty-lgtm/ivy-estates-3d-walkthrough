export interface SceneData {
  id: string;
  image: string;
  chapter: string;
  caption: string;
  alt: string;
}

export const SCENES: SceneData[] = [
  {
    id: 's1-aerial',
    image: '/images/s1-aerial.jpg',
    chapter: '01 / THE ESTATE',
    caption: 'A visionary gated masterplan embracing natural topography, emerald fairways, and private boulevards.',
    alt: 'Aerial view of gated luxury residential township in Lahore at golden hour',
  },
  {
    id: 's2-gate',
    image: '/images/s2-gate.jpg',
    chapter: '02 / THE ARRIVAL',
    caption: 'Monolithic carved stone gateway with cascading water features and around-the-clock biometric security.',
    alt: 'Grand township monumental entrance gate with cascading waterfalls at dusk',
  },
  {
    id: 's3-villa',
    image: '/images/s3-villa.jpg',
    chapter: '03 / THE RESIDENCE',
    caption: 'Sculptural contemporary architecture balancing expansive thermal glazing with textured stone finishes.',
    alt: 'Modern luxury architectural villa exterior at twilight with glowing warm interior lights',
  },
  {
    id: 's4-living',
    image: '/images/s4-living.jpg',
    chapter: '04 / LIVING',
    caption: 'Double-height reception salon with imported Calacatta marble and panoramic private garden vistas.',
    alt: 'Double-height luxury living room with marble flooring and floor-to-ceiling glass windows',
  },
  {
    id: 's5-kitchen',
    image: '/images/s5-kitchen.jpg',
    chapter: '05 / THE KITCHEN',
    caption: 'Culinary perfection centered around a solid black marble island and bespoke fluted dark oak cabinetry.',
    alt: 'Designer luxury kitchen with dark veined marble waterfall island and ambient lighting',
  },
  {
    id: 's6-bedroom',
    image: '/images/s6-bedroom.jpg',
    chapter: '06 / THE SUITE',
    caption: 'A serene master sanctuary with warm acoustic panelling, ambient sconces, and private courtyard access.',
    alt: 'Master bedroom suite at twilight overlooking a lush private courtyard garden',
  },
  {
    id: 's7-pool',
    image: '/images/s7-pool.jpg',
    chapter: '07 / THE TERRACE',
    caption: 'Heated infinity reflection pool and cantilevered timber deck beneath the twilight Lahore sky.',
    alt: 'Illuminated infinity pool terrace of luxury villa at night with lounge seating',
  },
];
