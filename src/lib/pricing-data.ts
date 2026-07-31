export type BillingMode = 'oneTime' | 'monthly';
export type PricingCategory = 'web' | 'content';

export interface PricingTier {
  key: string;
  oneTimePrice: number | null;
  monthlyPrice: number | null;
  popular?: boolean;
  featureCount: number;
}

export interface PricingAddon {
  key: string;
  price: number;
  type: 'oneTime' | 'monthly';
}

export interface ContentPackage {
  key: string;
  startingPrice: number;
  priceUnit: 'perVideo' | 'perMonth' | 'perProject';
  popular?: boolean;
  deliverablesKey: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    key: 'starterDigital',
    oneTimePrice: 490,
    monthlyPrice: 49,
    featureCount: 4,
  },
  {
    key: 'standardProfessional',
    oneTimePrice: 890,
    monthlyPrice: 89,
    popular: true,
    featureCount: 6,
  },
  {
    key: 'businessGrowth',
    oneTimePrice: 1490,
    monthlyPrice: 149,
    featureCount: 8,
  },
  {
    key: 'customEnterprise',
    oneTimePrice: null,
    monthlyPrice: null,
    featureCount: 9,
  },
];

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

export const PRICING_ADDONS: PricingAddon[] = [
  { key: 'extraPage', price: 90, type: 'oneTime' },
  { key: 'extraLanguage', price: 150, type: 'oneTime' },
  { key: 'speedOptimization', price: 120, type: 'oneTime' },
  { key: 'monthlyMaintenance', price: 49, type: 'monthly' },
];

export const CONTENT_PACKAGES: ContentPackage[] = [
  {
    key: 'socialShorts',
    startingPrice: 45,
    priceUnit: 'perVideo',
    deliverablesKey: ['shortsEditing', 'captionsSubtitles', 'soundDesign', 'fastTurnaround'],
  },
  {
    key: 'motionGraphics',
    startingPrice: 120,
    priceUnit: 'perVideo',
    deliverablesKey: ['logoAnimation', 'custom2d3dMotion', 'brandAssets', 'hdExport'],
  },
  {
    key: 'promoVideo',
    startingPrice: 350,
    priceUnit: 'perProject',
    popular: true,
    deliverablesKey: ['fullScriptAndConcept', 'cinematicColorGrading', 'voiceoverIntegration', 'multiFormatExport'],
  },
  {
    key: 'socialMonthlyBundle',
    startingPrice: 590,
    priceUnit: 'perMonth',
    deliverablesKey: ['eightReelsShorts', 'twoPromoVideos', 'contentCalendarStrategy', 'monthlyAnalyticsReport'],
  },
];