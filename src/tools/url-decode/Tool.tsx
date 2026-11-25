'use client';

import { useCallback, useState } from 'react';
import { Checkbox } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import { urlDecode } from './logic';

const SAMPLE =
  'https://example.com/search?q=caf%C3%A9+au+lait&filter=price%3C20%26rating%3E4&redirect=%2Faccount%2Forders%3Fpage%3D2';

export default function UrlDecodeTool() {
  const [plusAsSpace, setPlusAsSpace] = useState(true);
  const [decodeAll, setDecodeAll] = useState(false);
  const convert = useCallback(
    (input: string) => urlDecode(input, { plusAsSpace, decodeAll }),
    [plusAsSpace, decodeAll],
  );
  return (
    <TextConverter
      inputLabel="URL-encoded text"
      outputLabel="Decoded text"
      inputPlaceholder="Paste a URL or percent-encoded text, e.g. caf%C3%A9"
      sample={SAMPLE}
      convert={convert}
      outputFilename="url-decoded.txt"
      options={
        <>
          <Checkbox
            label="Treat + as a space"
            description="Correct for query strings and form data"
            checked={plusAsSpace}
            onChange={setPlusAsSpace}
          />
          <Checkbox
            label="Decode repeatedly"
            description="For double-encoded values like %2520"
            checked={decodeAll}
            onChange={setDecodeAll}
          />
        </>
      }
    />
  );
}
