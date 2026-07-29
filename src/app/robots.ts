import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Hide private routes if any
    },
    sitemap: 'https://www.lankio.it/sitemap.xml',
  }
}