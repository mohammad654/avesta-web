/**
 * Local static server that behaves like the CDN: clean URLs, 404.html with status 404, the
 * _headers rules, and Brotli/gzip. Used for e2e tests and Lighthouse. PORT (default 4300).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { DIST } from './lib/site';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.md': 'text/markdown; charset=utf-8',
  '.sarif': 'application/json',
  '.pub': 'text/plain; charset=utf-8',
};
const COMPRESS = new Set([
  '.html',
  '.js',
  '.css',
  '.json',
  '.svg',
  '.xml',
  '.txt',
  '.webmanifest',
  '.md',
  '.sarif',
]);

/** Parses _headers into [pattern, headers] rules (re-read per request, so rebuilds apply). */
function rules(): [RegExp, [string, string][]][] {
  const file = join(DIST, '_headers');
  if (!existsSync(file)) return [];
  const out: [RegExp, [string, string][]][] = [];
  for (const block of readFileSync(file, 'utf8').split(/\n(?=\/)/)) {
    const [pattern, ...lines] = block.trim().split('\n');
    if (!pattern) continue;
    const re = new RegExp(
      '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$',
    );
    out.push([
      re,
      lines
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]),
    ]);
  }
  return out;
}

function resolveFile(urlPath: string): { file: string; status: number } {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [
    join(DIST, clean),
    join(DIST, clean, 'index.html'),
    join(DIST, `${clean}.html`),
  ];
  const hit = candidates.find((c) => c.startsWith(DIST) && existsSync(c) && statSync(c).isFile());
  return hit ? { file: hit, status: 200 } : { file: join(DIST, '404.html'), status: 404 };
}

const port = Number(process.env['PORT'] ?? 4300);
createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const { file, status } = resolveFile(url.pathname);
  const ext = extname(file);
  let body: Buffer = readFileSync(file);
  res.statusCode = status;
  res.setHeader('Content-Type', TYPES[ext] ?? 'application/octet-stream');
  for (const [re, headers] of rules()) {
    if (re.test(url.pathname))
      for (const [k, v] of headers)
        if (k !== 'Strict-Transport-Security' && !v.includes('upgrade-insecure'))
          res.setHeader(k, v);
    if (re.test(url.pathname))
      for (const [k, v] of headers)
        if (k === 'Content-Security-Policy')
          res.setHeader(k, v.replace('; upgrade-insecure-requests', ''));
  }
  const accept = String(req.headers['accept-encoding'] ?? '');
  if (COMPRESS.has(ext)) {
    if (accept.includes('br')) {
      body = brotliCompressSync(body);
      res.setHeader('Content-Encoding', 'br');
    } else if (accept.includes('gzip')) {
      body = gzipSync(body);
      res.setHeader('Content-Encoding', 'gzip');
    }
    res.setHeader('Vary', 'Accept-Encoding');
  }
  res.setHeader('Content-Length', body.length);
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, () => console.log(`Serving ${DIST} on http://localhost:${port}`));
