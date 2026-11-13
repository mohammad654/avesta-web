/** RFC 9116 /.well-known/security.txt (brief 2.1: we practise what we sell). Expires in one year. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT, DIST, SiteJson, domain, readJson, resolveValues } from './lib/site';

const site = readJson<SiteJson>(join(CONTENT, 'site.json'));
const origin = `https://${domain()}`;
const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000)
  .toISOString()
  .replace(/\.\d{3}Z$/, '.000Z');
const body = [
  `Contact: mailto:${resolveValues(site.settings.securityEmail)}`,
  `Expires: ${expires}`,
  'Preferred-Languages: en, nl',
  `Canonical: ${origin}/.well-known/security.txt`,
  `Policy: ${origin}/legal/disclosure`,
  '',
].join('\n');
mkdirSync(join(DIST, '.well-known'), { recursive: true });
writeFileSync(join(DIST, '.well-known/security.txt'), body);
console.log('.well-known/security.txt written');
