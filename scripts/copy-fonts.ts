/** Copies the self-hosted WOFF2 files (Latin subset) and their licences into public/assets/fonts. */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'public/assets/fonts');
const FONTS: [pkg: string, family: string, weights: number[]][] = [
  ['cinzel', 'cinzel', [500, 700]],
  ['ibm-plex-sans', 'ibm-plex-sans', [400, 500, 600]],
  ['ibm-plex-mono', 'ibm-plex-mono', [400]],
  ['space-grotesk', 'space-grotesk', [500]],
];

mkdirSync(out, { recursive: true });
for (const [pkg, family, weights] of FONTS) {
  const dir = join(root, 'node_modules/@fontsource', pkg);
  for (const w of weights) {
    const file = `${family}-latin-${w}-normal.woff2`;
    copyFileSync(join(dir, 'files', file), join(out, file));
  }
  const licence = ['LICENSE', 'LICENSE.md', 'OFL.txt'].map((f) => join(dir, f)).find(existsSync);
  if (licence) copyFileSync(licence, join(out, `${family}-LICENSE.txt`));
}
console.log(`fonts copied to ${out}`);
