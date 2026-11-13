import { hasPlaceholder } from '../content/placeholders';

export type ParsedHref =
  | { kind: 'internal'; path: string; queryParams: Record<string, string>; fragment?: string }
  | { kind: 'external'; href: string; download: boolean }
  | { kind: 'placeholder'; token: string };

const DOWNLOAD_EXTENSIONS = /\.(pdf|json|sarif|md|pub|svg|yml)$/i;

/** Classifies a content href. Placeholders are never rendered as links. Pure. */
export function parseHref(href: string): ParsedHref {
  if (hasPlaceholder(href)) return { kind: 'placeholder', token: href };
  if (/^(https?:|mailto:|tel:)/.test(href)) return { kind: 'external', href, download: false };
  if (href.startsWith('/assets/') || href.startsWith('/.well-known/')) {
    return { kind: 'external', href, download: DOWNLOAD_EXTENSIONS.test(href) };
  }
  const [beforeHash, fragment] = href.split('#', 2);
  const [path = '/', query = ''] = (beforeHash ?? '').split('?', 2);
  const queryParams = Object.fromEntries(new URLSearchParams(query));
  return fragment ? { kind: 'internal', path, queryParams, fragment } : { kind: 'internal', path, queryParams };
}
