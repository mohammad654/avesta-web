import { fill, formatAmount, formatPrice } from './format';

describe('format (brief 1.6)', () => {
  it('writes "EUR 1,500" in tables and "€1,500" in body copy', () => {
    expect(formatAmount(1500, 'table')).toBe('EUR 1,500');
    expect(formatAmount(1500)).toBe('€1,500');
    expect(formatAmount(null)).toBeNull();
    expect(formatAmount(Number.NaN)).toBeNull();
  });

  it('formats prices, preferring an explicit display', () => {
    expect(formatPrice({ amount: 750, unit: 'month' }, 'table')).toBe('EUR 750');
    expect(formatPrice({ amount: null, unit: 'fixed', display: 'From €900' })).toBe('From €900');
    expect(formatPrice({ amount: null, unit: 'fixed' })).toBeNull();
  });

  it('fills {tokens} and leaves unknown ones', () => {
    expect(fill('Showing {shown} of {total} {x}', { shown: 4, total: 10 })).toBe(
      'Showing 4 of 10 {x}',
    );
  });
});
