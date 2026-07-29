import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // baseUrl එක අගට slash (/) නොදා තබන්න
  const baseUrl = 'https://www.lankio.it'

  return [
    {
      url: `${baseUrl}/en`, // https://www.lankio.it/en ලෙස නිවැරදිව output වේ
      lastModified: new Date('2026-07-29T22:56:35.481Z'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/it`, // https://www.lankio.it/it ලෙස නිවැරදිව output වේ
      lastModified: new Date('2026-07-29T22:56:35.481Z'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]
}