/// <reference lib="webworker" />
import { runRegex, type RegexRequest, type RegexResult } from './logic';

// Runs regular expressions off the main thread so catastrophic backtracking cannot freeze the page.
// The page terminates this worker if a request takes too long.
const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<{ id: number; request: RegexRequest }>) => void) | null;
  postMessage: (message: { id: number; result: RegexResult }) => void;
};

ctx.onmessage = (e) => {
  ctx.postMessage({ id: e.data.id, result: runRegex(e.data.request) });
};
