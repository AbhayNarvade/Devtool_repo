'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import { ActionBar, Button, ErrorAlert, TextInput, ToolPanel } from '@/components/tool/controls';
import {
  CLASSES,
  fromOctal,
  fromSymbolic,
  shellQuote,
  toChmodSymbolic,
  toOctal,
  toSymbolic,
  type PermissionClass,
  type PermissionSet,
  type Permissions,
} from './logic';

const PRESETS: { octal: string; use: string }[] = [
  { octal: '644', use: 'Regular files' },
  { octal: '755', use: 'Scripts and folders' },
  { octal: '600', use: 'Private files, SSH keys' },
  { octal: '700', use: 'Private folders' },
  { octal: '664', use: 'Group-editable files' },
  { octal: '775', use: 'Group-shared folders' },
  { octal: '400', use: 'Read-only secrets' },
  { octal: '1777', use: 'Shared temp folders' },
];

const BITS: { key: keyof PermissionSet; label: string; value: number }[] = [
  { key: 'read', label: 'Read', value: 4 },
  { key: 'write', label: 'Write', value: 2 },
  { key: 'execute', label: 'Execute', value: 1 },
];

const CLASS_LABEL: Record<PermissionClass, string> = {
  owner: 'Owner (u)',
  group: 'Group (g)',
  others: 'Others (o)',
};

export default function ChmodCalculatorTool() {
  const [perms, setPerms] = useState<Permissions>(() => fromOctal('755')!);
  const [octalText, setOctalText] = useState('755');
  const [symbolicText, setSymbolicText] = useState('rwxr-xr-x');
  const [fileName, setFileName] = useState('example.sh');

  const apply = (p: Permissions) => {
    setPerms(p);
    setOctalText(toOctal(p));
    setSymbolicText(toSymbolic(p));
  };

  const octalValid = fromOctal(octalText) !== null;
  const symbolicValid = fromSymbolic(symbolicText) !== null;
  const octal = toOctal(perms);
  const target = shellQuote(fileName.trim() || 'file');
  const numericCmd = `chmod ${octal} ${target}`;
  const symbolicCmd = `chmod ${toChmodSymbolic(perms)} ${target}`;

  return (
    <ToolPanel>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left">
          <caption className="sr-only">Permission checkboxes</caption>
          <thead>
            <tr className="border-b border-border text-sm text-fg-muted">
              <th scope="col" className="py-2 pr-4 font-medium">
                Who
              </th>
              {BITS.map((b) => (
                <th key={b.key} scope="col" className="py-2 pr-4 text-center font-medium">
                  {b.label} ({b.value})
                </th>
              ))}
              <th scope="col" className="py-2 text-center font-medium">
                Digit
              </th>
            </tr>
          </thead>
          <tbody>
            {CLASSES.map((c) => (
              <tr key={c} className="border-b border-border">
                <th scope="row" className="py-2.5 pr-4 text-sm font-semibold">
                  {CLASS_LABEL[c]}
                </th>
                {BITS.map((b) => (
                  <td key={b.key} className="py-2.5 pr-4 text-center">
                    <input
                      type="checkbox"
                      aria-label={`${CLASS_LABEL[c]} ${b.label}`}
                      checked={perms[c][b.key]}
                      onChange={(e) =>
                        apply({ ...perms, [c]: { ...perms[c], [b.key]: e.target.checked } })
                      }
                      className="h-5 w-5 accent-[var(--accent)]"
                    />
                  </td>
                ))}
                <td className="py-2.5 text-center font-mono font-semibold">
                  {(perms[c].read ? 4 : 0) + (perms[c].write ? 2 : 0) + (perms[c].execute ? 1 : 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-1 text-sm font-medium">Special bits</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
          {(
            [
              ['setuid', 'Set user ID (4)'],
              ['setgid', 'Set group ID (2)'],
              ['sticky', 'Sticky bit (1)'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={perms[key]}
                onChange={(e) => apply({ ...perms, [key]: e.target.checked })}
                className="h-[18px] w-[18px] accent-[var(--accent)]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <TextInput
          label="Octal (numeric)"
          value={octalText}
          mono
          onChange={(v) => {
            setOctalText(v);
            const p = fromOctal(v);
            if (p) {
              setPerms(p);
              setSymbolicText(toSymbolic(p));
            }
          }}
        />
        <TextInput
          label="Symbolic (ls -l)"
          value={symbolicText}
          mono
          onChange={(v) => {
            setSymbolicText(v);
            const p = fromSymbolic(v);
            if (p) {
              setPerms(p);
              setOctalText(toOctal(p));
            }
          }}
        />
        <TextInput label="File or folder name" value={fileName} onChange={setFileName} mono />
      </div>
      <div className="mt-2 space-y-2" aria-live="polite">
        {!octalValid ? (
          <ErrorAlert title="Invalid octal value">
            Use 3 or 4 digits from 0 to 7, such as 644 or 4755.
          </ErrorAlert>
        ) : null}
        {!symbolicValid ? (
          <ErrorAlert title="Invalid symbolic value">
            Use 9 characters like rwxr-xr-x (an ls -l prefix such as -rw-r--r-- also works).
          </ErrorAlert>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        {[numericCmd, symbolicCmd].map((cmd) => (
          <div key={cmd} className="flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 rounded-lg border border-border bg-code-bg px-3 py-2 font-mono text-sm break-all">
              {cmd}
            </code>
            <CopyButton text={cmd} size="sm" label="Copy" />
          </div>
        ))}
        <p className="text-sm text-fg-muted">
          ls -l shows: <span className="font-mono">-{toSymbolic(perms)}</span> (file) or{' '}
          <span className="font-mono">d{toSymbolic(perms)}</span> (directory)
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold">Common permissions</p>
        <ActionBar>
          {PRESETS.map((p) => (
            <Button
              key={p.octal}
              size="sm"
              onClick={() => apply(fromOctal(p.octal)!)}
              title={p.use}
              aria-label={`${p.octal}: ${p.use}`}
            >
              <span className="font-mono">{p.octal}</span>
              <span className="hidden text-fg-muted sm:inline">{p.use}</span>
            </Button>
          ))}
        </ActionBar>
      </div>
    </ToolPanel>
  );
}
