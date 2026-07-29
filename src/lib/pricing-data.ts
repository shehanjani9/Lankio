export type BillingMode = 'oneTime' | 'monthly';

export type PricingTier = {
  key: 'starterDigital' | 'standardProfessional' | 'businessGrowth' | 'customEnterprise';
  oneTimePrice: number | null;
  monthlyPrice: number | null;
  featureCount: number;
  popular: boolean;
};

export interface PricingAddon {
  key: string;
  price: number;
  type: 'oneTime' | 'monthly';
}

export const PRICING_TIERS: PricingTier[] = [
  {
    key: 'starterDigital',
    oneTimePrice: 390,
    monthlyPrice: 49,
    featureCount: 3,
    popular: false,
  },
  {
    key: 'standardProfessional',
    oneTimePrice: 790,
    monthlyPrice: 89,
    featureCount: 5,
    popular: true,
  },
  {
    key: 'businessGrowth',
    oneTimePrice: 1290,
    monthlyPrice: 149,
    featureCount: 7,
    popular: false,
  },
  {
    key: 'customEnterprise',
    oneTimePrice: null,
    monthlyPrice: null,
    featureCount: 9,
    popular: false,
  },
];

// Cumulative feature ladder
export const PRICING_FEATURE_KEYS = [
  'responsiveWebsite',
  'basicSeo',
  'contactForm',
  'oneRevisionRound',
  'cmsIntegration',
  'multiLanguage',
  'bookingOrPayments',
  'prioritySupport',
  'dedicatedStrategy',
];

// Extra Options / Add-ons for clients
export const PRICING_ADDONS: PricingAddon[] = [
  { key: 'extraPage', price: 49, type: 'oneTime' },
  { key: 'extraLanguage', price: 149, type: 'oneTime' },
  { key: 'speedOptimization', price: 89, type: 'oneTime' },
  { key: 'monthlyMaintenance', price: 39, type: 'monthly' },
];