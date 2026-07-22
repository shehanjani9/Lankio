export type TemplateCategory =
  | 'corporate'
  | 'ecommerce'
  | 'portfolio'
  | 'restaurant'
  | 'medical'
  | 'realEstate';

export type Template = {
  id: string;
  name: string;
  category: TemplateCategory;
  lighthouseScore: number;
  priceFrom: number;
  buildWeeks: number;
  accentHue: number; // used to generate a distinct placeholder gradient per card
};

export const TEMPLATES: Template[] = [
  {
    id: 'corp-01',
    name: 'Meridian',
    category: 'corporate',
    lighthouseScore: 97,
    priceFrom: 1800,
    buildWeeks: 3,
    accentHue: 250,
  },
  {
    id: 'ecom-01',
    name: 'Storeline',
    category: 'ecommerce',
    lighthouseScore: 94,
    priceFrom: 2600,
    buildWeeks: 5,
    accentHue: 15,
  },
  {
    id: 'port-01',
    name: 'Aperture',
    category: 'portfolio',
    lighthouseScore: 98,
    priceFrom: 1200,
    buildWeeks: 2,
    accentHue: 280,
  },
  {
    id: 'rest-01',
    name: 'Tavola',
    category: 'restaurant',
    lighthouseScore: 92,
    priceFrom: 1600,
    buildWeeks: 3,
    accentHue: 20,
  },
  {
    id: 'med-01',
    name: 'Clarus',
    category: 'medical',
    lighthouseScore: 96,
    priceFrom: 2200,
    buildWeeks: 4,
    accentHue: 200,
  },
  {
    id: 'real-01',
    name: 'Domaine',
    category: 'realEstate',
    lighthouseScore: 93,
    priceFrom: 2400,
    buildWeeks: 4,
    accentHue: 35,
  },
];

export const CATEGORIES: { key: TemplateCategory | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'all' },
  { key: 'corporate', labelKey: 'corporate' },
  { key: 'ecommerce', labelKey: 'ecommerce' },
  { key: 'portfolio', labelKey: 'portfolio' },
  { key: 'restaurant', labelKey: 'restaurant' },
  { key: 'medical', labelKey: 'medical' },
  { key: 'realEstate', labelKey: 'realEstate' },
];
