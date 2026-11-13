import { Plan } from '../../../core/content/content.models';
import {
  clampProducts,
  parseBilling,
  parseView,
  planPrice,
  suggestBusiness,
  teamTotal,
} from './pricing';

const plan = (monthly: number | null, yearly: number | null): Plan => ({
  id: 'team',
  name: 'Team',
  for: 'One product',
  includes: [],
  monthly,
  yearly,
  cta: { label: 'Book a demo', href: '/contact', variant: 'primary' },
});

describe('pricing (brief 4.5)', () => {
  it('shows "Contact us" for null prices in either billing mode', () => {
    expect(planPrice(plan(null, null), 'monthly')).toEqual({ kind: 'contact' });
    expect(planPrice(plan(100, null), 'yearly')).toEqual({ kind: 'contact' });
  });

  it('shows the per-month equivalent for yearly billing', () => {
    expect(planPrice(plan(100, 1000), 'yearly')).toEqual({
      kind: 'yearly',
      perMonth: 83.33,
      billedYearly: 1000,
    });
    expect(planPrice(plan(100, 1000), 'monthly')).toEqual({ kind: 'monthly', perMonth: 100 });
  });

  it('multiplies the Team price by the number of products', () => {
    expect(teamTotal(plan(750, 7200), 'monthly', 3)).toBe(2250);
    expect(teamTotal(plan(750, 7200), 'yearly', 2)).toBe(1200);
    expect(teamTotal(plan(null, null), 'monthly', 3)).toBeNull();
    expect(teamTotal(undefined, 'monthly', 3)).toBeNull();
  });

  it('suggests Business above the threshold and clamps input', () => {
    expect(suggestBusiness(3, 3)).toBe(false);
    expect(suggestBusiness(4, 3)).toBe(true);
    expect(clampProducts(0)).toBe(1);
    expect(clampProducts(Number.NaN)).toBe(1);
    expect(clampProducts(2.6)).toBe(3);
    expect(clampProducts(5000)).toBe(999);
  });

  it('parses billing and view from the URL', () => {
    expect(parseBilling('yearly')).toBe('yearly');
    expect(parseBilling(undefined)).toBe('monthly');
    expect(parseView('services')).toBe('services');
    expect(parseView('x')).toBe('plans');
  });
});
