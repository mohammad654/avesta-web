import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** All indexable routes, read from the built sitemap (so e2e covers exactly what is published). */
export function publishedRoutes(): string[] {
  const xml = readFileSync(join(__dirname, '../dist/avesta-web/browser/sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]!);
}
