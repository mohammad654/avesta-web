import { contrastRatio } from './contrast';

describe('contrast ratios of the brand pairs (brief 9.1)', () => {
  it('meets AA for every text pair the site uses', () => {
    expect(contrastRatio('#FAF7F0', '#0E1A33')).toBeGreaterThan(16);
    expect(contrastRatio('#0E1A33', '#C9A461')).toBeGreaterThan(7);
    expect(contrastRatio('#8A6A2E', '#FAF7F0')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#4F5A70', '#FAF7F0')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#A9B1C4', '#0E1A33')).toBeGreaterThanOrEqual(4.5);
  });
  it('confirms gold ink is for large text and graphics only, and gold on cream is decoration', () => {
    expect(contrastRatio('#A8843F', '#FAF7F0')).toBeGreaterThanOrEqual(3);
    expect(contrastRatio('#A8843F', '#FAF7F0')).toBeLessThan(4.5);
    expect(contrastRatio('#C9A461', '#FAF7F0')).toBeLessThan(3);
  });
});
