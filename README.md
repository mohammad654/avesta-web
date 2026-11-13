# Avesta Tech website

Company website for Avesta Tech: front end only, Angular 22 (standalone, zoneless, signals,
OnPush), every route prerendered to static HTML. Built to the *Avesta Tech website build brief
v1.0*. Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). What the founder still has to
fill in or confirm: [docs/OWNER-REVIEW.md](docs/OWNER-REVIEW.md).

## Editing content

All copy and data live in `src/content/` (JSON). Never edit text in components.

| File | Holds |
| --- | --- |
| `site.json` | Navigation, footer, shared microcopy, **placeholder values** |
| `pages/*.json` | One file per page: SEO and sections |
| `services.json`, `pricing.json`, `faq.json`, `cra-checker.json` | Services, plans, FAQ, CRA checker |
| `features/*.json` | Labels for the interactive features |
| `standards.json`, `sample-report.json`, `snippets/` | Copied from Avesta Proof by `npm run sync:proof` |

Placeholders such as `[KVK_NUMBER]` are filled once in `site.json → placeholders`. Set a
`CONFIRM_*` key to `-` to confirm the sentence it flags. `npm run placeholders` lists what is open.

## Commands

| Command | Does |
| --- | --- |
| `npm start` | Dev server with live reload (placeholders get a dashed outline) |
| `npm run build` | Prerender, then sitemap, robots, security.txt, OG images, `_headers`, budget and copy-rule checks |
| `npm run build:prod` | Same, and **fails while any placeholder remains** (brief 8.2) |
| `npm run build:staging` | Same as build, with `noindex` robots and `X-Robots-Tag` |
| `npm run serve` | Serve `dist/` like the CDN (clean URLs, 404 status, headers, Brotli) on :4300 |
| `npm run lint` / `npm test` / `npm run test:coverage` | ESLint (angular-eslint) / Vitest / coverage (≥ 90% on core and domain) |
| `npm run e2e` | Playwright: smoke, axe, SEO and feature tests against the built site |
| `npm run lighthouse` | Lighthouse (mobile) on every route; writes `lighthouse/summary.json` |
| `npm run sync:proof` | Copy `frameworks.json`, the CI example and (with `SAMPLE_REPORT_DIR`) the demo report from Avesta Proof |

## Deploying

`dist/avesta-web/browser` is a static site. `_headers` (CSP with script hashes, HSTS, caching) and
`_redirects` use the Netlify / Cloudflare Pages format; translate them if the host differs.
Serve `404.html` with status 404 for unknown paths.
