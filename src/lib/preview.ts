/**
 * Browsers become very slow when a text box holds megabytes of multi-line text (several seconds
 * per update for ~5 MB). Large outputs are therefore shown shortened; copy and download always
 * use the complete text.
 */
export const OUTPUT_PREVIEW_LIMIT = 200_000;

export interface TextPreview {
  text: string;
  truncated: boolean;
}

/** First `limit` characters of `text`, cut at a line break when one is close to the limit. */
export function previewText(text: string, limit = OUTPUT_PREVIEW_LIMIT): TextPreview {
  if (text.length <= limit) return { text, truncated: false };
  const cut = text.lastIndexOf('\n', limit);
  const end = cut > limit * 0.9 ? cut : limit;
  return { text: `${text.slice(0, end)}\n…`, truncated: true };
}
