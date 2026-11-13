/**
 * Brief 6.2 budgets on transferred size. Angular's own budgets (angular.json) measure raw bytes
 * and guard against regressions; this script applies the brief's numbers to gzip size, which
 * is what reaches the browser.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { DIST } from './lib/site';

const KB = 1024;
const gz = (file: string) => gzipSync(readFileSync(join(DIST, file)), { level: 9 }).length;
const home = readFileSync(join(DIST, 'index.html'), 'utf8');
const initial = new Set([
  ...[...home.matchAll(/(?:href|src)="((?:main|chunk|styles)-[^"]+\.(?:js|css))"/g)].map((m) => m[1]!),
]);
const initialGz = [...initial].reduce((sum, f) => sum + gz(f), 0);
const lazy = readdirSync(DIST).filter((f) => f.endsWith('.js') && !initial.has(f));
const largestLazy = lazy
  .map((f) => ({ f, raw: statSync(join(DIST, f)).size, gz: gz(f) }))
  .sort((a, b) => b.raw - a.raw)[0];

const rows: [string, number, number, number][] = [
  ['initial JS + CSS (gzip)', initialGz, 170 * KB, 220 * KB],
  [`largest lazy chunk (raw, ${largestLazy?.f})`, largestLazy?.raw ?? 0, 60 * KB, 90 * KB],
];
let failed = false;
for (const [name, size, warn, error] of rows) {
  const status = size > error ? 'FAIL' : size > warn ? 'WARN' : 'pass';
  if (status === 'FAIL') failed = true;
  console.log(`${status.padEnd(4)}  ${name}: ${(size / KB).toFixed(1)} kB (warn ${warn / KB}, error ${error / KB})`);
}
if (failed) process.exit(1);
