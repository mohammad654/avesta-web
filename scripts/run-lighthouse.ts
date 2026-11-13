/**
 * Lighthouse (mobile, default simulated throttling) on every published route against the local
 * CDN-like server (npm run serve). Writes lighthouse/summary.json and prints a table.
 * Brief 6.3 targets: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100,
 * LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 150 ms.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { DIST, ROOT } from './lib/site';

const base = process.env['LH_BASE'] ?? 'http://localhost:4300';
const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const routes = [...xml.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]!);
const only = process.argv.slice(2);
const targets = only.length ? routes.filter((r) => only.includes(r)) : routes;

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const rows: Record<string, number | string>[] = [];
for (const path of targets) {
  const result = await lighthouse(`${base}${path}`, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
  });
  const lhr = result!.lhr;
  const audit = (id: string) => lhr.audits[id]?.numericValue ?? NaN;
  const failed = ['accessibility', 'best-practices', 'seo'].flatMap((cat) =>
    lhr.categories[cat]!.auditRefs.filter(
      (ref) => ref.weight > 0 && (lhr.audits[ref.id]?.score ?? 1) < 1,
    ).map((ref) => `${cat}:${ref.id}`),
  );
  rows.push({
    path,
    performance: Math.round((lhr.categories['performance']!.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories['accessibility']!.score ?? 0) * 100),
    bestPractices: Math.round((lhr.categories['best-practices']!.score ?? 0) * 100),
    seo: Math.round((lhr.categories['seo']!.score ?? 0) * 100),
    lcpMs: Math.round(audit('largest-contentful-paint')),
    cls: Number(audit('cumulative-layout-shift').toFixed(3)),
    tbtMs: Math.round(audit('total-blocking-time')),
    jsKbTransferred: Math.round(
      (
        (
          lhr.audits['network-requests']?.details as {
            items?: { resourceType?: string; transferSize?: number }[];
          }
        )?.items ?? []
      )
        .filter((i) => i.resourceType === 'Script')
        .reduce((s, i) => s + (i.transferSize ?? 0), 0) / 1024,
    ),
    totalKb: Math.round(audit('total-byte-weight') / 1024),
    failedAudits: failed.join(' '),
  });
  console.log(JSON.stringify(rows.at(-1)));
}
chrome.kill();
mkdirSync(join(ROOT, 'lighthouse'), { recursive: true });
writeFileSync(join(ROOT, 'lighthouse/summary.json'), JSON.stringify(rows, null, 2));
