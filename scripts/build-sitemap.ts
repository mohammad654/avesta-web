/** sitemap.xml and robots.txt from the route list (brief 5.4). STAGING=1 → Disallow: /. */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, domain, gitDate, routes } from './lib/site';

const origin = `https://${domain()}`;
const urls = routes()
  .filter((r) => !r.noindex)
  .map(
    (r) =>
      `  <url><loc>${origin}${r.path === '/' ? '/' : r.path}</loc><lastmod>${gitDate(r.source)}</lastmod>` +
      `<priority>${r.priority.toFixed(1)}</priority></url>`,
  );
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);

const staging = process.env['STAGING'] === '1';
const robots = staging
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`;
writeFileSync(join(DIST, 'robots.txt'), robots);
console.log(
  `sitemap.xml: ${urls.length} URLs; robots.txt (${staging ? 'staging, noindex' : 'production'})`,
);
