import { Price } from './content.models';

const NUMBER = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 });

/** Brief 1.6: "EUR 1,500" in tables, "€1,500" in body copy. Null when not yet priced. */
export function formatAmount(amount: number | null, style: 'table' | 'body' = 'body'): string | null {
  if (amount === null || !Number.isFinite(amount)) return null;
  const n = NUMBER.format(amount);
  return style === 'table' ? `EUR ${n}` : `€${n}`;
}

export function formatPrice(price: Price, style: 'table' | 'body' = 'body'): string | null {
  if (price.display) return price.display;
  return formatAmount(price.amount, style);
}

/** Replaces {name} tokens in a template string. Pure. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  );
}
