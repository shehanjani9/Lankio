export type TemplateCategory =
  | 'ecommerce'
  | 'saas'
  | 'portfolio'
  | 'restaurantHotel'
  | 'healthcare'
  | 'realEstate'
  | 'education'
  | 'transportation'
  | 'fashion'
  | 'beauty'
  | 'construction'
  | 'tourism'
  | 'professionalServices'
  | 'healthFitness';

export type Template = {
  id: string;
  name: string;
  category: TemplateCategory;
  lighthouseScore: number;
  priceFrom: number;
  buildWeeks: number;
  // Path under /public -- e.g. /templates/ecommerce.jpg. Falls back to the
  // SVG mockup in template-mockup.tsx if the file is missing or fails to load.
  image: string;
  // Live, embeddable URL for the interactive preview modal. All of the
  // /demo/* routes below now exist as real pages under
  // src/app/(templates)/demo/<slug>/page.tsx.
  demoUrl: string;
  // Optional key into TemplateHub.templates.<translationKey> in messages/*.json
  // for a localized title/description/badges/features block. Templates
  // without one just fall back to `name` + the category label.
  translationKey?: string;
};

export const TEMPLATES: Template[] = [
  {
    id: 'ecom-01',
    name: 'Storeline',
    category: 'ecommerce',
    lighthouseScore: 94,
    priceFrom: 2600,
    buildWeeks: 5,
    image: '/templates/ecommerce.jpg',
    demoUrl: '/demo/ecommerce',
  },
  {
    id: 'saas-01',
    name: 'Nimbus',
    category: 'saas',
    lighthouseScore: 96,
    priceFrom: 2400,
    buildWeeks: 4,
    image: '/templates/saas.jpg',
    demoUrl: '/demo/saas',
  },
  {
    id: 'port-01',
    name: 'Aperture',
    category: 'portfolio',
    lighthouseScore: 98,
    priceFrom: 1200,
    buildWeeks: 2,
    image: '/templates/portfolio.jpg',
    demoUrl: '/demo/portfolio',
  },
  {
    id: 'hotel-01',
    name: 'Tavola',
    category: 'restaurantHotel',
    lighthouseScore: 92,
    priceFrom: 1800,
    buildWeeks: 3,
    image: '/templates/hotel.jpg',
    demoUrl: '/demo/hotel',
  },
  {
    id: 'med-01',
    name: 'HealthPulse',
    category: 'healthcare',
    lighthouseScore: 95,
    priceFrom: 2800,
    buildWeeks: 5,
    image: '/templates/medical.jpg',
    demoUrl: '/demo/medical',
  },
  {
    id: 'estate-01',
    name: 'Horizon',
    category: 'realEstate',
    lighthouseScore: 93,
    priceFrom: 3200,
    buildWeeks: 5,
    image: '/templates/realestate.jpg',
    demoUrl: '/demo/realestate',
  },
  {
    id: 'rest-02',
    name: 'Black Truffle',
    category: 'restaurantHotel',
    lighthouseScore: 94,
    priceFrom: 2000,
    buildWeeks: 3,
    image: '/templates/restaurant.jpg',
    demoUrl: '/demo/restaurant',
  },
  {
    id: 'edu-01',
    name: 'EduStream',
    category: 'education',
    lighthouseScore: 97,
    priceFrom: 2600,
    buildWeeks: 4,
    image: '/templates/education.jpg',
    demoUrl: '/demo/education',
  },
  // --- New: Italian small-business templates ---
  {
    id: 'ncc-01',
    name: 'Autoblu',
    category: 'transportation',
    lighthouseScore: 95,
    priceFrom: 1900,
    buildWeeks: 3,
    image: '/templates/ncc.jpg',
    demoUrl: '/demo/ncc',
    translationKey: 'ncc',
  },
  {
    id: 'fashion-01',
    name: 'Atelier',
    category: 'fashion',
    lighthouseScore: 93,
    priceFrom: 2200,
    buildWeeks: 4,
    image: '/templates/fashion.jpg',
    demoUrl: '/demo/fashion',
    translationKey: 'fashion',
  },
  {
    id: 'pizzeria-01',
    name: 'Forno',
    category: 'restaurantHotel',
    lighthouseScore: 96,
    priceFrom: 1600,
    buildWeeks: 2,
    image: '/templates/pizzeria.jpg',
    demoUrl: '/demo/pizzeria',
    translationKey: 'pizzeria',
  },
  {
    id: 'beauty-01',
    name: 'Lumen',
    category: 'beauty',
    lighthouseScore: 95,
    priceFrom: 1800,
    buildWeeks: 3,
    image: '/templates/beauty.jpg',
    demoUrl: '/demo/beauty',
    translationKey: 'beauty',
  },
  {
    id: 'edilizia-01',
    name: 'Fondamenta',
    category: 'construction',
    lighthouseScore: 94,
    priceFrom: 2000,
    buildWeeks: 3,
    image: '/templates/edilizia.jpg',
    demoUrl: '/demo/edilizia',
    translationKey: 'edilizia',
  },
  // --- New: high-demand global & Italian sector templates ---
  {
    id: 'tourism-01',
    name: 'Terra & Mare',
    category: 'tourism',
    lighthouseScore: 94,
    priceFrom: 3400,
    buildWeeks: 5,
    image: '/templates/tourism.jpg',
    demoUrl: '/demo/tourism',
    translationKey: 'tourism',
  },
  {
    id: 'legal-01',
    name: 'Bellini & Associati',
    category: 'professionalServices',
    lighthouseScore: 96,
    priceFrom: 2400,
    buildWeeks: 4,
    image: '/templates/legal.jpg',
    demoUrl: '/demo/legal',
    translationKey: 'legal',
  },
  {
    id: 'fitness-01',
    name: 'Forza',
    category: 'healthFitness',
    lighthouseScore: 95,
    priceFrom: 2100,
    buildWeeks: 3,
    image: '/templates/fitness.jpg',
    demoUrl: '/demo/fitness',
    translationKey: 'fitness',
  },
];

export const CATEGORIES: { key: TemplateCategory | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'all' },
  { key: 'ecommerce', labelKey: 'ecommerce' },
  { key: 'saas', labelKey: 'saas' },
  { key: 'portfolio', labelKey: 'portfolio' },
  { key: 'restaurantHotel', labelKey: 'restaurantHotel' },
  { key: 'healthcare', labelKey: 'healthcare' },
  { key: 'realEstate', labelKey: 'realEstate' },
  { key: 'education', labelKey: 'education' },
  { key: 'transportation', labelKey: 'transportation' },
  { key: 'fashion', labelKey: 'fashion' },
  { key: 'beauty', labelKey: 'beauty' },
  { key: 'construction', labelKey: 'construction' },
  { key: 'tourism', labelKey: 'tourism' },
  { key: 'professionalServices', labelKey: 'professionalServices' },
  { key: 'healthFitness', labelKey: 'healthFitness' },
];
