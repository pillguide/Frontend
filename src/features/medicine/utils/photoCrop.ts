export function photoCrop(
  width: number,
  height: number,
  expected: { width: number; height: number } | null,
  bbox: number[] | null,
) {
  if (!expected || width !== expected.width || height !== expected.height ||
      width <= 0 || height <= 0 || !bbox || bbox.length !== 4 ||
      bbox.some((n) => !Number.isFinite(n) || n < 0 || n > 1)) return null;
  const [x1, y1, x2, y2] = bbox;
  if (x1 >= x2 || y1 >= y2) return null;
  // Display only: a 10% margin preserves the edge of the detected pill.
  const dx = (x2 - x1) * 0.1, dy = (y2 - y1) * 0.1;
  const left = Math.floor(Math.max(0, x1 - dx) * width);
  const top = Math.floor(Math.max(0, y1 - dy) * height);
  const right = Math.ceil(Math.min(1, x2 + dx) * width);
  const bottom = Math.ceil(Math.min(1, y2 + dy) * height);
  return { left, top, width: right - left, height: bottom - top };
}
