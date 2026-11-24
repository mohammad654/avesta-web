# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Avesta Tech company website. It is front end only: Angular 22 (standalone, zoneless, signals, OnPush), and every route is prerendered to static HTML (`outputMode: "static"`) with incremental hydration. Comments like "brief 8.2" refer to sections of the *Avesta Tech website build brief v1.0* (`../avesta-tech-website-brief.pdf`). Full architecture: `docs/ARCHITECTURE.md`. Open founder inputs: `docs/OWNER-REVIEW.md`.

## Commands

```bash
npm start                  # dev server (unfilled placeholders get a dashed outline)
npm run build              # ng build + scripts/postbuild.ts (sitemap, robots, security.txt, OG images, _headers, 404, budget + copy-rule checks)
npm run build:prod         # same, and fails while any placeholder remains (CI runs this on main only)
npm run build:staging      # noindex robots + X-Robots-Tag
npm run serve              # serve dist/ like the CDN on :4300 (clean URLs, real 404, _headers, Brotli)
npm run lint               # angular-eslint
npm test                   # Vitest via @angular/build:unit-test
npm run test:coverage      # thresholds: 90% statements/functions, 85% branches, on src/app/core and features/*/domain only
npm run e2e                # Playwright against the BUILT site: run `npm run build` first
npm run placeholders       # list placeholders that are still open
npm run sync:proof         # copy standards.json, CI snippet, sample report from the Avesta Proof repo
```

Single tests:

```bash
npx ng test --watch=false --include=app/features/cra-checker/domain   # path is relative to src/; a dir or file
npx ng test --watch=false --filter="^CRA scoring"                       # regex on suite/test names
npx playwright test e2e/seo.spec.ts -g "canonical"
```

E2E uses the `chrome` channel and reads its route list from `dist/avesta-web/browser/sitemap.xml`. A stale build means stale e2e results.

## Architecture

The layers depend inwards: `pages/` → `shared/sections/` and `features/` → `shared/ui/` → `core/`. Code in `features/*/domain/` is pure TypeScript with no Angular imports. Scoring, filtering and sorting live there and carry the coverage requirement.

**Content is data, never template text.** All copy lives in `src/content/*.json`. Components read it only through the `CONTENT_PROVIDER` token (`StaticContentProvider`). They never import JSON paths, `fetch` or `HttpClient` directly. Form posts go through the `FORM_GATEWAY` token. In tests, use `testProviders()` and `FakeContentProvider` from `src/app/testing/`.

**Per-route content loading.** Only `site.json` is in the initial bundle. A route's `pageResolver` calls `ContentLoader.ensure(keys)`, which dynamically imports that page's JSON and the data files it needs. After that, provider calls are synchronous. `contentKeysForPage()` in `core/content/content-keys.ts` derives the data keys from the page's section kinds and features. Each file is wired in three places:
- `PAGE_IDS` / `DataKey` in `content-keys.ts`
- a literal `import()` line in `content-loaders.ts` (the bundler needs literal paths)
- a route in `app.routes.ts`, plus `app.routes.server.ts` if the route is parameterized (`getPrerenderParams` reads service slugs and legal docs from content)

**Sections.** Pages are lists of `Section` items, a discriminated union on `kind` in `core/content/models/section.models.ts`. `SectionRendererComponent` renders the first hero eagerly (it is the LCP). It wraps every other section in `@defer (on idle; hydrate on viewport)` → `SectionSwitchComponent`, which is the registry of kinds. To add a section kind:
1. Add a union member.
2. Add a component in `shared/sections/`.
3. Add a case in `section-switch.component.ts`.
4. If the kind needs data, add it to `contentKeysForPage`.

Interactive features (`craChecker`, `standards`, `pipeline`, `sampleReport`, `pricing`, `contactForm`) are a `feature` section kind rendered by `FeatureHostComponent`.

**State.** State is signals only. Use `effect` solely for side effects such as URL sync and announcements. State that must survive a reload or be shareable (filters, tabs, billing period) is mirrored to query params via `core/routing/query-state.ts`.

**SEO.** `SeoService` writes meta, canonical, hreflang, OG and JSON-LD during prerender through the route resolver, so the tags land in the static HTML. JSON-LD builders in `core/seo/json-ld.builders.ts` are pure functions and drop any property whose value is still a placeholder.

## Rules the build enforces

- **Placeholders**: tokens like `[KVK_NUMBER]` stay in content as visible strings. Their values are filled only in `site.json → placeholders`. Setting a `CONFIRM_*` key to `-` removes the token and keeps the sentence. Unfilled tokens render through `PhTagComponent`. Don't invent values for placeholders.
- **Copy rules** (`scripts/check-copy-rules.ts`, which runs on the rendered HTML):
  - The words "certified", "compliant", "guaranteed", "military-grade" and the phrase "100% secure" are banned outside legal pages and FAQ `G2`.
  - The founder closing line appears exactly once, on Home only.
  - Any page that mentions a CRA date or amount must also carry "Dates and amounts: verify with counsel."
- **Budgets** (`scripts/check-budgets.ts`): initial JS + CSS gzip warns at 170 KB and fails at 220 KB. The largest lazy chunk warns at 60 KB raw and fails at 90 KB. Don't pull section or feature code into the initial bundle.
- **Synced files**: `standards.json`, `sample-report*.json` and `snippets/` come from Avesta Proof via `npm run sync:proof`. Don't hand-edit them.
- **ESLint**:
  - Components must be OnPush and standalone, use signal inputs, and use built-in control flow (`@if` / `@for`, not `*ngIf`).
  - Selectors use the `app` prefix.
  - No `any`.
  - `max-lines` is 200 per `.ts` file and 120 per `.html` template. Spec, e2e and script files are exempt. Split a component rather than raise the limit.
- **Deploy output**: `dist/avesta-web/browser` is a static site. `_headers` (CSP with script hashes, HSTS) and `_redirects` use the Netlify / Cloudflare Pages format. `build-headers.ts` computes the CSP, and its `connect-src` follows `FORM_ENDPOINT`. Inline scripts need their hashes regenerated by the build, so don't hand-edit `_headers` in `dist`.
