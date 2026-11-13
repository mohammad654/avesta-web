import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Page } from '../content/content.models';
import { testProviders } from '../../testing/test-providers';
import { SeoService } from './seo.service';

const page: Page = {
  id: 'pricing',
  seo: {
    title: 'Pricing per product, not per developer | Avesta Tech',
    description: 'Plans priced per product.',
    path: '/pricing',
    breadcrumb: 'Pricing',
  },
  sections: [
    {
      kind: 'hero',
      id: 'hero',
      heading: 'Priced per product, not per developer.',
      sub: 's',
      ctas: [],
    },
    { kind: 'faq', id: 'faq', heading: 'FAQ', faqIds: ['P1', 'P2'] },
  ],
};

describe('SeoService (brief 5.2, 5.3)', () => {
  function head() {
    TestBed.configureTestingModule({ providers: testProviders() });
    TestBed.inject(SeoService).applyPage(page);
    return TestBed.inject(DOCUMENT).head;
  }

  it('writes title, description, canonical, hreflang, Open Graph and robots', () => {
    const h = head();
    expect(TestBed.inject(DOCUMENT).title).toBe(page.seo.title);
    expect(h.querySelector('meta[name=description]')!.getAttribute('content')).toBe(
      'Plans priced per product.',
    );
    expect(h.querySelector('link[rel=canonical]')!.getAttribute('href')).toBe(
      'https://[DOMAIN]/pricing',
    );
    expect(h.querySelectorAll('link[rel=alternate]')).toHaveLength(2);
    expect(h.querySelector('meta[property="og:title"]')!.getAttribute('content')).toBe(
      'Pricing per product, not per developer',
    );
    expect(h.querySelector('meta[property="og:image"]')!.getAttribute('content')).toBe(
      'https://[DOMAIN]/og/pricing.png',
    );
    expect(h.querySelector('meta[property="og:image:alt"]')!.getAttribute('content')).toBe(
      'Avesta Tech: Priced per product, not per developer.',
    );
    expect(h.querySelector('meta[name=robots]')!.getAttribute('content')).toContain(
      'index, follow',
    );
  });

  it('adds Organization, BreadcrumbList and FAQPage JSON-LD without placeholders', () => {
    const blocks = [...head().querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent ?? '',
    );
    expect(blocks).toHaveLength(3);
    expect(blocks.join('')).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(blocks[2]).toContain('"FAQPage"');
  });

  it('replaces previous JSON-LD and marks noindex pages', () => {
    TestBed.configureTestingModule({ providers: testProviders() });
    const seo = TestBed.inject(SeoService);
    seo.applyPage(page);
    seo.applyPage({ ...page, seo: { ...page.seo, noindex: true, path: '/404' } });
    const h = TestBed.inject(DOCUMENT).head;
    expect(h.querySelectorAll('script[data-seo]')).toHaveLength(0);
    expect(h.querySelector('meta[name=robots]')!.getAttribute('content')).toBe('noindex, follow');
  });
});
