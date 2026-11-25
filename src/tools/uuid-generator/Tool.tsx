'use client';

import { useState } from 'react';
import { CopyButton, DownloadButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  Checkbox,
  NumberInput,
  Segmented,
  TextArea,
  ToolPanel,
} from '@/components/tool/controls';
import { MAX_COUNT, generateUuids, uuidV7Timestamp, type UuidVersion } from './logic';

export default function UuidGeneratorTool() {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const text = uuids.join('\n');
  const firstV7 = version === 'v7' && uuids[0] ? uuidV7Timestamp(uuids[0].toLowerCase()) : null;

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <Segmented
          label="Version"
          value={version}
          onChange={setVersion}
          options={[
            { value: 'v4', label: 'UUID v4 (random)' },
            { value: 'v7', label: 'UUID v7 (time-ordered)' },
          ]}
        />
        <NumberInput
          label={`How many (1–${MAX_COUNT})`}
          value={count}
          min={1}
          max={MAX_COUNT}
          onChange={(n) =>
            setCount(Number.isFinite(n) ? Math.min(MAX_COUNT, Math.max(1, Math.floor(n))) : 1)
          }
        />
        <Checkbox label="Uppercase" checked={uppercase} onChange={setUppercase} />
      </div>
      <ActionBar className="mt-5">
        <Button
          variant="primary"
          icon="refresh"
          onClick={() => setUuids(generateUuids(version, count, uppercase))}
        >
          Generate {count === 1 ? 'UUID' : `${count} UUIDs`}
        </Button>
        <Button icon="trash" variant="ghost" onClick={() => setUuids([])} disabled={!uuids.length}>
          Clear
        </Button>
      </ActionBar>
      <div className="mt-5 flex flex-col gap-3">
        <TextArea
          label="Generated UUIDs"
          value={text}
          readOnly
          rows={10}
          placeholder="Click Generate to create UUIDs."
        />
        <ActionBar>
          <CopyButton
            text={text}
            size="sm"
            label={uuids.length > 1 ? 'Copy all' : 'Copy'}
            disabled={!uuids.length}
          />
          <DownloadButton
            size="sm"
            getText={() => `${text}\n`}
            filename={`uuids-${version}.txt`}
            disabled={!uuids.length}
          />
          {uuids.length ? (
            <span className="ml-auto text-xs text-fg-muted">{uuids.length} generated</span>
          ) : null}
        </ActionBar>
        {firstV7 !== null ? (
          <p className="text-sm text-fg-muted">
            The first UUID embeds the timestamp{' '}
            <span className="font-mono">{new Date(firstV7).toISOString()}</span>.
          </p>
        ) : null}
      </div>
    </ToolPanel>
  );
}
