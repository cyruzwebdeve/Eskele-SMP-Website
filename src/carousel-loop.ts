export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

export function middleCopyIndex(index: number, count: number): number {
  return count + wrapIndex(index, count);
}

export function closestCopyIndex(index: number, from: number, count: number): number {
  const logicalIndex = wrapIndex(index, count);
  const candidates = [logicalIndex, logicalIndex + count, logicalIndex + count * 2];
  return candidates.reduce((closest, candidate) =>
    Math.abs(candidate - from) < Math.abs(closest - from) ? candidate : closest,
  );
}

export function nearestSlideIndex(centers: readonly number[], viewportCenter: number): number {
  return centers.reduce(
    (closest, center, index) =>
      Math.abs(center - viewportCenter) < Math.abs(centers[closest] - viewportCenter)
        ? index
        : closest,
    0,
  );
}

export function advanceScrollPosition(
  position: number,
  elapsedMs: number,
  loopStart: number,
  loopWidth: number,
  pixelsPerSecond = 40,
): number {
  if (loopWidth <= 0) return loopStart;
  const next = position - loopStart + (elapsedMs * pixelsPerSecond) / 1000;
  return loopStart + (((next % loopWidth) + loopWidth) % loopWidth);
}
