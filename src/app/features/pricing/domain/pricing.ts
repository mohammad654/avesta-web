import { Plan } from '../../../core/content/content.models';

export type Billing = 'monthly' | 'yearly';
export type PricingView = 'plans' | 'services';

export type PlanPrice =
  | { kind: 'contact' }
  | { kind: 'monthly'; perMonth: number }
  | { kind: 'yearly'; perMonth: number; billedYearly: number };

/** Brief 4.5: null prices show "Contact us"; yearly shows the per-month equivalent. Pure. */
export function planPrice(plan: Plan, billing: Billing): PlanPrice {
  if (billing === 'yearly') {
    return plan.yearly === null
      ? { kind: 'contact' }
      : {
          kind: 'yearly',
          perMonth: Math.round((plan.yearly / 12) * 100) / 100,
          billedYearly: plan.yearly,
        };
  }
  return plan.monthly === null ? { kind: 'contact' } : { kind: 'monthly', perMonth: plan.monthly };
}

/** Team price × number of products; null while the Team price is not set. */
export function teamTotal(
  plan: Plan | undefined,
  billing: Billing,
  products: number,
): number | null {
  if (!plan) return null;
  const price = planPrice(plan, billing);
  return price.kind === 'contact'
    ? null
    : Math.round(price.perMonth * clampProducts(products) * 100) / 100;
}

export function suggestBusiness(products: number, threshold: number): boolean {
  return clampProducts(products) > threshold;
}

export function clampProducts(value: number): number {
  return Number.isFinite(value) ? Math.min(999, Math.max(1, Math.round(value))) : 1;
}

export function parseBilling(value: string | undefined): Billing {
  return value === 'yearly' ? 'yearly' : 'monthly';
}

export function parseView(value: string | undefined): PricingView {
  return value === 'services' ? 'services' : 'plans';
}
