'use client';

import { useCallback, useState } from 'react';
import { Checkbox, TextInput } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import { jsonToTypeScript } from './logic';

const SAMPLE = `{
  "id": "usr_8f2k",
  "email": "dana@example.com",
  "verified": true,
  "createdAt": "2026-03-14T09:30:00Z",
  "profile": { "displayName": "Dana", "avatarUrl": null },
  "roles": ["admin", "editor"],
  "projects": [
    { "id": 1, "name": "Website", "archived": false },
    { "id": 2, "name": "Mobile app", "deadline": "2026-12-01" }
  ]
}`;

export default function JsonToTypeScriptTool() {
  const [rootName, setRootName] = useState('Root');
  const [allOptional, setAllOptional] = useState(false);
  const [exportTypes, setExportTypes] = useState(true);
  const [useTypeAlias, setUseTypeAlias] = useState(false);
  const convert = useCallback(
    (input: string) =>
      jsonToTypeScript(input, { rootName, allOptional, exportTypes, useTypeAlias }),
    [rootName, allOptional, exportTypes, useTypeAlias],
  );
  return (
    <TextConverter
      inputLabel="JSON input"
      outputLabel="TypeScript output"
      inputPlaceholder="Paste a JSON sample, such as an API response"
      sample={SAMPLE}
      convert={convert}
      outputFilename="types.ts"
      outputMime="text/typescript"
      inputAccept=".json,application/json,text/plain"
      inputFileLabel="Open .json file"
      options={
        <>
          <TextInput
            label="Root type name"
            value={rootName}
            onChange={setRootName}
            mono
            className="w-48"
          />
          <Checkbox
            label="Make all fields optional"
            checked={allOptional}
            onChange={setAllOptional}
          />
          <Checkbox label="Add export keyword" checked={exportTypes} onChange={setExportTypes} />
          <Checkbox
            label='Use "type" instead of "interface"'
            checked={useTypeAlias}
            onChange={setUseTypeAlias}
          />
        </>
      }
    />
  );
}
