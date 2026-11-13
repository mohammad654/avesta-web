import { expect, test } from '@playwright/test';
import { publishedRoutes } from './routes';

/** Checks the prerendered HTML as delivered (no JavaScript), brief 5.1–5.6 and 8.3. */
const titles = new Set<string>();
const descriptions = new Set<string>();

for (const path of publishedRoutes()) {
  test(`head tags ${path}`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
    const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
    expect(title).toMatch(/Avesta (Tech|Proof)/);
    expect(description.length).toBeGreaterThan(50);
    expect(titles.has(title), `duplicate title ${title}`).toBe(false);
    expect(descriptions.has(description), `duplicate description`).toBe(false);
    titles.add(title);
    descriptions.add(description);
    expect(html).toContain('<html lang="en"');
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/[^"]+">/);
    for (const tag of [
      'og:title',
      'og:description',
      'og:url',
      'og:image',
      'og:image:alt',
      'og:locale',
      'og:type',
    ]) {
      expect(html, tag).toContain(`property="${tag}"`);
    }
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('"@type":"Organization"');
    if (path !== '/') expect(html).toContain('"@type":"BreadcrumbList"');
    for (const block of html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    )) {
      expect(() => JSON.parse(block[1]!)).not.toThrow();
    }
  });

  test(`headings ${path}`, async ({ page }) => {
    await page.goto(path);
    const levels = await page.$$eval('main h1, main h2, main h3, main h4', (hs) =>
      hs.map((h) => Number(h.tagName[1])),
    );
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    levels.forEach((level, i) => {
      if (i > 0)
        expect(level - levels[i - 1]!, `skipped level at heading ${i}`).toBeLessThanOrEqual(1);
    });
  });
}

test('robots.txt, sitemap.xml and security.txt are published', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('<lastmod>');
  expect(sitemap).not.toContain('/404');
  expect(await (await request.get('/.well-known/security.txt')).text()).toMatch(
    /Contact: .*\nExpires: /,
  );
});

test('the 404 page is noindex', async ({ request }) => {
  const response = await request.get('/nope');
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain('content="noindex, follow"');
});
