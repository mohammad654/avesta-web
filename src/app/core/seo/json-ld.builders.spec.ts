import siteJson from '../../../content/site.json';
import { SiteContent, SiteSettings } from '../content/content.models';
import { absoluteUrl, breadcrumbList, faqPage, organizationGraph, person, sanitizeJsonLd, service, softwareApplication } from './json-ld.builders';

const placeholderSite = (siteJson as SiteContent).settings;
const filled: SiteSettings = {
  ...placeholderSite, domain: 'avesta.example', kvk: '12345678', btw: 'NL001', address: 'Street 1', email: 'hi@avesta.example',
  social: { linkedin: 'https://linkedin.example/a', github: 'https://github.example/a', founderLinkedin: 'https://linkedin.example/m' },
  currentVersion: '0.5.0', founderPhoto: '/assets/img/founder.jpg',
};

describe('JSON-LD builders (brief 5.3)', () => {
  it('builds absolute URLs without trailing slash except the root', () => {
    expect(absoluteUrl(filled, '/')).toBe('https://avesta.example/');
    expect(absoluteUrl(filled, '/product/')).toBe('https://avesta.example/product');
  });

  it('builds Organization and WebSite in one graph', () => {
    const graph = organizationGraph(filled)['@graph'] as Record<string, unknown>[];
    expect(graph.map((g) => g['@type'])).toEqual(['Organization', 'WebSite']);
    expect(graph[0]).toMatchObject({ '@id': 'https://avesta.example/#org', vatID: 'NL001', foundingDate: '2026-10' });
  });

  it('omits every property that is still a placeholder', () => {
    const json = JSON.stringify(sanitizeJsonLd(organizationGraph(placeholderSite)));
    expect(json).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(json).toContain('"name":"Avesta Tech"');
    expect(JSON.stringify(sanitizeJsonLd(person(placeholderSite)))).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(sanitizeJsonLd({ '@type': 'X', a: '[B]' })).toBeUndefined();
  });

  it('builds Person, SoftwareApplication, Service, FAQPage and BreadcrumbList', () => {
    expect(person(filled)).toMatchObject({ '@type': 'Person', image: 'https://avesta.example/assets/img/founder.jpg' });
    expect(softwareApplication(filled)).toMatchObject({ softwareVersion: '0.5.0', offers: { price: '0' } });
    const svc = { slug: 's', name: 'Quality Scan', card: 'A `fixed` audit.', promise: '', whoFor: [], deliverables: [], steps: [], needs: [], faqIds: [],
      price: { amount: 1500, unit: 'fixed' as const }, seo: { title: 't', description: 'd', path: '/services/s' } };
    expect(service(filled, svc)).toMatchObject({ name: 'Quality Scan', description: 'A fixed audit.', areaServed: ['NL', 'EU'], offers: { price: '1500' } });
    expect(service(filled, { ...svc, price: { amount: null, unit: 'fixed' } })['offers']).toBeUndefined();
    expect(faqPage([{ id: 'G3', question: 'Q?', answer: 'Run `x`.' }])).toMatchObject({ mainEntity: [{ name: 'Q?', acceptedAnswer: { text: 'Run x.' } }] });
    expect(breadcrumbList(filled, [{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }])).toMatchObject({
      itemListElement: [{ position: 1, item: 'https://avesta.example/' }, { position: 2, name: 'Pricing' }],
    });
  });
});
