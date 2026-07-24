export type SuccessStory = {
  id: string;
  categoryKey: string; // e.g. "hospitality" -- translated, not a proper name
  metricValue: string;
  metricLabelKey: string;
};

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-hospitality',
    categoryKey: 'hospitality',
    metricValue: '+180%',
    metricLabelKey: 'organicTraffic',
  },
  {
    id: 'story-ecommerce',
    categoryKey: 'ecommerceAutomation',
    metricValue: '3x',
    metricLabelKey: 'fasterLoadSpeed',
  },
  {
    id: 'story-saas',
    categoryKey: 'saasRedesign',
    metricValue: '100%',
    metricLabelKey: 'automatedLeadWorkflow',
  },
];
