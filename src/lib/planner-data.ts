export type BusinessType =
  | 'restaurant'
  | 'lawFirm'
  | 'photographer'
  | 'medical'
  | 'startup'
  | 'ecommerce';

export type PageTier = 'small' | 'medium' | 'large' | 'xlarge';

export type FeatureKey = 'booking' | 'payments' | 'multiLanguage' | 'customBranding';

export type Timeline = 'standard' | 'rush';

export const BUSINESS_TYPES: { key: BusinessType; basePrice: number }[] = [
  { key: 'restaurant', basePrice: 1400 },
  { key: 'lawFirm', basePrice: 1600 },
  { key: 'photographer', basePrice: 1100 },
  { key: 'medical', basePrice: 1800 },
  { key: 'startup', basePrice: 2000 },
  { key: 'ecommerce', basePrice: 2400 },
];

export const PAGE_TIERS: { key: PageTier; label: string; multiplier: number; weeks: number }[] = [
  { key: 'small', label: '1-3', multiplier: 1, weeks: 2 },
  { key: 'medium', label: '4-7', multiplier: 1.35, weeks: 3 },
  { key: 'large', label: '8-15', multiplier: 1.8, weeks: 4 },
  { key: 'xlarge', label: '15+', multiplier: 2.4, weeks: 6 },
];

export const FEATURES: { key: FeatureKey; price: number; weeks: number }[] = [
  { key: 'booking', price: 450, weeks: 1 },
  { key: 'payments', price: 650, weeks: 1 },
  { key: 'multiLanguage', price: 350, weeks: 1 },
  { key: 'customBranding', price: 500, weeks: 1 },
];

export type PlannerSelection = {
  businessType: BusinessType | null;
  pageTier: PageTier | null;
  features: FeatureKey[];
  timeline: Timeline;
};

export type PlannerResult = {
  totalPrice: number;
  totalWeeks: number;
  packageTier: 'starter' | 'growth' | 'premiumGrowth';
};

export function computePlan(selection: PlannerSelection): PlannerResult | null {
  const { businessType, pageTier, features, timeline } = selection;
  if (!businessType || !pageTier) return null;

  const business = BUSINESS_TYPES.find((b) => b.key === businessType)!;
  const pages = PAGE_TIERS.find((p) => p.key === pageTier)!;

  const featurePrice = features.reduce((sum, key) => {
    const feature = FEATURES.find((f) => f.key === key);
    return sum + (feature?.price ?? 0);
  }, 0);

  const featureWeeks = features.reduce((sum, key) => {
    const feature = FEATURES.find((f) => f.key === key);
    return sum + (feature?.weeks ?? 0);
  }, 0);

  let total = business.basePrice * pages.multiplier + featurePrice;
  let weeks = pages.weeks + featureWeeks;

  if (timeline === 'rush') {
    total *= 1.2;
    weeks = Math.max(1, Math.ceil(weeks * 0.7));
  }

  total = Math.round(total / 50) * 50;

  const packageTier: PlannerResult['packageTier'] =
    total < 1800 ? 'starter' : total < 3200 ? 'growth' : 'premiumGrowth';

  return { totalPrice: total, totalWeeks: weeks, packageTier };
}
