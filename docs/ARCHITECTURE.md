# Avesta Tech website: architecture note

Front end only. Angular 22, standalone components, zoneless, signals, built-in control flow,
strict TypeScript. Every route is prerendered to static HTML (`outputMode: "static"`) and
hydrated incrementally on the client. There is no backend: all copy and data are typed
local files in `src/content/`, and the only network calls are the contact and "email me this
result" form posts to `[FORM_ENDPOINT]`.

## Layers

| Layer | Folder | Responsibility |
| --- | --- | --- |
| Content | `src/content/` | All copy and data (JSON). Founder edits text here, never in code. |
| Core | `src/app/core/` | Content provider, SEO, layout shell, accessibility helpers, routing helpers. |
| Shared | `src/app/shared/` | Presentational UI (`ui/`) and the section components for the `Section` union (`sections/`). |
| Features | `src/app/features/` | The interactive features. Each has a pure `domain/` (unit tested) and a `ui/`. |
| Pages | `src/app/pages/` | Thin route components that compose sections. |

Dependencies point inwards: pages → sections/features → shared UI → core. Domain code
(`features/*/domain`) is plain TypeScript with no Angular imports.

## Content flow (dependency inversion)

```
route (data.pageId) ──► contentResolver ──► ContentLoader.ensure(keys)   (lazy JSON chunk)
                                         └► SeoService.apply(seo, jsonLd)
page component ──► inject(CONTENT_PROVIDER).page(id)  (synchronous, typed)
```

* `CONTENT_PROVIDER` (interface `ContentProvider`, brief 7.4) is the only way components
  read content. `StaticContentProvider` implements it with JSON imported at build time.
  A CMS later means a new `CmsContentProvider` and one line in `app.config.ts`.
* To keep the initial bundle inside the 170 KB budget, page content is split per route:
  `CONTENT_LOADER.ensure([...])` dynamically imports the JSON for a route before it renders
  (prerender and client). After that, every `ContentProvider` call stays synchronous, as the
  brief requires. Only `site.json` (navigation, footer, shared microcopy) is in the initial bundle.
* Placeholders such as `[KVK_NUMBER]` live in the content as visible strings. Their values are
  filled in one place, `site.json → placeholders`. The provider resolves filled values when it
  loads content; unfilled ones stay visible and are rendered by `PhTagComponent` (dashed
  outline in development). `scripts/check-placeholders.ts` fails `build:prod` while any remain.

## Rendering

* `app.routes.ts`: every page uses `loadComponent`. Content pages share one lazily loaded
  `ContentPageComponent` that renders `page.sections` through `SectionRendererComponent`
  (an `@switch` over the discriminated `Section.kind`: adding a section type means one new
  component and one new case). Service detail pages share `ServiceDetailComponent`.
* `app.routes.server.ts`: `RenderMode.Prerender` for every route; `getPrerenderParams` lists
  service slugs and legal documents from content. `/404` is prerendered and copied to `404.html`
  so static hosts answer unknown URLs with HTTP 404.
* Interactive features (CRA checker, standards explorer, pipeline, sample report, pricing,
  contact form) are wrapped in `@defer (on viewport; prefetch on idle; hydrate on viewport)`.
  With incremental hydration their markup is in the prerendered HTML (indexable, readable
  without JavaScript) and their code loads only when they scroll into view.
* State is signals only (`signal`, `computed`, `linkedSignal`); `effect` is used solely for
  side effects (URL sync, announcements). Feature state that must survive a reload or be
  shareable (filters, tabs, billing) is mirrored in query parameters.

## SEO

`SeoService` writes title, description, canonical, hreflang, robots, Open Graph and Twitter
tags and JSON-LD into `<head>` during prerender (via the route resolver, so the tags are in
the static HTML). JSON-LD builders (pure functions) produce Organization + WebSite (every
page), Person (about, freelance), SoftwareApplication (product), Service (service pages),
FAQPage (from the same `faq.json` that renders the accordion) and BreadcrumbList (every page
below the root). Properties whose value is still a placeholder are omitted.

Build scripts (run by `npm run build:prod` after `ng build`): sitemap, robots.txt,
security.txt, OG images, `_headers` (CSP with script hashes, HSTS, caching), 404 page,
copy rules (8.2) and the placeholder check.

## SOLID in practice

* **S**: pages compose; sections render; services load or compute; scoring, filtering and
  sorting are pure functions in `domain/`.
* **O**: new pages, services, FAQs and plans are content entries; components do not change.
* **L**: any `ContentProvider` returns the same typed shapes; tests use `FakeContentProvider`.
* **I**: small interfaces (`HasSeo`, `HasCta`, `HasFaq`); components take only the input slice they need.
* **D**: components depend on `CONTENT_PROVIDER`, `CONTENT_LOADER`, `SeoService` and
  `FORM_GATEWAY` tokens, never on file paths, `fetch` or `HttpClient` directly.

## Deviations from the brief (and why)

| Brief | Here | Reason |
| --- | --- | --- |
| `ContentProvider` loads all JSON synchronously | Same interface, plus `ContentLoader.ensure()` per route | Keeps the initial bundle under budget; calls stay synchronous after the route resolves. |
| Source `sample-report/report.json` ("Demo Controller", 68/C, 10 findings) | Real Avesta Proof 0.5.0 output of a purpose-built demo project, signed with a demo key | The demo files were not in the project. Score, grade, verdict and count match the brief; scan date and fingerprint come from the real file. Drop the original files into `src/content/` and `public/assets/sample-report/` to replace them. |
| NIS2 is in `frameworks.json` | Explorer shows the three standards named in the brief | Brief specifies three tabs. |
| `github-action.yml` used as is | The trailing optional "Hub" comment block is removed | The site makes no claims about the Hub; brief says there is no hosted dashboard. |
| Sections union (7.3) | Extended with `table`, `list`, `disclosure`, `founder`, `facts`, `code`, `featureRows`, `services` | Needed to render Chapter 3 without copy in templates. |
