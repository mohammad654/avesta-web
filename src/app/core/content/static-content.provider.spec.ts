import { TestBed } from '@angular/core/testing';
import { ContentKey, DataKey, PAGE_IDS, contentKeysForPage } from './content-keys';
import { StaticContentProvider } from './static-content.provider';

const ALL_FAQ = [
  'G1',
  'G2',
  'G3',
  'G4',
  'G5',
  'G6',
  'G7',
  'G8',
  'P1',
  'P2',
  'P3',
  'P4',
  'P5',
  'C1',
  'C2',
  'C3',
  'C4',
];
const DATA: DataKey[] = [
  'services',
  'pricing',
  'faq',
  'cra',
  'standards',
  'sampleReport',
  'sampleReportSummary',
  'copy:standards',
  'copy:sampleReport',
  'copy:pipeline',
  'copy:contactForm',
  'snippets',
];

/** Walks a value and returns the paths of any undefined or null leaf that should be text. */
function undefinedPaths(value: unknown, path = ''): string[] {
  if (value === undefined) return [path];
  if (Array.isArray(value)) return value.flatMap((v, i) => undefinedPaths(v, `${path}[${i}]`));
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => undefinedPaths(v, `${path}.${k}`));
  }
  return [];
}

describe('StaticContentProvider (brief 7.4, 8.1 step 3)', () => {
  let content: StaticContentProvider;

  beforeEach(async () => {
    content = TestBed.inject(StaticContentProvider);
    await content.ensure([...PAGE_IDS.map((id) => `page:${id}` as ContentKey), ...DATA]);
  });

  it('loads every page id, each with SEO and sections, without undefined values', () => {
    for (const id of PAGE_IDS) {
      const page = content.page(id);
      expect(page, id).toBeDefined();
      expect(page!.id).toBe(id);
      expect(page!.seo.title.length, id).toBeGreaterThan(10);
      expect(page!.seo.description.length, id).toBeGreaterThan(40);
      expect(page!.sections.length, id).toBeGreaterThan(0);
      expect(undefinedPaths(page), id).toEqual([]);
    }
  });

  it('has exactly one H1 source per page (a hero, or the CRA checker heading)', () => {
    for (const id of PAGE_IDS) {
      const page = content.page(id)!;
      const heroes = page.sections.filter((s) => s.kind === 'hero').length;
      const checker = page.sections.filter(
        (s) => s.kind === 'feature' && s.feature === 'craChecker',
      ).length;
      expect(heroes + checker, id).toBe(1);
    }
  });

  it('resolves every FAQ id used by any page or service, and all 17 brief items', () => {
    expect(content.faq(ALL_FAQ).map((f) => f.id)).toEqual(ALL_FAQ);
    const used = PAGE_IDS.flatMap((id) =>
      content.page(id)!.sections.flatMap((s) => (s.kind === 'faq' ? s.faqIds : [])),
    );
    const fromServices = content.services().flatMap((s) => s.faqIds);
    for (const id of [...used, ...fromServices]) expect(content.faq([id]), id).toHaveLength(1);
    expect(content.faq(['C1'])[0]!.footnote).toBe('* Dates and amounts: verify with counsel.');
  });

  it('provides services with shared needs, and only real detail pages via service()', () => {
    expect(content.services()).toHaveLength(7);
    expect(content.service('cra-readiness-scan')!.needs).toEqual([
      'Access',
      'A contact person',
      'Written permission to scan',
    ]);
    expect(content.service('freelance-engineering')).toBeUndefined();
    expect(content.serviceLabels().book).toBe('Book a call');
  });

  it('serves pricing, CRA questions, standards, report and copy', () => {
    expect(content.plans().map((p) => p.id)).toEqual([
      'community',
      'team',
      'business',
      'enterprise',
    ]);
    expect(content.craQuestions()).toHaveLength(8);
    expect(Object.keys(content.standards().frameworks)).toEqual(
      expect.arrayContaining(['ISO27001', 'IEC62443', 'CRA']),
    );
    expect(content.sampleReport().project).toBe('Demo Controller');
    expect(content.sampleReportSummary()).toMatchObject({ score: 68, grade: 'C', findings: 10 });
    expect(content.copy('pipeline').steps).toHaveLength(8);
    expect(content.snippets().githubAction).toContain('avesta-proof scan');
  });

  it('keeps unfilled placeholders visible and knows which are filled', () => {
    expect(content.site().kvk).toBe('[KVK_NUMBER]');
    expect(content.isFilled('KVK_NUMBER')).toBe(false);
    expect(content.chrome().footer.bottom).toContain('[KVK_NUMBER]');
  });

  it('derives the content keys a page needs from its sections', () => {
    expect(contentKeysForPage(content.page('home')!)).toEqual(
      expect.arrayContaining(['sampleReportSummary', 'faq', 'services']),
    );
    expect(contentKeysForPage(content.page('product')!)).toEqual(
      expect.arrayContaining(['standards', 'copy:standards', 'faq']),
    );
    expect(contentKeysForPage(content.page('how-it-works')!)).toEqual(
      expect.arrayContaining(['copy:pipeline', 'snippets']),
    );
  });

  it('loads each file once and reports content that was never loaded', async () => {
    const fresh = new StaticContentProvider();
    expect(() => fresh.pricing()).toThrowError(/not loaded/);
    await Promise.all([fresh.ensure(['pricing']), fresh.ensure(['pricing'])]);
    expect(fresh.pricing().plans).toHaveLength(4);
    expect(fresh.page('home')).toBeUndefined();
  });
});
