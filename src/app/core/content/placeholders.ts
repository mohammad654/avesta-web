/** Brief 8.2: the placeholder pattern. */
export const PLACEHOLDER_PATTERN = /\[[A-Z0-9_]+\]/;
const PLACEHOLDER_GLOBAL = /\[([A-Z0-9_]+)\]/g;

export function hasPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value);
}

/** Value meaning "confirmed, remove the token" (for CONFIRM_* flags). */
export const CONFIRMED = '-';

/** The values the founder has filled in (empty strings are still open; "-" removes the token). */
export function filledValues(placeholders: Readonly<Record<string, string>>): Map<string, string> {
  return new Map(
    Object.entries(placeholders)
      .filter(([, value]) => value.trim() !== '')
      .map(([key, value]) => [key, value.trim() === CONFIRMED ? '' : value]),
  );
}

/** Deep-replaces every filled [KEY] in strings; unfilled keys stay visible. Pure. */
export function resolvePlaceholders<T>(value: T, values: ReadonlyMap<string, string>): T {
  if (values.size === 0) return value;
  return walk(value, values) as T;
}

function walk(value: unknown, values: ReadonlyMap<string, string>): unknown {
  if (typeof value === 'string') {
    return value
      .replace(PLACEHOLDER_GLOBAL, (token, key: string) => values.get(key) ?? token)
      .replace(/ {2,}/g, ' ')
      .replace(/ ([.,;:])/g, '$1');
  }
  if (Array.isArray(value)) return value.map((item) => walk(item, values));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, values)]));
  }
  return value;
}
