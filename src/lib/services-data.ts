export type ServiceKey = 'webDev' | 'branding' | 'ai' | 'marketing';

export const SERVICE_KEYS: ServiceKey[] = ['webDev', 'branding', 'ai', 'marketing'];

// Icon choice per service, referenced by name in services-section.tsx
// (kept out of this file so it stays framework-agnostic / translation-only).
export const SERVICE_ICON_NAMES: Record<ServiceKey, string> = {
  webDev: 'Code2',
  branding: 'Palette',
  ai: 'Sparkles',
  marketing: 'TrendingUp',
};
