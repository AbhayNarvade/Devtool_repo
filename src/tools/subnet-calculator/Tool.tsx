'use client';

import { useId, useMemo, useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import { ActionBar, Button, ErrorAlert, ToolPanel } from '@/components/tool/controls';
import { calculateSubnet, formatIPv4, parseCidr, prefixToMask } from './logic';

const SAMPLE = '192.168.10.77/26';
const PREFIXES = Array.from({ length: 33 }, (_, p) => p);

export default function SubnetCalculatorTool() {
  const id = useId();
  const [input, setInput] = useState('');
  const [prefix, setPrefix] = useState(24);

  const parsed = useMemo(() => (input.trim() ? parseCidr(input, prefix) : null), [input, prefix]);
  const info = parsed?.ok ? calculateSubnet(parsed.ip, parsed.prefix) : null;
  const hasSuffix = /[/\s]/.test(input.trim());
  const shownPrefix = parsed?.ok ? parsed.prefix : prefix;

  const rows: [string, string][] = info
    ? [
        ['IP address', info.address],
        ['Network address', info.network],
        [
          'Broadcast address',
          info.prefix >= 31 ? `${info.broadcast} (none for /${info.prefix})` : info.broadcast,
        ],
        ['Usable host range', `${info.firstHost} – ${info.lastHost}`],
        ['Usable hosts', info.usableHosts.toLocaleString('en-US')],
        ['Total addresses', info.totalAddresses.toLocaleString('en-US')],
        ['Subnet mask', info.netmask],
        ['Wildcard mask', info.wildcard],
        ['CIDR notation', info.cidr],
        ['Address class', info.addressClass],
        ['Address type', info.type],
        ['Binary address', info.binaryAddress],
        ['Binary mask', info.binaryMask],
      ]
    : [];
  const report = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${id}-ip`} className="mb-1 block text-sm font-semibold">
            IPv4 address (with /prefix or mask, optional)
          </label>
          <input
            id={`${id}-ip`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 10.0.12.5/22 or 192.168.1.10 255.255.255.0"
            spellCheck={false}
            autoComplete="off"
            aria-invalid={parsed ? !parsed.ok : undefined}
            className="h-11 w-full rounded-lg border border-border-strong bg-card px-3 font-mono text-[0.95rem] focus:border-accent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor={`${id}-prefix`} className="mb-1 text-sm font-medium">
            Prefix / subnet mask
          </label>
          <select
            id={`${id}-prefix`}
            value={shownPrefix}
            onChange={(e) => {
              const p = Number(e.target.value);
              setPrefix(p);
              if (hasSuffix) setInput(`${input.trim().split(/\s*\/\s*|\s+/)[0]}/${p}`);
            }}
            className="h-11 rounded-lg border border-border-strong bg-card px-3 font-mono text-sm focus:border-accent"
          >
            {PREFIXES.map((p) => (
              <option key={p} value={p}>
                /{p} ({formatIPv4(prefixToMask(p))})
              </option>
            ))}
          </select>
        </div>
      </div>
      <ActionBar className="mt-3">
        <Button icon="file" size="sm" onClick={() => setInput(SAMPLE)}>
          Load sample
        </Button>
        <Button
          icon="trash"
          size="sm"
          variant="ghost"
          onClick={() => setInput('')}
          disabled={!input}
        >
          Clear
        </Button>
        {info ? <CopyButton text={report} size="sm" label="Copy results" /> : null}
      </ActionBar>

      <div className="mt-5" aria-live="polite" data-tool-output="">
        {parsed && !parsed.ok ? (
          <ErrorAlert title="Invalid input">{parsed.message}</ErrorAlert>
        ) : null}
        {info ? (
          <table className="w-full text-left">
            <caption className="sr-only">Subnet details</caption>
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-border align-top">
                  <th
                    scope="row"
                    className="py-2 pr-4 text-sm font-medium whitespace-nowrap text-fg-muted"
                  >
                    {k}
                  </th>
                  <td className="py-2 font-mono text-sm break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {info && info.prefix === 31 ? (
          <p className="mt-3 text-sm text-fg-muted">
            A /31 is a point-to-point link (RFC 3021): both addresses are usable hosts.
          </p>
        ) : null}
      </div>
    </ToolPanel>
  );
}
