/**
 * Lists every remaining [PLACEHOLDER] (brief 7.4, 8.2). In rendered HTML, JSON-LD, sitemap,
 * robots.txt and security.txt it fails with --strict (production); otherwise it warns.
 * `--content` also lists the open keys in src/content (the owner review list, step 18).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT, DIST, SiteJson, htmlFiles, jsonLdBlocks, pathOf, readJson } from './lib/site';

const PATTERN = /\[[A-Z0-9_]+\]/g;
const strict = process.argv.includes('--strict');
const found = new Map<string, Set<string>>();

function record(where: string, text: string): void {
  for (const token of text.match(PATTERN) ?? []) {
    if (!found.has(token)) found.set(token, new Set());
    found.get(token)!.add(where);
  }
}

for (const file of htmlFiles()) {
  const html = readFileSync(file, 'utf8');
  // Scripts (hydration state, event replay) are framework data, not published copy.
  record(pathOf(file), html.replace(/<script[\s\S]*?<\/script>/g, ''));
  for (const block of jsonLdBlocks(html)) record(`${pathOf(file)} (JSON-LD)`, block);
}
for (const extra of ['sitemap.xml', 'robots.txt', '.well-known/security.txt', '_headers']) {
  const file = join(DIST, extra);
  if (existsSync(file)) record(`/${extra}`, readFileSync(file, 'utf8'));
}

if (process.argv.includes('--content')) {
  const open = Object.entries(readJson<SiteJson>(join(CONTENT, 'site.json')).placeholders)
    .filter(([, v]) => !v.trim())
    .map(([k]) => k);
  console.log(`Open placeholders in src/content/site.json (${open.length}):\n  ${open.join('\n  ')}\n`);
}

const tokens = [...found.keys()].sort();
if (!tokens.length) {
  console.log('No placeholders left in the published output.');
} else {
  const lines = tokens.map((t) => {
    const pages = [...found.get(t)!];
    return `${t}  (${pages.length} place${pages.length === 1 ? '' : 's'}: ${pages.slice(0, 4).join(', ')}${pages.length > 4 ? ', …' : ''})`;
  });
  const message = `${tokens.length} placeholder(s) remain in the published output:\n  ${lines.join('\n  ')}`;
  if (strict) {
    console.error(`Placeholder check FAILED. ${message}`);
    process.exit(1);
  }
  console.warn(`Placeholder check (warning only outside production). ${message}`);
}
