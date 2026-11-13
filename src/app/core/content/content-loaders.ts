import { ContentKey, PageId } from './content-keys';

type Loader = () => Promise<{ default: unknown }>;

/**
 * Static import map: one lazy chunk per content file. The bundler needs literal paths, so a new
 * page means one new line here and one JSON file in src/content/pages/.
 */
const PAGE_LOADERS: Record<PageId, Loader> = {
  home: () => import('../../../content/pages/home.json'),
  product: () => import('../../../content/pages/product.json'),
  'sample-report': () => import('../../../content/pages/sample-report.json'),
  standards: () => import('../../../content/pages/standards.json'),
  services: () => import('../../../content/pages/services.json'),
  pricing: () => import('../../../content/pages/pricing.json'),
  'how-it-works': () => import('../../../content/pages/how-it-works.json'),
  'cra-readiness': () => import('../../../content/pages/cra-readiness.json'),
  trust: () => import('../../../content/pages/trust.json'),
  about: () => import('../../../content/pages/about.json'),
  freelance: () => import('../../../content/pages/freelance.json'),
  contact: () => import('../../../content/pages/contact.json'),
  'not-found': () => import('../../../content/pages/not-found.json'),
  'legal-privacy': () => import('../../../content/pages/legal-privacy.json'),
  'legal-terms': () => import('../../../content/pages/legal-terms.json'),
  'legal-cookies': () => import('../../../content/pages/legal-cookies.json'),
  'legal-imprint': () => import('../../../content/pages/legal-imprint.json'),
  'legal-disclosure': () => import('../../../content/pages/legal-disclosure.json'),
  'legal-accessibility': () => import('../../../content/pages/legal-accessibility.json'),
};

const DATA_LOADERS: Record<Exclude<ContentKey, `page:${string}`>, Loader> = {
  services: () => import('../../../content/services.json'),
  pricing: () => import('../../../content/pricing.json'),
  faq: () => import('../../../content/faq.json'),
  cra: () => import('../../../content/cra-checker.json'),
  standards: () => import('../../../content/standards.json'),
  sampleReport: () => import('../../../content/sample-report.json'),
  sampleReportSummary: () => import('../../../content/sample-report.summary.json'),
  'copy:standards': () => import('../../../content/features/standards-explorer.json'),
  'copy:sampleReport': () => import('../../../content/features/sample-report.json'),
  'copy:pipeline': () => import('../../../content/features/pipeline.json'),
  'copy:contactForm': () => import('../../../content/features/contact-form.json'),
  snippets: () =>
    import('../../../content/snippets/github-action.yml').then((m) => ({
      default: { githubAction: m.default },
    })),
};

export function loaderFor(key: ContentKey): Loader {
  if (key.startsWith('page:')) return PAGE_LOADERS[key.slice(5) as PageId];
  return DATA_LOADERS[key as keyof typeof DATA_LOADERS];
}
