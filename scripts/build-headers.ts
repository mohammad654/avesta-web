/**
 * _headers (Netlify / Cloudflare Pages format) and _redirects (brief 6.3, 8.1 step 16).
 * CSP has no 'unsafe-inline' for scripts: the hash of every inline script in the prerendered
 * HTML is listed. JSON-LD and ng-state are data blocks, which CSP does not execute or block.
 * Styles keep 'unsafe-inline' because Angular adds component styles at runtime.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { CONTENT, DIST, SiteJson, domain, htmlFiles, readJson, resolveValues } from './lib/site';

const hashes = new Set<string>();
for (const file of htmlFiles()) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] ?? '';
    if (/type="application\/(ld\+)?json"/.test(attrs)) continue;
    hashes.add(
      `'sha256-${createHash('sha256')
        .update(m[2] ?? '')
        .digest('base64')}'`,
    );
  }
}

const site = readJson<SiteJson>(join(CONTENT, 'site.json'));
const endpoint = resolveValues(site.settings.formEndpoint);
const formOrigin = /^https:\/\//.test(endpoint) ? new URL(endpoint).origin : '';

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${formOrigin ? ' ' + formOrigin : ''}`,
  `form-action 'self'${formOrigin ? ' ' + formOrigin : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const staging = process.env['STAGING'] === '1';
const headers = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin${staging ? '\n  X-Robots-Tag: noindex' : ''}

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=604800

/.well-known/security.txt
  Content-Type: text/plain; charset=utf-8
`;
writeFileSync(join(DIST, '_headers'), headers);

// One canonical host: www → apex, permanent (HTTP → HTTPS is enforced by HSTS and the host).
const host = domain();
const redirects = host.includes('[') ? '' : `https://www.${host}/* https://${host}/:splat 301!\n`;
writeFileSync(join(DIST, '_redirects'), redirects);
console.log(
  `_headers written (${hashes.size} inline script hash(es)); _redirects ${redirects ? 'written' : 'empty until [DOMAIN] is set'}`,
);
