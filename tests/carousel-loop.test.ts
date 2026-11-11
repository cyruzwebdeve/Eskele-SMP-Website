import assert from "node:assert/strict";
import { test } from "node:test";
import {
  advanceScrollPosition,
  closestCopyIndex,
  middleCopyIndex,
  nearestSlideIndex,
  wrapIndex,
} from "../src/carousel-loop.ts";

test("continuous scrolling moves at the same speed at different refresh rates", () => {
  for (const refreshRate of [30, 60, 144]) {
    let position = 1000;
    for (let frame = 0; frame < refreshRate * 10; frame++) {
      position = advanceScrollPosition(position, 1000 / refreshRate, 1000, 5000);
    }
    assert.ok(Math.abs(position - 1400) < 0.00001);
  }
});

test("automatic scrolling carries fractional movement across either loop boundary", () => {
  assert.equal(advanceScrollPosition(5999.75, 25, 1000, 5000), 1000.75);
  assert.equal(advanceScrollPosition(999.5, 0, 1000, 5000), 5999.5);
  assert.equal(advanceScrollPosition(1200, 1000, 1000, 0), 1000);
});

test("both staff and screenshots continue for hundreds of loops in either direction", () => {
  for (const count of [6, 10]) {
    for (const direction of [-1, 1]) {
      let physical = count;
      for (let step = 1; step <= count * 100; step++) {
        physical += direction;
        assert.equal(wrapIndex(physical, count), wrapIndex(direction * step, count));
        physical = middleCopyIndex(physical, count);
        assert.ok(physical >= count && physical < count * 2);
      }
    }
  }
});

test("end-to-start navigation selects adjacent copies rather than reversing through the list", () => {
  assert.equal(closestCopyIndex(0, 19, 10), 20);
  assert.equal(closestCopyIndex(9, 10, 10), 9);
  assert.equal(closestCopyIndex(0, 11, 6), 12);
  assert.equal(closestCopyIndex(5, 6, 6), 5);
});

test("recentring preserves the view for mixed portrait and landscape widths", () => {
  const widths = [755, 366, 650, 710];
  const centers: number[] = [];
  let left = 0;
  for (let copy = 0; copy < 3; copy++) {
    for (const width of widths) {
      centers.push(left + width / 2);
      left += width + 22;
    }
  }
  const viewportWidth = 1100;
  for (const physical of [0, 1, 2, 3, 8, 9, 10, 11]) {
    const scrollLeft = centers[physical] - viewportWidth / 2 + 17;
    assert.equal(nearestSlideIndex(centers, scrollLeft + viewportWidth / 2), physical);
    const middle = middleCopyIndex(physical, widths.length);
    const rebased = scrollLeft + centers[middle] - centers[physical];
    assert.equal(centers[middle] - rebased, centers[physical] - scrollLeft);
    assert.equal(nearestSlideIndex(centers, rebased + viewportWidth / 2), middle);
  }
});
