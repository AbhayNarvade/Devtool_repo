import { Base64Error, base64ToBytes, bytesToUtf8 } from '@/lib/base64';

export type JwtStatus = 'valid' | 'expired' | 'not-yet-valid' | 'no-expiry';

export interface JwtTime {
  claim: 'exp' | 'iat' | 'nbf';
  label: string;
  seconds: number;
  iso: string;
}

export type JwtResult =
  | {
      ok: true;
      header: Record<string, unknown>;
      payload: unknown;
      signature: string;
      times: JwtTime[];
      status: JwtStatus;
      /** Seconds until expiry (negative when expired). */
      expiresIn?: number;
      warnings: string[];
    }
  | { ok: false; message: string };

const TIME_LABELS: Record<JwtTime['claim'], string> = {
  exp: 'Expires (exp)',
  iat: 'Issued at (iat)',
  nbf: 'Not before (nbf)',
};

function decodePart(part: string, name: 'header' | 'payload'): unknown {
  let bytes: Uint8Array;
  try {
    bytes = base64ToBytes(part);
  } catch (e) {
    throw new Error(
      `The ${name} is not valid Base64URL: ${e instanceof Base64Error ? e.message : 'decoding failed'}`,
    );
  }
  const text = bytesToUtf8(bytes);
  if (text === null) throw new Error(`The ${name} is not valid UTF-8 text.`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`The ${name} decodes to text that is not valid JSON.`);
  }
}

/**
 * Decode (NOT verify) a JSON Web Token. The signature is returned as-is; verifying it requires
 * the secret or public key and must be done by the server that trusts the token.
 */
export function decodeJwt(input: string, nowMs: number = Date.now()): JwtResult {
  const token = input.trim().replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, message: 'Paste a token to decode it.' };
  const parts = token.split('.');
  if (parts.length === 5) {
    return {
      ok: false,
      message:
        'This looks like an encrypted JWT (JWE, five parts). Its payload is encrypted and cannot be read without the decryption key.',
    };
  }
  if (parts.length !== 3) {
    return {
      ok: false,
      message: `A JWT has three parts separated by dots (header.payload.signature); this input has ${parts.length}.`,
    };
  }
  const [h = '', p = '', signature = ''] = parts;
  let header: unknown;
  let payload: unknown;
  try {
    header = decodePart(h, 'header');
    payload = decodePart(p, 'payload');
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
  if (!header || typeof header !== 'object' || Array.isArray(header)) {
    return { ok: false, message: 'The header must be a JSON object.' };
  }

  const warnings: string[] = [];
  const alg = (header as Record<string, unknown>).alg;
  if (typeof alg === 'string' && alg.toLowerCase() === 'none') {
    warnings.push(
      'The algorithm is "none": this token is unsigned and must never be accepted by a server.',
    );
  }
  if (!signature && alg !== 'none') warnings.push('The signature part is empty.');

  const claims =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : {};
  const times: JwtTime[] = [];
  for (const claim of ['iat', 'nbf', 'exp'] as const) {
    const v = claims[claim];
    if (typeof v === 'number' && Number.isFinite(v)) {
      const d = new Date(v * 1000);
      if (!Number.isNaN(d.getTime()))
        times.push({ claim, label: TIME_LABELS[claim], seconds: v, iso: d.toISOString() });
    } else if (v !== undefined) {
      warnings.push(
        `"${claim}" should be a number of seconds since 1970 (NumericDate), but it is ${JSON.stringify(v)}.`,
      );
    }
  }
  const exp = typeof claims.exp === 'number' ? claims.exp : undefined;
  const nbf = typeof claims.nbf === 'number' ? claims.nbf : undefined;
  const now = nowMs / 1000;
  let status: JwtStatus = 'no-expiry';
  if (nbf !== undefined && now < nbf) status = 'not-yet-valid';
  else if (exp !== undefined) status = now >= exp ? 'expired' : 'valid';
  if (exp !== undefined && exp > 1e11) {
    warnings.push(
      '"exp" looks like milliseconds; JWT times must be in seconds, so this token may never expire as intended.',
    );
  }

  return {
    ok: true,
    header: header as Record<string, unknown>,
    payload,
    signature,
    times,
    status,
    expiresIn: exp !== undefined ? Math.round(exp - now) : undefined,
    warnings,
  };
}

/** "2 hours 5 minutes" style duration for the expiry badge. */
export function humanDuration(totalSeconds: number): string {
  let s = Math.abs(Math.round(totalSeconds));
  const units: [string, number][] = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  const out: string[] = [];
  for (const [name, size] of units) {
    const n = Math.floor(s / size);
    if (n > 0) {
      out.push(`${n} ${name}${n === 1 ? '' : 's'}`);
      s -= n * size;
    }
    if (out.length === 2) break;
  }
  return out.length ? out.join(' ') : '0 seconds';
}
