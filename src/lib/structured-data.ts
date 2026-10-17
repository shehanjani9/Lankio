import { siteConfig, activeSocialLinks } from '@/config/site';
import type { Locale } from '@/i18n/routing';
import type { PublishedProject } from '@/content/projects';
import { absoluteUrl, localizedUrl } from './seo';

// Structured data describes only verifiable facts: no ratings, reviews,
// prices, founding dates or client counts.

const PERSON_ID = `${siteConfig.url}/#person`;
const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function personSchema(locale: Locale, jobTitle: string, description: string) {
  const sameAs = activeSocialLinks().map((link) => link.url);
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: siteConfig.founder.name,
    givenName: siteConfig.founder.givenName,
    jobTitle,
    description,
    url: localizedUrl(locale, '/about'),
    image: absoluteUrl('/images/shehan.jpg'),
    worksFor: { '@id': ORGANIZATION_ID },
    address: { '@type': 'PostalAddress', addressCountry: siteConfig.location.countryCode },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'IATA Foundation Diploma',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: 'International Air Transport Association (IATA)' },
    },
    knowsAbout: [
      'Web design',
      'Web development',
      'UI/UX design',
      'Graphic design',
      'Brand identity',
      'Motion graphics',
      '2D animation',
      'Photography',
      'Videography',
      'Video editing',
      'Search engine optimization',
      'Social media marketing',
      'Digital marketing',
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function organizationSchema(description: string) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: absoluteUrl('/brand/icon-512.png'),
    email: siteConfig.email,
    description,
    founder: { '@id': PERSON_ID },
    address: { '@type': 'PostalAddress', addressCountry: siteConfig.location.countryCode },
  };
}

export function websiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: locale,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function projectSchema(project: PublishedProject, locale: Locale) {
  return {
    '@type': 'CreativeWork',
    '@id': `${localizedUrl(locale, `/work/${project.slug}`)}#work`,
    name: project.title,
    headline: project.title,
    description: project.summary[locale],
    url: localizedUrl(locale, `/work/${project.slug}`),
    inLanguage: locale,
    image: absoluteUrl(project.cover.src),
    creator: { '@id': PERSON_ID },
    publisher: { '@id': ORGANIZATION_ID },
    genre: project.discipline[locale],
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.technologies?.length ? { keywords: project.technologies.join(', ') } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}
