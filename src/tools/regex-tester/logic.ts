export const REGEX_FLAGS = ['g', 'i', 'm', 's', 'u', 'y'] as const;
export type RegexFlag = (typeof REGEX_FLAGS)[number];

export const FLAG_LABELS: Record<RegexFlag, string> = {
  g: 'global',
  i: 'ignore case',
  m: 'multiline',
  s: 'dot matches newline',
  u: 'unicode',
  y: 'sticky',
};

/** Matches beyond this are not collected (protects the page from huge result lists). */
export const MAX_MATCHES = 1000;

export interface RegexMatch {
  index: number;
  end: number;
  text: string;
  groups: (string | undefined)[];
  named?: Record<string, string | undefined>;
}

export interface RegexRequest {
  pattern: string;
  flags: string;
  text: string;
  replacement?: string;
}

export type RegexResult =
  | { ok: true; matches: RegexMatch[]; truncated: boolean; replaced?: string; groupNames: string[] }
  | { ok: false; error: string };

export function runRegex(
  { pattern, flags, text, replacement }: RegexRequest,
  limit = MAX_MATCHES,
): RegexResult {
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags);
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error ? e.message.replace(/^Invalid regular expression: /, '') : String(e),
    };
  }
  const matches: RegexMatch[] = [];
  let truncated = false;
  const record = (m: RegExpExecArray) =>
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      text: m[0],
      groups: m.slice(1),
      named: m.groups ? { ...m.groups } : undefined,
    });

  if (re.global || re.sticky) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (matches.length >= limit) {
        truncated = true;
        break;
      }
      record(m);
      if (m[0].length === 0) {
        // Empty match: step forward (by a whole code point in unicode mode) to avoid an endless loop.
        const cp = re.unicode ? (text.codePointAt(re.lastIndex) ?? 0) : 0;
        re.lastIndex += cp > 0xffff ? 2 : 1;
      }
      if (!re.global) break;
    }
  } else {
    const m = re.exec(text);
    if (m) record(m);
  }

  const groupNames = [...pattern.matchAll(/\(\?<([A-Za-z_$][\w$]*)>/g)].map((g) => g[1]!);
  let replaced: string | undefined;
  if (replacement !== undefined) replaced = text.replace(new RegExp(pattern, flags), replacement);
  return { ok: true, matches, truncated, replaced, groupNames };
}

export interface Segment {
  text: string;
  /** Index of the match this segment belongs to, if any. */
  match?: number;
}

/** Split text into plain and matched segments for highlighting (empty matches are skipped). */
export function highlightSegments(text: string, matches: RegexMatch[]): Segment[] {
  const out: Segment[] = [];
  let pos = 0;
  matches.forEach((m, i) => {
    if (m.end === m.index || m.index < pos) return;
    if (m.index > pos) out.push({ text: text.slice(pos, m.index) });
    out.push({ text: text.slice(m.index, m.end), match: i });
    pos = m.end;
  });
  if (pos < text.length) out.push({ text: text.slice(pos) });
  return out;
}
