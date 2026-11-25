/**
 * Minimal static server for /out that mimics Cloudflare Pages:
 * "/about" -> about.html, "/x/" -> redirect to "/x", unknown paths -> 404.html with status 404,
 * and headers from public/_headers. Usage: npm run preview [-- --port 3000]
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '..', 'out');
const portArg = process.argv.indexOf('--port');
const PORT = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 3000);

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
};

// Parse _headers (path patterns with a trailing * wildcard only).
const rules: { pattern: string; headers: [string, string][] }[] = [];
const headersFile = path.join(OUT, '_headers');
if (existsSync(headersFile)) {
  let current: (typeof rules)[number] | null = null;
  for (const line of readFileSync(headersFile, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
    } else if (current) {
      const idx = line.indexOf(':');
      current.headers.push([line.slice(0, idx).trim(), line.slice(idx + 1).trim()]);
    }
  }
}
function headersFor(urlPath: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rules) {
    const match = r.pattern.endsWith('*')
      ? urlPath.startsWith(r.pattern.slice(0, -1))
      : urlPath === r.pattern;
    if (match) for (const [k, v] of r.headers) out[k] = v;
  }
  return out;
}

function resolveFile(urlPath: string): string | null {
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  for (const c of [rel, `${rel}.html`, path.join(rel, 'index.html')]) {
    const full = path.join(OUT, c);
    if (full.startsWith(OUT) && existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let p: string;
  try {
    p = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad request');
    return;
  }
  if (p.length > 1 && p.endsWith('/')) {
    res.writeHead(308, { Location: p.replace(/\/+$/, '') + url.search });
    res.end();
    return;
  }
  const file = resolveFile(p);
  const status = file ? 200 : 404;
  const served = file ?? path.join(OUT, '404.html');
  res.writeHead(status, {
    'Content-Type': TYPES[path.extname(served)] ?? 'application/octet-stream',
    ...headersFor(p),
  });
  createReadStream(served).pipe(res);
}).listen(PORT, () => console.log(`Serving ${OUT} at http://localhost:${PORT}`));
