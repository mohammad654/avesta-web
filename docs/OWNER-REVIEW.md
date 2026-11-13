# Owner review: what the founder still needs to supply or confirm

Brief 8.1 step 18. `npm run build:prod` fails until every item in section 1 is filled. Run
`npm run placeholders` for the live list.

## 1. Placeholders (fill in `src/content/site.json` → `placeholders`)

Fill each value once; it is applied everywhere it appears. Leave it empty to keep it open.

| Key | What is needed | Appears on |
| --- | --- | --- |
| `DOMAIN` | Website domain, without `https://` | Canonical, OG, sitemap, robots, security.txt, JSON-LD |
| `CONFIRM_HOST` | Apex or www (brief recommends apex) | Hosting redirect (`_redirects`) |
| `KVK_NUMBER`, `BTW_NUMBER` | Chamber of Commerce number, VAT ID | Footer (every page), About, Imprint, JSON-LD |
| `CONFIRM_LEGAL_FORM` | Confirm "eenmanszaak" | Imprint |
| `BUSINESS_ADDRESS` | Business or correspondence address | Contact, Imprint, Privacy, JSON-LD |
| `EMAIL`, `PHONE`, `SECURITY_EMAIL` | General email, phone, security address | Contact, Imprint, Privacy, Trust, security.txt, form errors |
| `LINKEDIN_URL`, `FOUNDER_LINKEDIN_URL`, `GITHUB_URL` | Company page, founder profile, GitHub org | Footer, Contact, JSON-LD |
| `BOOKING_URL`, `FORM_ENDPOINT` | Calendar link; form backend URL (HTTPS, accepts JSON POST) | Contact; contact form and CRA "Email me this result" (CSP `connect-src` follows it) |
| `PRICE_COMMUNITY`, `PRICE_TEAM`, `PRICE_BUSINESS`, `ANNUAL_DISCOUNT`, `CONFIRM_THRESHOLD` | Plan prices go in `pricing.json` (`monthly`/`yearly` numbers); discount text and threshold confirmation here | Pricing |
| `PRICE_CRA_SCAN` … `PRICE_AI_TESTING`, `HOURLY_RATE` | Service prices go in `services.json` (`price.amount`); hourly rate here | Services, Pricing, Home CTA, Freelance |
| `NOTICE_PERIOD`, `CONFIRM_NOTICE_PERIOD`, `PAYMENT_TERMS`, `LIABILITY_CAP`, `CONFIRM_FORUM` | Commercial terms | Pricing FAQ P5, Keep-it-green, Terms |
| `ROADMAP_DATE`, `TRUST_ROADMAP_STATUS`, `CURRENT_VERSION` | Roadmap dates/status; Avesta Proof version (pyproject says 0.5.0) | Pricing "Coming" tags, Trust, JSON-LD |
| `LINK_OWN_TRUST_STATEMENT` | Avesta's own trust statement file | Trust |
| `RETENTION_PERIOD`, `PROCESSORS_LIST`, `RESPONSE_DAYS`, `CONFIRM_RESPONSE_TIME` | Data retention, sub-processors, disclosure reply time (SECURITY.md says 3), contact reply time | Trust, Privacy, Disclosure, Contact |
| `NAME_STORY` | What "Avesta" means to you | About |
| `CONFIRM_EMPLOYER_NAMES`, `CONFIRM_TITLE`, `CONFIRM_QUOTE`, `FOUNDER_PHOTO` | Permission to name Capgemini Engineering / ASML and the 70% figure; title; quote; photo path (e.g. `/assets/img/founder.jpg`, 4:5) | About, Freelance |
| `AVAILABLE_FROM`, `DAYS_PER_WEEK`, `CV_PDF`, `CONFIRM_PLAYWRIGHT`, `ISTQB_STATUS`, `CONFIRM_MODEL_AGREEMENT` | Freelance details; CV path (e.g. `/assets/cv.pdf`); ISTQB stays hidden until filled | Freelance |
| `CONFIRM_LANGUAGE_REVIEWERS` | Who reviews Dutch, Arabic and Turkish cases | AI assistant testing |
| `HOSTING_PROVIDER`, `ANALYTICS_TOOL`, `A11Y_STATEMENT_DATE` | Host; analytics (none by default); statement date | Legal |
| `LEGAL_REVIEW` | New key: replace with the review line once a Dutch lawyer has reviewed the legal pages | All six legal pages |

`CONFIRM_*` keys mark copy that is already written and needs a yes. To confirm, set the value
to `-`: the token disappears and the sentence stays as written. The same works for any key whose
text should simply be removed.

## 2. Content the brief did not provide (shown only where it exists)

- **Service details.** "How it runs" steps exist only for the CRA Readiness Scan; "Who it is for"
  is missing for Keep-it-green, Accessibility audit and AI assistant testing; delivery time is
  known only for the CRA scan and Quality Scan (5 working days). Empty blocks are hidden.
- **Service FAQs.** The brief promises 3 to 5 service-specific FAQs but gives none. Each service
  reuses relevant existing FAQ items (CRA scan: C1, C3, C4, G3, P4; others: G6, P3, P4). Write
  service-specific ones in `faq.json` and list their ids in `services.json`.
- **Community "Get started".** No download URL was given; it links to `/contact?topic=demo`.

## 3. Copy I had to add (please approve or rewrite; all in `src/content/`)

Section headings needed for accessibility where the brief had only block labels: "Frequently
asked questions", "Services", "Values", "What I do", "What runs", "Control status legend",
"Credentials", "Company facts" (visually hidden), "From commit to signed evidence in eight steps."
(from the meta description). Feature UI labels (filters, tabs, sort, "Showing x of y", "Pause"/
"Play", calculator lines, "Email me this result" form text, error summary heading). One sentence
on About, allowed by the brief: "The logo draws on the Kurdish Farenji (فەرنجی) pattern, woven
layers and a gold sun." Legal pages are drafts written to the brief's structure.

## 4. Sample report

`src/content/sample-report.json` and `public/assets/sample-report/` hold a real Avesta Proof 0.5.0
scan of a purpose-built "Demo Controller" project (score 68, grade C, 10 findings), signed with a
throwaway demo key whose public key is published with it. Scan date and fingerprint differ from
the brief. To use your original demo files: `SAMPLE_REPORT_DIR=… npm run sync:proof`.

## 5. Checks only you (or production) can do

Legal review; keyboard and screen-reader passes (NVDA + Firefox, VoiceOver + Safari);
securityheaders.com on staging; Search Console / Bing submission; Rich Results Test on the live
URL; an Avesta Proof scan of this repository attached to the release.
