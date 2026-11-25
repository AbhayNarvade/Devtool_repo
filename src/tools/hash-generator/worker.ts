/// <reference lib="webworker" />
import { md5 } from 'js-md5';
import { toHex, type HashAlgorithm } from './logic';

// Hashes files off the main thread. The file is read in chunks so progress can be reported;
// MD5 is computed incrementally, SHA digests (Web Crypto has no streaming API) on the full buffer.
type Request = { id: number; file: File; algorithms: HashAlgorithm[] };
type Response =
  | { id: number; type: 'progress'; done: number; total: number }
  | { id: number; type: 'done'; results: Partial<Record<HashAlgorithm, string>> }
  | { id: number; type: 'error'; message: string };

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (message: Response) => void;
};

const CHUNK = 8 * 1024 * 1024;

ctx.onmessage = async (e) => {
  const { id, file, algorithms } = e.data;
  try {
    const wantsSha = algorithms.some((a) => a !== 'MD5');
    const whole = wantsSha ? new Uint8Array(file.size) : null;
    const md5Hasher = algorithms.includes('MD5') ? md5.create() : null;
    for (let offset = 0; offset < file.size; offset += CHUNK) {
      const chunk = new Uint8Array(await file.slice(offset, offset + CHUNK).arrayBuffer());
      md5Hasher?.update(chunk);
      whole?.set(chunk, offset);
      ctx.postMessage({
        id,
        type: 'progress',
        done: Math.min(file.size, offset + CHUNK),
        total: file.size,
      });
    }
    const results: Partial<Record<HashAlgorithm, string>> = {};
    if (md5Hasher) results.MD5 = md5Hasher.hex();
    for (const alg of algorithms) {
      if (alg !== 'MD5' && whole) results[alg] = toHex(await crypto.subtle.digest(alg, whole));
    }
    ctx.postMessage({ id, type: 'done', results });
  } catch (err) {
    ctx.postMessage({
      id,
      type: 'error',
      message:
        err instanceof Error
          ? err.message
          : 'The file could not be read (it may be too large for this device).',
    });
  }
};
