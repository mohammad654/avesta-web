import { FeatureId, Page } from './content.models';

export const PAGE_IDS = [
  'home',
  'product',
  'sample-report',
  'standards',
  'services',
  'pricing',
  'how-it-works',
  'cra-readiness',
  'trust',
  'about',
  'freelance',
  'contact',
  'not-found',
  'legal-privacy',
  'legal-terms',
  'legal-cookies',
  'legal-imprint',
  'legal-disclosure',
  'legal-accessibility',
] as const;

export type PageId = (typeof PAGE_IDS)[number];

export type DataKey =
  | 'services'
  | 'pricing'
  | 'faq'
  | 'cra'
  | 'standards'
  | 'sampleReport'
  | 'sampleReportSummary'
  | 'copy:standards'
  | 'copy:sampleReport'
  | 'copy:pipeline'
  | 'copy:contactForm'
  | 'snippets';

export type ContentKey = `page:${PageId}` | DataKey;

export const LEGAL_DOCS = PAGE_IDS.filter((id) => id.startsWith('legal-')).map((id) =>
  id.slice('legal-'.length),
);

export function isPageId(value: string): value is PageId {
  return (PAGE_IDS as readonly string[]).includes(value);
}

/** Which data files a page needs before it can render (pure; derived from its sections). */
export function contentKeysForPage(page: Page): DataKey[] {
  const keys = new Set<DataKey>();
  for (const section of page.sections) {
    switch (section.kind) {
      case 'faq':
        keys.add('faq');
        break;
      case 'services':
        keys.add('services');
        break;
      case 'ctaBand':
        if (section.priceOf) keys.add('services');
        break;
      case 'code':
        keys.add('snippets');
        break;
      case 'hero':
        if (section.visual === 'reportCard') keys.add('sampleReportSummary');
        break;
      case 'feature':
        for (const key of FEATURE_KEYS[section.feature]) keys.add(key);
        break;
    }
  }
  return [...keys];
}

const FEATURE_KEYS: Record<FeatureId, readonly DataKey[]> = {
  craChecker: ['cra'],
  standards: ['standards', 'copy:standards'],
  pipeline: ['copy:pipeline'],
  sampleReport: ['sampleReport', 'copy:sampleReport', 'copy:standards'],
  pricing: ['pricing', 'services'],
  contactForm: ['copy:contactForm'],
};
