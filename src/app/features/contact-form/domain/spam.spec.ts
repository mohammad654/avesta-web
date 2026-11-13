import { MIN_FILL_MS, looksLikeSpam } from './spam';

describe('spam check (brief 3.9)', () => {
  it('flags a filled honeypot', () => expect(looksLikeSpam('http://x', 0, 60_000)).toBe(true));
  it('flags submissions faster than the minimum', () =>
    expect(looksLikeSpam('', 1000, 1000 + MIN_FILL_MS - 1)).toBe(true));
  it('accepts a human-paced, empty-honeypot submission', () =>
    expect(looksLikeSpam('  ', 0, MIN_FILL_MS)).toBe(false));
});
