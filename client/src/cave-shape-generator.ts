import {
  HEIGHT,
  caveHeightRange,
  maxDeltaYRange,
  minDeltaXRange,
  MAX_DIFFICULTY_DISTANCE,
  MARGIN,
} from "./constants";
import { zip } from "./zip";
import { randomInt } from "./util";
import { LinearScale } from "./linear-scale";

new LinearScale([1, 2], [3, 4]);

export function* makeCaveShapeGenerator() {
  while (true) {
    let segmentLength = randomInt(3, 10);
    const caveHeight = caveHeightRange.HARD;
    const wiggle = HEIGHT - caveHeight - 2 * MARGIN;
    for (let i = 0; i < segmentLength; i++) {
      let floor = HEIGHT - MARGIN;
      if (i % 2 === 0) {
        floor -= wiggle;
      }
      const ceiling = floor - caveHeight;
      yield { ceiling, floor };
    }
  }
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
