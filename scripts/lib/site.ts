/** Shared helpers for the build scripts: paths, content, routes and rendered pages. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '../..');
export const CONTENT = join(ROOT, 'src/content');
export const DIST = join(ROOT, 'dist/avesta-web/browser');

export interface SiteJson {
  settings: { domain: string; securityEmail: string; formEndpoint: string };
  placeholders: Record<string, string>;
}

export interface RouteEntry {
  path: string;
  title: string;
  heading: string;
  sub: string;
  source: string;
  noindex: boolean;
  priority: number;
}

export function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

/** Applies the founder's filled values from site.json, like the app does. */
export function resolveValues(text: string): string {
  const site = readJson<SiteJson>(join(CONTENT, 'site.json'));
  return text.replace(/\[([A-Z0-9_]+)\]/g, (token, key: string) => site.placeholders[key]?.trim() || token);
}

export function domain(): string {
  return resolveValues(readJson<SiteJson>(join(CONTENT, 'site.json')).settings.domain);
}

interface PageJson {
  seo: { title: string; path: string; noindex?: boolean; priority?: number };
  sections: { kind: string; heading?: string; sub?: string }[];
}

interface ServicesJson {
  services: { slug: string; name: string; promise: string; href?: string; seo: { title: string; path: string; priority?: number } }[];
}

/** Every route from the content files (brief 2.1): pages plus service slugs. */
export function routes(): RouteEntry[] {
  const pagesDir = join(CONTENT, 'pages');
  const pages = readdirSync(pagesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const page = readJson<PageJson>(join(pagesDir, f));
      const hero = page.sections.find((s) => s.kind === 'hero');
      return {
        path: page.seo.path,
        title: page.seo.title,
        heading: hero?.heading ?? page.seo.title,
        sub: hero?.sub ?? '',
        source: join(pagesDir, f),
        noindex: page.seo.noindex === true,
        priority: page.seo.priority ?? 0.5,
      };
    });
  const services = readJson<ServicesJson>(join(CONTENT, 'services.json'))
    .services.filter((s) => !s.href)
    .map((s) => ({
      path: s.seo.path,
      title: s.seo.title,
      heading: s.name,
      sub: s.promise,
      source: join(CONTENT, 'services.json'),
      noindex: false,
      priority: s.seo.priority ?? 0.8,
    }));
  return [...pages, ...services].sort((a, b) => a.path.localeCompare(b.path));
}

/** cra-readiness → "cra-readiness"; "/" → "home" (OG image file names). */
export function slugFor(path: string): string {
  return path === '/' ? 'home' : path.slice(1).replace(/\//g, '-');
}

/** Last commit date of a file (ISO date), or today when it is not committed yet. */
export function gitDate(file: string): string {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', relative(ROOT, file)], { cwd: ROOT })
      .toString()
      .trim();
    if (out) return out;
  } catch {
    /* not a git checkout */
  }
  return new Date().toISOString().slice(0, 10);
}

/** Rendered site pages (downloads under /assets are not pages). */
export function htmlFiles(dir = DIST): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === 'assets' ? [] : htmlFiles(full);
    return name.endsWith('.html') && name !== 'index.csr.html' ? [full] : [];
  });
}

/** dist/.../product/index.html → /product */
export function pathOf(file: string): string {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  return '/' + rel.replace(/\/index\.html$/, '');
}

/** Visible text of a rendered page: scripts, styles and tags removed, entities decoded. */
export function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}

export function jsonLdBlocks(html: string): string[] {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1] ?? '');
}
