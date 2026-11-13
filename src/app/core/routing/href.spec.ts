import { parseHref } from './href';

describe('parseHref', () => {
  it('classifies internal routes with query and fragment', () => {
    expect(parseHref('/contact?topic=demo#form')).toEqual({
      kind: 'internal',
      path: '/contact',
      queryParams: { topic: 'demo' },
      fragment: 'form',
    });
    expect(parseHref('/product')).toEqual({ kind: 'internal', path: '/product', queryParams: {} });
  });
  it('classifies external links, downloads and placeholders', () => {
    expect(parseHref('mailto:a@b.c')).toEqual({
      kind: 'external',
      href: 'mailto:a@b.c',
      download: false,
    });
    expect(parseHref('/assets/sample-report/report.json')).toEqual({
      kind: 'external',
      href: '/assets/sample-report/report.json',
      download: true,
    });
    expect(parseHref('/.well-known/security.txt').kind).toBe('external');
    expect(parseHref('[CV_PDF]')).toEqual({ kind: 'placeholder', token: '[CV_PDF]' });
  });
});
