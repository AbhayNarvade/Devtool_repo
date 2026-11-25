import { lineColumn } from './convert';

export interface JsonSyntaxIssue {
  message: string;
  position: number;
  line: number;
  column: number;
}

/**
 * Locate the first syntax error in a JSON text with a precise, browser-independent
 * message and 1-based line/column. Returns null if the text is valid JSON.
 * (Native JSON.parse error messages differ between browsers and some omit the position.)
 */
export function findJsonError(text: string): JsonSyntaxIssue | null {
  let i = 0;
  const len = text.length;

  class Stop extends Error {
    constructor(
      public readonly msg: string,
      public readonly pos: number,
    ) {
      super(msg);
    }
  }

  const describe = (pos: number) => {
    if (pos >= len) return 'end of input';
    const ch = text[pos]!;
    if (ch === "'") return 'single quote';
    if (ch === '\n') return 'line break';
    return `"${ch}"`;
  };
  const stop = (msg: string, pos = i): never => {
    throw new Stop(msg, pos);
  };
  const ws = () => {
    while (i < len) {
      const c = text.charCodeAt(i);
      if (c === 32 || c === 9 || c === 10 || c === 13) i++;
      else break;
    }
  };

  const parseString = () => {
    const start = i;
    i++; // opening quote
    while (i < len) {
      const c = text.charCodeAt(i);
      if (c === 34) {
        i++;
        return;
      }
      if (c === 92) {
        const next = text[i + 1];
        if (next === undefined) stop('Unterminated string', start);
        if ('"\\/bfnrt'.includes(next!)) {
          i += 2;
          continue;
        }
        if (next === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6)))
            stop('Invalid \\u escape: expected 4 hexadecimal digits', i);
          i += 6;
          continue;
        }
        stop(`Invalid escape sequence "\\${next}"`, i);
      }
      if (c < 32)
        stop('Unescaped control character in string (use \\n for a line break, \\t for a tab)', i);
      i++;
    }
    stop('Unterminated string: missing closing double quote', start);
  };

  const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

  const parseValue = (): void => {
    ws();
    if (i >= len) stop('Unexpected end of input: a value was expected');
    const ch = text[i]!;
    if (ch === '{') return parseObject();
    if (ch === '[') return parseArray();
    if (ch === '"') return parseString();
    if (ch === "'") stop('Strings must use double quotes, not single quotes');
    if (ch === '-' || (ch >= '0' && ch <= '9')) {
      NUMBER.lastIndex = i;
      const m = NUMBER.exec(text);
      if (!m) stop('Invalid number');
      i += m![0].length;
      if (i < len && /[0-9.eE+\-xXa-fA-F]/.test(text[i]!))
        stop('Invalid number (leading zeros, hex and trailing dots are not allowed)', i);
      return;
    }
    for (const lit of ['true', 'false', 'null']) {
      if (text.startsWith(lit, i)) {
        i += lit.length;
        return;
      }
    }
    if (/^(?:undefined|NaN|Infinity|True|False|None|TRUE|FALSE|NULL)\b/.test(text.slice(i)))
      stop(
        `Unexpected ${text.slice(i).match(/^\w+/)![0]}: JSON only allows true, false and null literals`,
      );
    stop(`Unexpected ${describe(i)}: a value was expected`);
  };

  const parseObject = () => {
    i++; // {
    ws();
    if (text[i] === '}') {
      i++;
      return;
    }
    for (;;) {
      ws();
      if (text[i] === '}') stop('Trailing comma before "}" is not allowed in JSON');
      if (text[i] !== '"') {
        if (text[i] === "'") stop('Property names must use double quotes, not single quotes');
        if (i >= len) stop('Unexpected end of input: object is not closed with "}"');
        stop(`Expected a double-quoted property name but found ${describe(i)}`);
      }
      parseString();
      ws();
      if (text[i] !== ':') stop(`Expected ":" after property name but found ${describe(i)}`);
      i++;
      parseValue();
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === '}') {
        i++;
        return;
      }
      if (i >= len) stop('Unexpected end of input: object is not closed with "}"');
      stop(`Expected "," or "}" after property value but found ${describe(i)}`);
    }
  };

  const parseArray = () => {
    i++; // [
    ws();
    if (text[i] === ']') {
      i++;
      return;
    }
    for (;;) {
      ws();
      if (text[i] === ']') stop('Trailing comma before "]" is not allowed in JSON');
      parseValue();
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === ']') {
        i++;
        return;
      }
      if (i >= len) stop('Unexpected end of input: array is not closed with "]"');
      stop(`Expected "," or "]" after array item but found ${describe(i)}`);
    }
  };

  try {
    ws();
    if (i >= len) stop('The input is empty');
    parseValue();
    ws();
    if (i < len) stop(`Unexpected ${describe(i)} after the end of the JSON value`);
    return null;
  } catch (e) {
    if (e instanceof Stop) {
      return { message: e.msg, position: e.pos, ...lineColumn(text, e.pos) };
    }
    throw e;
  }
}

export type JsonParseResult = { ok: true; value: unknown } | { ok: false; issue: JsonSyntaxIssue };

/** Parse JSON (BOM tolerated). On failure, returns a located, human-friendly issue. */
export function parseJson(text: string): JsonParseResult {
  const clean = text.replace(/^﻿/, '');
  try {
    return { ok: true, value: JSON.parse(clean) };
  } catch (e) {
    const issue = findJsonError(clean) ?? {
      message: e instanceof Error ? e.message : 'Invalid JSON',
      position: 0,
      line: 1,
      column: 1,
    };
    return { ok: false, issue };
  }
}

/** Recursively sort object keys (arrays keep their order). */
export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort((a, b) => a.localeCompare(b, 'en'))) {
      out[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

export type Indent = '2' | '4' | 'tab';

export function indentValue(indent: Indent): string | number {
  return indent === 'tab' ? '\t' : Number(indent);
}
