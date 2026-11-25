'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  Checkbox,
  ErrorAlert,
  InfoNote,
  TextArea,
  ToolPanel,
} from '@/components/tool/controls';
import {
  FLAG_LABELS,
  MAX_MATCHES,
  REGEX_FLAGS,
  highlightSegments,
  type RegexFlag,
  type RegexRequest,
  type RegexResult,
} from './logic';

/** A request that takes longer than this is treated as catastrophic backtracking and stopped. */
const TIMEOUT_MS = 2000;

const SAMPLE = {
  pattern: '(?<user>[\\w.+-]+)@(?<domain>[\\w-]+\\.[\\w.]+)',
  flags: ['g', 'i'] as RegexFlag[],
  text: 'Contact sales@example.com or support@help.example.org.\nInvalid: user@localhost, @nobody.com\nTeam: ana.lima+news@mail.example.net',
  replacement: '$<user> [at] $<domain>',
};

const CHEAT_SHEET: [string, string][] = [
  ['.', 'Any character except a line break (any character with the s flag)'],
  ['\\d \\w \\s', 'Digit, word character [A-Za-z0-9_], whitespace'],
  ['\\D \\W \\S', 'Not a digit, not a word character, not whitespace'],
  ['[abc] [^abc] [a-z]', 'One of, none of, range'],
  ['^ $', 'Start / end of input (of each line with the m flag)'],
  ['\\b \\B', 'Word boundary / not a word boundary'],
  ['* + ?', '0 or more, 1 or more, 0 or 1 (greedy)'],
  ['*? +? ??', 'Lazy versions: match as little as possible'],
  ['{3} {2,} {2,5}', 'Exactly 3, 2 or more, between 2 and 5'],
  ['(abc) (?:abc)', 'Capturing group / non-capturing group'],
  ['(?<name>abc) \\k<name>', 'Named group / back-reference to it'],
  ['a|b', 'a or b'],
  ['(?=x) (?!x)', 'Followed by x / not followed by x (lookahead)'],
  ['(?<=x) (?<!x)', 'Preceded by x / not preceded by x (lookbehind)'],
  ['$1 $<name> $&', 'In the replacement: group 1, named group, whole match'],
];

type Outcome = RegexResult | { ok: false; error: string; timeout: true };

class RegexRunner {
  private worker: Worker | null = null;
  private nextId = 0;

  run(request: RegexRequest): Promise<Outcome> {
    this.worker ??= new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    const worker = this.worker;
    const id = ++this.nextId;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        // Kill the stuck worker; a fresh one is created for the next request.
        worker.terminate();
        if (this.worker === worker) this.worker = null;
        resolve({
          ok: false,
          timeout: true,
          error: `Matching took longer than ${TIMEOUT_MS / 1000} seconds and was stopped. The pattern probably causes catastrophic backtracking (nested quantifiers such as (a+)+). Make the pattern more specific.`,
        });
      }, TIMEOUT_MS);
      worker.onmessage = (e: MessageEvent<{ id: number; result: RegexResult }>) => {
        if (e.data.id !== id) return;
        clearTimeout(timer);
        resolve(e.data.result);
      };
      worker.postMessage({ id, request });
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
  }
}

export default function RegexTesterTool() {
  const id = useId();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<RegexFlag[]>(['g']);
  const [text, setText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [result, setResult] = useState<Outcome | null>(null);
  const runner = useRef<RegexRunner | null>(null);

  useEffect(() => {
    runner.current = new RegexRunner();
    return () => runner.current?.dispose();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      if (!pattern) {
        if (!cancelled) setResult(null);
        return;
      }
      const r = await runner.current?.run({ pattern, flags: flags.join(''), text, replacement });
      if (!cancelled && r) setResult(r);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [pattern, flags, text, replacement]);

  const ok = result?.ok ? result : null;
  const segments = ok ? highlightSegments(text, ok.matches) : [];
  const groupCount = ok ? Math.max(0, ...ok.matches.map((m) => m.groups.length)) : 0;

  return (
    <ToolPanel>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${id}-pattern`} className="mb-1 block text-sm font-semibold">
            Regular expression
          </label>
          <div className="flex items-center rounded-lg border border-border-strong bg-card font-mono focus-within:border-accent">
            <span className="pl-3 text-fg-muted" aria-hidden="true">
              /
            </span>
            <input
              id={`${id}-pattern`}
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="e.g. \d{3}-\d{4}"
              aria-invalid={result ? !result.ok : undefined}
              className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[0.95rem] outline-none"
            />
            <span className="pr-3 text-fg-muted" aria-hidden="true">
              /{flags.join('')}
            </span>
          </div>
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Flags</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {REGEX_FLAGS.map((f) => (
              <Checkbox
                key={f}
                label={`${f} (${FLAG_LABELS[f]})`}
                checked={flags.includes(f)}
                onChange={(on) =>
                  setFlags((cur) => REGEX_FLAGS.filter((x) => (x === f ? on : cur.includes(x))))
                }
              />
            ))}
          </div>
        </fieldset>
        <TextArea label="Test string" value={text} onChange={setText} rows={7} />
        <div>
          <label htmlFor={`${id}-replace`} className="mb-1 block text-sm font-semibold">
            Replace with (optional)
          </label>
          <input
            id={`${id}-replace`}
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            spellCheck={false}
            placeholder="e.g. $2, $1 or $<name>"
            className="h-10 w-full rounded-lg border border-border-strong bg-card px-3 font-mono text-[0.95rem] focus:border-accent"
          />
        </div>
        <ActionBar>
          <Button
            icon="file"
            size="sm"
            onClick={() => {
              setPattern(SAMPLE.pattern);
              setFlags(SAMPLE.flags);
              setText(SAMPLE.text);
              setReplacement(SAMPLE.replacement);
            }}
          >
            Load sample
          </Button>
          <Button
            icon="trash"
            size="sm"
            variant="ghost"
            onClick={() => {
              setPattern('');
              setText('');
              setReplacement('');
            }}
            disabled={!pattern && !text && !replacement}
          >
            Clear
          </Button>
          {pattern ? (
            <CopyButton text={`/${pattern}/${flags.join('')}`} size="sm" label="Copy regex" />
          ) : null}
        </ActionBar>
      </div>

      <div className="mt-6 space-y-5" aria-live="polite">
        {result && !result.ok ? (
          <ErrorAlert
            title={'timeout' in result ? 'Stopped: too slow' : 'Invalid regular expression'}
          >
            {result.error}
          </ErrorAlert>
        ) : null}
        {ok ? (
          <>
            <p className="text-sm font-semibold">
              {ok.matches.length === 0
                ? 'No matches'
                : `${ok.matches.length}${ok.truncated ? '+' : ''} match${ok.matches.length === 1 ? '' : 'es'}`}
            </p>
            {ok.truncated ? (
              <InfoNote tone="warning">Only the first {MAX_MATCHES} matches are shown.</InfoNote>
            ) : null}
            {text ? (
              <div>
                <h2 className="mb-1.5 text-sm font-semibold">Highlighted matches</h2>
                <div
                  className="max-h-72 overflow-auto rounded-lg border border-border bg-bg-subtle p-3 font-mono text-sm whitespace-pre-wrap break-words"
                  tabIndex={0}
                >
                  {segments.map((s, i) =>
                    s.match === undefined ? (
                      <span key={i}>{s.text}</span>
                    ) : (
                      <mark
                        key={i}
                        className={`rounded-sm px-0.5 text-fg ${s.match % 2 ? 'bg-amber-200 dark:bg-amber-700/60' : 'bg-indigo-200 dark:bg-indigo-700/60'}`}
                      >
                        {s.text}
                      </mark>
                    ),
                  )}
                </div>
              </div>
            ) : null}
            {ok.matches.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="mb-1.5 text-left text-sm font-semibold">
                    Matches and capture groups
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-fg-muted">
                      <th scope="col" className="py-2 pr-3 font-medium">
                        #
                      </th>
                      <th scope="col" className="py-2 pr-3 font-medium">
                        Index
                      </th>
                      <th scope="col" className="py-2 pr-3 font-medium">
                        Match
                      </th>
                      {Array.from({ length: groupCount }, (_, g) => (
                        <th key={g} scope="col" className="py-2 pr-3 font-medium">
                          ${g + 1}
                          {ok.groupNames[g] ? ` (${ok.groupNames[g]})` : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {ok.matches.slice(0, 200).map((m, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-1.5 pr-3">{i + 1}</td>
                        <td className="py-1.5 pr-3">{m.index}</td>
                        <td className="py-1.5 pr-3 break-all">
                          {m.text === '' ? <em className="text-fg-muted">(empty)</em> : m.text}
                        </td>
                        {Array.from({ length: groupCount }, (_, g) => (
                          <td key={g} className="py-1.5 pr-3 break-all">
                            {m.groups[g] ?? <span className="text-fg-muted">–</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ok.matches.length > 200 ? (
                  <p className="mt-2 text-sm text-fg-muted">Table shows the first 200 matches.</p>
                ) : null}
              </div>
            ) : null}
            {replacement && ok.replaced !== undefined ? (
              <div className="flex flex-col gap-2">
                <TextArea label="Replace preview" value={ok.replaced} readOnly rows={5} />
                <ActionBar>
                  <CopyButton text={ok.replaced} size="sm" label="Copy result" />
                </ActionBar>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <details className="mt-6 rounded-lg border border-border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
          Regex cheat sheet
        </summary>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-left text-sm">
            <tbody>
              {CHEAT_SHEET.map(([token, meaning]) => (
                <tr key={token} className="border-b border-border">
                  <td className="py-1.5 pr-4 font-mono whitespace-nowrap">{token}</td>
                  <td className="py-1.5">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </ToolPanel>
  );
}
