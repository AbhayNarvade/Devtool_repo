/// <reference lib="webworker" />
import { render, type RenderTask } from './render';

// Converts and resizes images off the main thread with OffscreenCanvas.
type Request = { id: number; file: Blob; task: RenderTask };
type Response =
  | { id: number; ok: true; blob: Blob; width: number; height: number }
  | { id: number; ok: false; message: string };

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (message: Response) => void;
};

ctx.onmessage = async (e) => {
  const { id, file, task } = e.data;
  try {
    const result = await render(file, task);
    ctx.postMessage({ id, ok: true, ...result });
  } catch (err) {
    ctx.postMessage({
      id,
      ok: false,
      message: err instanceof Error ? err.message : 'The image could not be processed.',
    });
  }
};
