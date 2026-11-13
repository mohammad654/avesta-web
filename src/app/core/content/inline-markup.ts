/**
 * Tiny inline markup for copy strings, so templates never hold copy:
 *   `code`            → <code>
 *   [label](href)     → link
 *   {lang:ku|text}    → <span lang="ku" dir="rtl">
 *   [PLACEHOLDER]     → placeholder tag
 */
export type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'lang'; text: string; lang: string; dir: 'rtl' | 'ltr' }
  | { type: 'ph'; text: string };

const RTL_LANGS = new Set(['ar', 'ku', 'fa', 'he']);
const TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\{lang:([a-z-]+)\|([^}]+)\}|(\[[A-Z0-9_]+\])/g;

export function parseInline(source: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: 'text', text: source.slice(last, index) });
    const [whole, code, label, href, lang, langText, ph] = match;
    if (code !== undefined) tokens.push({ type: 'code', text: code });
    else if (label !== undefined && href !== undefined)
      tokens.push({ type: 'link', text: label, href });
    else if (lang !== undefined && langText !== undefined) {
      tokens.push({ type: 'lang', text: langText, lang, dir: RTL_LANGS.has(lang) ? 'rtl' : 'ltr' });
    } else if (ph !== undefined) tokens.push({ type: 'ph', text: ph });
    last = index + whole.length;
  }
  if (last < source.length) tokens.push({ type: 'text', text: source.slice(last) });
  return tokens;
}

/** Plain text for meta tags and JSON-LD: markup removed, placeholders kept. */
export function toPlainText(source: string): string {
  return parseInline(source)
    .map((t) => t.text)
    .join('');
}
