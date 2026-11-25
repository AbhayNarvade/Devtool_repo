/**
 * npm run test:browser — real-browser smoke test of the static export (run after `npm run build`).
 *
 * Starts the Cloudflare-like preview server, launches headless Chrome via the DevTools protocol,
 * and for every URL in sitemap.xml (plus a missing URL for the 404 page):
 *  - fails on any console error/warning, uncaught exception or failed request;
 *  - on tool pages, clicks "Load sample" and checks that output appears without an error alert.
 *
 * Chrome path: $CHROME_PATH, or google-chrome / chromium on PATH.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { SITE_URL } from '../src/config/site';
import { tools } from '../src/data';
import { toolPath } from '../src/lib/routes';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = 4391;
const DEBUG_PORT = 9391;
const BASE = `http://localhost:${PORT}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function chromePath(): string {
  return process.env.CHROME_PATH || 'google-chrome';
}

async function waitFor(url: string, tries = 50): Promise<Response> {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch {
      // not ready yet
    }
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  private id = 0;
  private pending = new Map<
    number,
    (msg: { result?: unknown; error?: { message: string } }) => void
  >();
  private listeners: ((method: string, params: Record<string, unknown>) => void)[] = [];
  constructor(private ws: WebSocket) {
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(String(ev.data)) as {
        id?: number;
        method?: string;
        params?: Record<string, unknown>;
        result?: unknown;
        error?: { message: string };
      };
      if (msg.id !== undefined) this.pending.get(msg.id)?.(msg);
      else if (msg.method) for (const l of this.listeners) l(msg.method, msg.params ?? {});
    });
  }
  static async connect(url: string) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    return new Cdp(ws);
  }
  send<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, (msg) => {
        this.pending.delete(id);
        if (msg.error) reject(new Error(`${method}: ${msg.error.message}`));
        else resolve(msg.result as T);
      });
    });
  }
  /** Subscribe to CDP events; returns an unsubscribe function. */
  on(listener: (method: string, params: Record<string, unknown>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  close() {
    this.ws.close();
  }
}

async function evaluate<T>(cdp: Cdp, expression: string): Promise<T> {
  const r = await cdp.send<{ result: { value: T }; exceptionDetails?: { text: string } }>(
    'Runtime.evaluate',
    {
      expression,
      awaitPromise: true,
      returnByValue: true,
    },
  );
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
}

async function main() {
  const procs: ChildProcess[] = [];
  const profile = mkdtempSync(path.join(tmpdir(), 'smoke-chrome-'));
  const failures: string[] = [];
  try {
    procs.push(
      spawn(
        process.execPath,
        [
          path.join(ROOT, 'node_modules/tsx/dist/cli.mjs'),
          'scripts/serve-out.ts',
          '--port',
          String(PORT),
        ],
        {
          cwd: ROOT,
          stdio: 'ignore',
        },
      ),
    );
    await waitFor(`${BASE}/`);
    procs.push(
      spawn(
        chromePath(),
        [
          '--headless=new',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          `--remote-debugging-port=${DEBUG_PORT}`,
          `--user-data-dir=${profile}`,
          'about:blank',
        ],
        { stdio: 'ignore' },
      ),
    );
    const version = (await (
      await waitFor(`http://127.0.0.1:${DEBUG_PORT}/json/version`)
    ).json()) as {
      webSocketDebuggerUrl: string;
    };
    const browser = await Cdp.connect(version.webSocketDebuggerUrl);
    const { targetId } = await browser.send<{ targetId: string }>('Target.createTarget', {
      url: 'about:blank',
    });
    const targets = (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json()) as {
      id: string;
      webSocketDebuggerUrl: string;
    }[];
    const page = await Cdp.connect(targets.find((t) => t.id === targetId)!.webSocketDebuggerUrl);

    let problems: string[] = [];
    page.on((method, params) => {
      if (method === 'Runtime.consoleAPICalled') {
        const type = String(params.type);
        if (type === 'error' || type === 'warning' || type === 'assert') {
          const args = (params.args as { value?: unknown; description?: string }[]) ?? [];
          problems.push(`console.${type}: ${args.map((a) => a.value ?? a.description).join(' ')}`);
        }
      } else if (method === 'Runtime.exceptionThrown') {
        const d = params.exceptionDetails as { text: string; exception?: { description?: string } };
        problems.push(`exception: ${d.exception?.description ?? d.text}`);
      } else if (method === 'Log.entryAdded') {
        const e = params.entry as { level: string; text: string; url?: string };
        if (e.level === 'error' || e.level === 'warning') {
          // The 404 page is expected to be served with a 404 status.
          if (!(e.url?.includes('/this-page-does-not-exist') && e.text.includes('404'))) {
            problems.push(`log.${e.level}: ${e.text}${e.url ? ` (${e.url})` : ''}`);
          }
        }
      }
    });
    await page.send('Runtime.enable');
    await page.send('Log.enable');
    await page.send('Page.enable');
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    const sitemap = readFileSync(path.join(ROOT, 'out', 'sitemap.xml'), 'utf8');
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1]!.slice(SITE_URL.length) || '/',
    );
    paths.push('/this-page-does-not-exist');
    const toolPaths = new Set(tools.map((t) => toolPath(t.category, t.slug)));

    for (const p of paths) {
      problems = [];
      let unsubscribe = () => {};
      const loaded = new Promise<void>((resolve) => {
        unsubscribe = page.on((method) => {
          if (method === 'Page.loadEventFired') resolve();
        });
      });
      await page.send('Page.navigate', { url: `${BASE}${p}` });
      await Promise.race([loaded, sleep(10_000)]);
      unsubscribe();
      await sleep(600);

      // No horizontal overflow on a 390px phone.
      const overflow = await evaluate<number>(
        page,
        'document.documentElement.scrollWidth - window.innerWidth',
      );
      if (overflow > 1)
        problems.push(`horizontal overflow of ${overflow}px on a 390px wide screen`);

      let toolNote = '';
      if (toolPaths.has(p)) {
        const outcome = await evaluate<string>(
          page,
          `(async () => {
            const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Load sample');
            if (!btn) return 'no-sample-button';
            btn.click();
            await new Promise((r) => setTimeout(r, 1500));
            const alert = document.querySelector('[data-tool-ui] [role="alert"]');
            if (alert) return 'error: ' + alert.textContent.trim();
            const outputs = [
              ...[...document.querySelectorAll('[data-tool-ui] textarea[readonly]')].map((t) => t.value),
              ...[...document.querySelectorAll('[data-tool-ui] [data-tool-output]')].map((el) => el.textContent ?? ''),
            ];
            return outputs.some((v) => v.trim().length > 0) ? 'ok' : 'empty-output';
          })()`,
        );
        if (outcome !== 'ok' && outcome !== 'no-sample-button')
          problems.push(`tool sample: ${outcome}`);
        toolNote =
          outcome === 'ok'
            ? ' (sample ok)'
            : outcome === 'no-sample-button'
              ? ' (no sample button)'
              : '';
      }

      if (problems.length) {
        failures.push(...problems.map((x) => `${p}: ${x}`));
        console.log(`  FAIL ${p}`);
        for (const x of problems) console.log(`       ${x}`);
      } else {
        console.log(`  ok   ${p}${toolNote}`);
      }
    }
    page.close();
    browser.close();
  } finally {
    for (const proc of procs) proc.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  }
  if (failures.length) {
    console.error(`\ntest:browser FAILED: ${failures.length} problem(s).`);
    process.exit(1);
  }
  console.log('\ntest:browser passed: no console errors or warnings.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
