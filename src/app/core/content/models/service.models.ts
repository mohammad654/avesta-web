import type pricingJson from '../../../../content/pricing.json';
import type servicesJson from '../../../../content/services.json';
import { Cta, HasFaq, HasSeo } from './seo.models';

export interface Price {
  amount: number | null;
  unit: 'fixed' | 'month' | 'hour';
  display?: string;
  /** e.g. "[PRICE_CRA_SCAN]"; shown in development while amount is null. */
  placeholder?: string;
}

export interface Service extends HasSeo, HasFaq {
  slug: string;
  name: string;
  card: string;
  promise: string;
  /** Internal route when the service has no detail page (freelance). */
  href?: string;
  whoFor: string[];
  deliverables: string[];
  deliverablesNote?: string;
  steps: { day: string; text: string }[];
  needs: string[];
  microcopy?: string;
  delivery?: string;
  price: Price;
}

export interface PlanInclude {
  text: string;
  comingSoon?: boolean;
}

export interface Plan {
  id: 'community' | 'team' | 'business' | 'enterprise';
  name: string;
  for: string;
  includes: PlanInclude[];
  monthly: number | null;
  yearly: number | null;
  /** Placeholder shown in development while the price is null. */
  placeholder?: string;
  unitLabel?: string;
  highlighted?: boolean;
  highlightLabel?: string;
  cta: Cta;
}

export interface PricingData {
  plans: Plan[];
  annualDiscount: string;
  businessThreshold: number;
  thresholdFlag: string;
  labels: PricingLabels;
}

export type PricingLabels = (typeof pricingJson)['labels'];
export type ServiceLabels = (typeof servicesJson)['labels'];

export interface ServicesFile {
  labels: ServiceLabels;
  /** Shared "What we need from you" list, used when a service has none of its own. */
  needs: string[];
  services: Service[];
}
