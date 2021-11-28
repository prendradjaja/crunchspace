import {
  HEIGHT,
  caveHeightRange,
  maxDeltaYRange,
  minDeltaXRange,
  MAX_DELTA_X,
  MAX_DIFFICULTY_DISTANCE,
  MARGIN,
} from "./constants";
import { zip } from "./zip";
import { randomInt } from "./util";
import { LinearScale } from "./linear-scale";

new LinearScale([1, 2], [3, 4]);

export function* makeCaveShapeGenerator() {
  let elevation = 0;
  while (true) {
    const caveHeight = caveHeightRange.HARD;
    const maxDeltaY = maxDeltaYRange.HARD;
    const minDeltaX = minDeltaXRange.HARD;
    const maxElevation = HEIGHT - caveHeight - 2 * MARGIN;

    let { targetElevation, segmentLength } = makeRandomSegment(
      elevation,
      caveHeight,
      maxDeltaY,
      minDeltaX,
      maxElevation
    );
    for (let i = 0; i < segmentLength; i++) {
      elevation = targetElevation;
      let floor = HEIGHT - MARGIN - elevation;
      const ceiling = floor - caveHeight;

      yield { ceiling, floor };
    }
  }
}

function makeRandomSegment(
  elevation: number,
  caveHeight: number,
  maxDeltaY: number,
  minDeltaX: number,
  maxElevation: number
) {
  const hi = Math.min(elevation + maxDeltaY, maxElevation);
  const lo = Math.max(elevation - maxDeltaY, 0);

  const targetElevation = randomInt(lo, hi);
  const segmentLength = randomInt(minDeltaX, MAX_DELTA_X);
  return { targetElevation, segmentLength };
}

// function* heights() {
//   while (true) {
//     yield caveHeight.EASY;
//   }
//
//   const scale = new LinearScale([0, 1], [caveHeight.EASY, caveHeight.HARD]);
//   let i = 0;
//   while (true) {
//     const x = Math.min(i / MAX_DIFFICULTY_DISTANCE, 1);
//     yield scale.invoke(x);
//     i++;
//   }
// }
