/**
 * One Open Graph image per page (brief 5.2): 1200×630, navy, gold sun mark, Cinzel page title,
 * cream subtitle. Rendered with headless Chrome (Playwright, system Chrome channel).
 * `--brand` also writes public/apple-touch-icon.png and public/assets/brand/avesta-logo-512.png.
 */
import { mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { DIST, ROOT, routes, slugFor } from './lib/site';

const font = (file: string) =>
  `data:font/woff2;base64,${readFileSync(join(ROOT, 'public/assets/fonts', file)).toString('base64')}`;
const SUN = `<svg viewBox="542 200 116 116" width="150" height="150"><circle cx="600" cy="258" r="52" fill="none" stroke="#C9A461" stroke-width="3"/><path d="M600 214q0 44 44 44-44 0-44 44 0-44-44-44 44 0 44-44Z" fill="#C9A461"/><g fill="#C9A461"><circle cx="637" cy="221" r="6"/><circle cx="563" cy="295" r="6"/><circle cx="551" cy="240" r="4"/></g></svg>`;
const MARK = readFileSync(join(ROOT, 'public/favicon.svg'), 'utf8');
const strip = (s: string) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`/g, '')
    .replace(/\{lang:[a-z]+\|([^}]+)\}/g, '$1');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** First sentence, so the subtitle never stops mid-word. */
function firstSentence(text: string): string {
  const match = /^.*?[.!?](\s|$)/.exec(text);
  return (match ? match[0] : text).trim();
}

function page(title: string, sub: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:Cinzel;src:url(${font('cinzel-latin-700-normal.woff2')});font-weight:700}
    @font-face{font-family:Cinzel;src:url(${font('cinzel-latin-500-normal.woff2')});font-weight:500}
    @font-face{font-family:Plex;src:url(${font('ibm-plex-sans-latin-400-normal.woff2')})}
    @font-face{font-family:Grotesk;src:url(${font('space-grotesk-latin-500-normal.woff2')})}
    html,body{margin:0;width:1200px;height:630px;background:#0E1A33;color:#FAF7F0;overflow:hidden}
    .wrap{position:relative;height:100%;padding:72px 88px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center}
    .sun{position:absolute;right:88px;top:72px}
    h1{font-family:Cinzel;font-weight:700;font-size:64px;line-height:1.08;letter-spacing:.02em;margin:0 0 28px;max-width:900px}
    p{font-family:Plex;font-size:28px;line-height:1.4;margin:0;max-width:900px;color:#FAF7F0;opacity:.92}
    .brand{position:absolute;left:88px;bottom:56px;display:flex;align-items:center;gap:16px}
    .brand svg{width:44px;height:44px;border-radius:8px}
    .brand b{font-family:Cinzel;font-weight:500;font-size:26px;letter-spacing:.14em}
    .brand i{font-style:normal;font-family:Grotesk;font-size:14px;letter-spacing:.5em;color:#C9A461}
    .belt{position:absolute;left:0;right:0;bottom:0;height:10px;background:#C9A461}
  </style></head><body><div class="wrap"><div class="sun">${SUN}</div>
  <h1>${esc(strip(title))}</h1><p>${esc(firstSentence(strip(sub)))}</p>
  <div class="brand">${MARK}<span><b>AVESTA</b><br><i>TECH</i></span></div><div class="belt"></div></div></body></html>`;
}

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const tab = await context.newPage();

if (process.argv.includes('--brand')) {
  mkdirSync(join(ROOT, 'public/assets/brand'), { recursive: true });
  for (const [size, out] of [
    [180, 'public/apple-touch-icon.png'],
    [512, 'public/assets/brand/avesta-logo-512.png'],
  ] as const) {
    await tab.setViewportSize({ width: size, height: size });
    await tab.setContent(
      `<html><body style="margin:0;background:#0E1A33">${MARK.replace('<svg', `<svg width="${size}" height="${size}"`)}</body></html>`,
    );
    await tab.screenshot({ path: join(ROOT, out) });
    console.log(`wrote ${out}`);
  }
  await tab.setViewportSize({ width: 1200, height: 630 });
}

mkdirSync(join(DIST, 'og'), { recursive: true });
let count = 0;
for (const route of routes().filter((r) => !r.noindex)) {
  await tab.setContent(page(route.heading, route.sub), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const out = join(DIST, 'og', `${slugFor(route.path)}.png`);
  await tab.screenshot({ path: out });
  if (statSync(out).size > 300 * 1024) throw new Error(`${out} is over 300 KB`);
  count += 1;
}
await browser.close();
console.log(`OG images: ${count} written to dist/.../og/`);
