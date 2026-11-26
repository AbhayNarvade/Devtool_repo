import { describe, expect, it } from 'vitest';
import { addSuffix, formatOf, replaceExtension, savingsPercent, uniqueNames } from './formats';
import {
  adjustPixelCrop,
  canvasSizeProblem,
  centeredAspectCrop,
  computeResize,
  percentToPixelCrop,
  rotatedSize,
} from './geometry';

describe('formats', () => {
  it('detects formats from MIME type or extension', () => {
    expect(formatOf({ name: 'a.bin', type: 'image/png' })).toBe('png');
    expect(formatOf({ name: 'photo.JPEG', type: '' })).toBe('jpg');
    expect(formatOf({ name: 'x.webp', type: 'image/webp' })).toBe('webp');
    expect(formatOf({ name: 'anim.gif', type: 'image/gif' })).toBeNull();
  });
  it('renames files', () => {
    expect(replaceExtension('holiday photo.PNG', 'jpg')).toBe('holiday photo.jpg');
    expect(replaceExtension('noext', 'webp')).toBe('noext.webp');
    expect(replaceExtension('.png', 'jpg')).toBe('image.jpg');
    expect(addSuffix('a.b.jpg', '-small')).toBe('a.b-small.jpg');
    expect(uniqueNames(['a.jpg', 'A.jpg', 'b.jpg', 'a.jpg'])).toEqual([
      'a.jpg',
      'A (2).jpg',
      'b.jpg',
      'a (3).jpg',
    ]);
  });
  it('computes savings', () => {
    expect(savingsPercent(1000, 250)).toBe(75);
    expect(savingsPercent(1000, 1100)).toBe(-10);
    expect(savingsPercent(3, 1)).toBe(66.7);
    expect(savingsPercent(0, 10)).toBe(0);
  });
});

describe('computeResize', () => {
  const o = { width: 4000, height: 3000 };
  it('scales by percent', () => {
    expect(computeResize(o, { mode: 'percent', percent: 50 })).toEqual({
      width: 2000,
      height: 1500,
    });
    expect(computeResize(o, { mode: 'percent', percent: 0.01 })).toEqual({ width: 1, height: 1 });
  });
  it('keeps the aspect ratio from one dimension or fits a box', () => {
    expect(computeResize(o, { mode: 'pixels', width: 1600, keepAspect: true })).toEqual({
      width: 1600,
      height: 1200,
    });
    expect(computeResize(o, { mode: 'pixels', height: 600, keepAspect: true })).toEqual({
      width: 800,
      height: 600,
    });
    expect(
      computeResize(o, { mode: 'pixels', width: 1000, height: 1000, keepAspect: true }),
    ).toEqual({ width: 1000, height: 750 });
  });
  it('stretches when the aspect ratio is not kept', () => {
    expect(
      computeResize(o, { mode: 'pixels', width: 500, height: 500, keepAspect: false }),
    ).toEqual({ width: 500, height: 500 });
    expect(computeResize(o, { mode: 'pixels', width: 500, keepAspect: false })).toEqual({
      width: 500,
      height: 3000,
    });
  });
  it('ignores invalid numbers', () => {
    expect(computeResize(o, { mode: 'pixels', width: Number.NaN, keepAspect: true })).toEqual(o);
    expect(computeResize(o, { mode: 'pixels', width: -5, height: 0, keepAspect: true })).toEqual(o);
  });
});

describe('geometry helpers', () => {
  it('flags canvases that are too large', () => {
    expect(canvasSizeProblem({ width: 20000, height: 10 })).toMatch(/16384/);
    expect(canvasSizeProblem({ width: 8000, height: 8000 })).toBeNull();
  });
  it('swaps dimensions for 90° rotations', () => {
    expect(rotatedSize({ width: 4, height: 3 }, 90)).toEqual({ width: 3, height: 4 });
    expect(rotatedSize({ width: 4, height: 3 }, 180)).toEqual({ width: 4, height: 3 });
    expect(rotatedSize({ width: 4, height: 3 }, -90)).toEqual({ width: 3, height: 4 });
  });
  it('converts percent crops to clamped pixels', () => {
    expect(
      percentToPixelCrop({ x: 10, y: 20, width: 50, height: 50 }, { width: 1000, height: 500 }),
    ).toEqual({
      x: 100,
      y: 100,
      width: 500,
      height: 250,
    });
    expect(
      percentToPixelCrop({ x: 90, y: 90, width: 50, height: 50 }, { width: 100, height: 100 }),
    ).toEqual({
      x: 90,
      y: 90,
      width: 10,
      height: 10,
    });
  });
  it('centres an aspect crop', () => {
    const c = centeredAspectCrop(1, { width: 2000, height: 1000 }, 100);
    expect(c).toEqual({ x: 25, y: 0, width: 50, height: 100 });
    const w = centeredAspectCrop(16 / 9, { width: 1000, height: 1000 }, 100);
    expect(w.width).toBe(100);
    expect(w.height).toBeCloseTo(56.25);
  });
});

describe('adjustPixelCrop', () => {
  const image = { width: 1600, height: 1000 };
  const box = { x: 100, y: 100, width: 400, height: 400 };
  it('keeps a fixed ratio and shrinks to fit the image', () => {
    expect(adjustPixelCrop(box, 'width', 3000, image, 1)).toEqual({
      x: 100,
      y: 0,
      width: 1000,
      height: 1000,
    });
    expect(adjustPixelCrop(box, 'height', 300, image, 16 / 9)).toEqual({
      x: 100,
      y: 100,
      width: 533,
      height: 300,
    });
  });
  it('clamps free crops and positions inside the image', () => {
    expect(adjustPixelCrop(box, 'width', 5000, image)).toEqual({
      x: 0,
      y: 100,
      width: 1600,
      height: 400,
    });
    expect(adjustPixelCrop(box, 'x', 1500, image)).toEqual({
      x: 1200,
      y: 100,
      width: 400,
      height: 400,
    });
    expect(adjustPixelCrop(box, 'height', 0, image)).toEqual({
      x: 100,
      y: 100,
      width: 400,
      height: 1,
    });
  });
});
