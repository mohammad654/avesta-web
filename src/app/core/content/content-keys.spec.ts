import { LEGAL_DOCS, isPageId } from './content-keys';

describe('content keys', () => {
  it('lists the legal documents of brief 2.1 plus the accessibility statement', () => {
    expect(LEGAL_DOCS).toEqual(['privacy', 'terms', 'cookies', 'imprint', 'disclosure', 'accessibility']);
  });
  it('recognises page ids', () => {
    expect(isPageId('home')).toBe(true);
    expect(isPageId('legal-nope')).toBe(false);
  });
});
