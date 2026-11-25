'use client';

import { useCallback, useState } from 'react';
import { Checkbox, Segmented } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import { urlEncode, type UrlEncodeMode } from './logic';

const SAMPLE = 'Café & crème brûlée: 50% off! Use code "SPRING/25" before 30 Nov?';

export default function UrlEncodeTool() {
  const [mode, setMode] = useState<UrlEncodeMode>('component');
  const [spaceAsPlus, setSpaceAsPlus] = useState(false);
  const [perLine, setPerLine] = useState(false);
  const convert = useCallback(
    (input: string) =>
      urlEncode(input, { mode, spaceAsPlus: mode === 'component' && spaceAsPlus, perLine }),
    [mode, spaceAsPlus, perLine],
  );
  return (
    <TextConverter
      inputLabel="Text or URL to encode"
      outputLabel="URL-encoded output"
      inputPlaceholder="Type or paste text to percent-encode"
      sample={
        mode === 'full' ? 'https://example.com/search results/?q=café au lait&page=2#top' : SAMPLE
      }
      convert={convert}
      outputFilename="url-encoded.txt"
      options={
        <>
          <Segmented
            label="Encode as"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'component', label: 'URL component' },
              { value: 'full', label: 'Full URL' },
            ]}
          />
          {mode === 'component' ? (
            <Checkbox
              label="Encode spaces as +"
              description="Form / query-string style"
              checked={spaceAsPlus}
              onChange={setSpaceAsPlus}
            />
          ) : null}
          <Checkbox label="Encode each line separately" checked={perLine} onChange={setPerLine} />
        </>
      }
    />
  );
}
