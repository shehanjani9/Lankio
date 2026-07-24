export type BillingMode = 'oneTime' | 'monthly';

export type PricingTier = {
  key: 'starterDigital' | 'businessGrowth' | 'customEnterprise';
  oneTimePrice: number | null; // null => custom quote, no fixed number
  monthlyPrice: number | null;
  featureCount: number; // how many of the shared feature list this tier includes, in order
  popular: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    key: 'starterDigital',
    oneTimePrice: 1200,
    monthlyPrice: 150,
    featureCount: 4,
    popular: false,
  },
  {
    key: 'businessGrowth',
    oneTimePrice: 2800,
    monthlyPrice: 350,
    featureCount: 7,
    popular: true,
  },
  {
    key: 'customEnterprise',
    oneTimePrice: null,
    monthlyPrice: null,
    featureCount: 9,
    popular: false,
  },
];

// Cumulative feature ladder -- each tier includes everything up to its
// featureCount, so higher tiers visibly contain the lower tiers' features
// plus more, rather than three unrelated lists.
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
