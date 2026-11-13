/**
 * Runs after `ng build` (brief 8.1 step 15): 404 page, sitemap, robots, security.txt, OG images,
 * headers, then the checks. `--strict` (build:prod) fails on any remaining placeholder.
 */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const strict = process.argv.includes('--strict');
const steps: [string, string[]][] = [
  ['build-404.ts', []],
  ['build-sitemap.ts', []],
  ['build-security-txt.ts', []],
  ['build-og-images.ts', []],
  ['build-headers.ts', []],
  ['check-budgets.ts', []],
  ['check-copy-rules.ts', []],
  ['check-placeholders.ts', strict ? ['--strict'] : []],
];
for (const [script, args] of steps) {
  console.log(`\n▶ ${script} ${args.join(' ')}`);
  execFileSync('npx', ['tsx', join(import.meta.dirname, script), ...args], { stdio: 'inherit' });
}
