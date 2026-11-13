import { FaqItem, Service, SiteSettings } from '../content/content.models';
import { toPlainText } from '../content/inline-markup';
import { hasPlaceholder } from '../content/placeholders';

/** Brief 5.3. Pure builders; `sanitizeJsonLd` drops any property still holding a placeholder. */
export type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

export function origin(site: SiteSettings): string {
  return `https://${site.domain}`;
}

export function absoluteUrl(site: SiteSettings, path: string): string {
  return path === '/' ? `${origin(site)}/` : `${origin(site)}${path.replace(/\/+$/, '')}`;
}

export function organizationGraph(site: SiteSettings): JsonLd {
  const base = origin(site);
  return {
    '@context': CONTEXT,
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#org`,
        name: site.company,
        url: `${base}/`,
        logo: `${base}/assets/brand/avesta-logo-512.png`,
        description:
          'Software quality, security and test automation company in Utrecht. Makers of Avesta Proof.',
        foundingDate: site.foundingDate,
        founder: { '@id': `${base}/about#founder` },
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressLocality: 'Utrecht',
          addressCountry: 'NL',
        },
        email: site.email,
        identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: site.kvk },
        vatID: site.btw,
        sameAs: [site.social.linkedin, site.social.github],
        knowsAbout: [
          'Software testing',
          'Test automation',
          'EU Cyber Resilience Act',
          'ISO/IEC 27001',
          'IEC 62443',
          'Software bill of materials',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: site.company,
        publisher: { '@id': `${base}/#org` },
        inLanguage: 'en',
      },
    ],
  };
}

export function person(site: SiteSettings): JsonLd {
  const base = origin(site);
  return {
    '@context': CONTEXT,
    '@type': 'Person',
    '@id': `${base}/about#founder`,
    name: 'Mohammad Ali Shikhi',
    jobTitle: 'Founder',
    worksFor: { '@id': `${base}/#org` },
    homeLocation: { '@type': 'Place', name: 'Utrecht, Netherlands' },
    image: hasPlaceholder(site.founderPhoto) ? site.founderPhoto : `${base}/assets/img/founder.jpg`,
    knowsLanguage: ['ar', 'ku', 'nl', 'en', 'tr'],
    knowsAbout: ['Test automation', 'Python', 'pytest', 'Robot Framework', 'Selenium', 'CI/CD'],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Professional Scrum Master I (PSM I)',
    },
    sameAs: [site.social.founderLinkedin],
  };
}

export function softwareApplication(site: SiteSettings): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'SoftwareApplication',
    name: 'Avesta Proof',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Linux, macOS, Windows (Python 3.11+)',
    softwareVersion: site.currentVersion,
    description:
      'Scans a repository, maps findings to ISO/IEC 27001, IEC 62443-4-1 and the EU Cyber Resilience Act, and produces a signed, tamper-evident report with a fix for every finding.',
    publisher: { '@id': `${origin(site)}/#org` },
    featureList: [
      'Per-control verdicts for three standards',
      'CISA KEV and EPSS prioritisation',
      'Ed25519-signed reports',
      'Hash-chained scan history',
      'CycloneDX SBOM',
      'CRA technical-file draft',
      'SARIF output',
      'Trust statement and badge',
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', name: 'Community' },
  };
}

export function service(site: SiteSettings, item: Service): JsonLd {
  const offers =
    item.price.amount === null
      ? undefined
      : { '@type': 'Offer', price: String(item.price.amount), priceCurrency: 'EUR' };
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    name: item.name,
    description: toPlainText(item.card),
    provider: { '@id': `${origin(site)}/#org` },
    areaServed: ['NL', 'EU'],
    url: absoluteUrl(site, item.seo.path),
    ...(offers ? { offers } : {}),
  };
}

export function faqPage(items: readonly FaqItem[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(item.answer) },
    })),
  };
}

export function breadcrumbList(
  site: SiteSettings,
  trail: readonly { name: string; path: string }[],
): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(site, crumb.path),
    })),
  };
}

/** Removes every property, array entry or object whose value is (or became) a placeholder. */
export function sanitizeJsonLd(value: unknown): unknown {
  if (typeof value === 'string') return hasPlaceholder(value) ? undefined : value;
  if (Array.isArray(value)) {
    const items = value.map(sanitizeJsonLd).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => [k, sanitizeJsonLd(v)] as const)
      .filter(([, v]) => v !== undefined);
    const meaningful = entries.filter(([k]) => k !== '@type' && k !== '@context');
    return meaningful.length ? Object.fromEntries(entries) : undefined;
  }
  return value;
}
