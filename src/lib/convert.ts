/** Common result shape for text-in / text-out tools. */
export interface ConvertError {
  title: string;
  message: string;
  /** 1-based position, when known. */
  line?: number;
  column?: number;
}

export type ConvertResult =
  | { ok: true; output: string; info?: string; warnings?: string[] }
  | { ok: false; error: ConvertError };

export const ok = (
  output: string,
  extra: { info?: string; warnings?: string[] } = {},
): ConvertResult => ({
  ok: true,
  output,
  ...extra,
});

export const fail = (
  title: string,
  message: string,
  pos: { line?: number; column?: number } = {},
): ConvertResult => ({
  ok: false,
  error: { title, message, ...pos },
});

/** 1-based line and column for an offset in text. */
export function lineColumn(text: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lastBreak = -1;
  const end = Math.min(offset, text.length);
  for (let i = 0; i < end; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lastBreak = i;
    }
  }
  return { line, column: end - lastBreak };
}
