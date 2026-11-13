/**
 * Brief 8.2 copy rules on the rendered HTML:
 *  1. no "certified", "compliant", "guaranteed", "100% secure", "military-grade" (except FAQ G2 and legal pages);
 *  2. the founder's closing line exactly once, on Home only;
 *  3. pages with CRA dates or amounts carry "Dates and amounts: verify with counsel."
 */
import { readFileSync } from 'node:fs';
import { htmlFiles, pathOf, visibleText } from './lib/site';

const BANNED = /\b(certified|compliant|guaranteed|military-grade)\b|100% secure/gi;
const ALLOWED_FAQ_IDS = ['G2'];
const CLOSING = "Hi, everyone, it's time to get some fresh air!";
const DATES = ['11 September 2026', '11 December 2027', '10 December 2024', 'EUR 15 million'];
const FOOTNOTE = 'Dates and amounts: verify with counsel.';

const failures: string[] = [];
const closingPages: string[] = [];

for (const file of htmlFiles()) {
  const path = pathOf(file);
  let html = readFileSync(file, 'utf8');
  for (const id of ALLOWED_FAQ_IDS) {
    html = html.replace(new RegExp(`<details[^>]*id="faq-${id}"[\\s\\S]*?</details>`, 'g'), '');
  }
  const text = visibleText(html);
  if (!path.startsWith('/legal/')) {
    const hits = [...new Set((text.match(BANNED) ?? []).map((w) => w.toLowerCase()))];
    if (hits.length) failures.push(`${path}: banned word(s) ${hits.join(', ')}`);
  }
  const count = text.split(CLOSING).length - 1;
  if (count > 0) closingPages.push(`${path} (${count}x)`);
  if (DATES.some((d) => text.includes(d)) && !text.includes(FOOTNOTE)) {
    failures.push(`${path}: mentions a CRA date or amount without the footnote "${FOOTNOTE}"`);
  }
}

if (closingPages.length !== 1 || closingPages[0] !== '/ (1x)') {
  failures.push(`closing line must appear once, on Home only; found on: ${closingPages.join(', ') || 'no page'}`);
}

if (failures.length) {
  console.error('Copy rules FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log(`Copy rules passed on ${htmlFiles().length} pages.`);
