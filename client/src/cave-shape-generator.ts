import {
  HEIGHT,
  caveHeight,
  maxDeltaY,
  minDeltaX,
  MAX_DIFFICULTY_DISTANCE,
} from "./constants";
import { zip } from "./zip";
import { randomInt } from "./util";
import { LinearScale } from "./linear-scale";

new LinearScale([1, 2], [3, 4]);

export function* makeCaveShapeGenerator() {
  while (true) {
    let segmentLength = randomInt(3, 10);
    for (let i = 0; i < segmentLength; i++) {
      const equator = HEIGHT * 0.5 - i * 100;
      yield {
        ceiling: equator - 800,
        floor: equator + 800,
      };
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
