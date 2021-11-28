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
  let i = 0;
  for (let block of segmented()) {
    const equator = HEIGHT * 0.5 - block.indexInSegment * 100;
    yield {
      ceiling: equator - 800,
      floor: equator + 800,
    };
    i++;
    // if (i > 30) {
    //   console.error("oops, we hit the infinite-loop limit -- remove it or fix a bug");
    //   return;
    // }
  }
  // for (let [y, height] of zip(equator(), heights())) {
  //   yield {
  //     equator: y,
  //     ceiling: y - height / 2,
  //     floor: y + height / 2,
  //   };
  //   i++;
  // }
}

function* segmented() {
  const nextSegments = [5];
  while (true) {
    let activeSegment = nextSegments.shift()!;
    for (let i = 0; i < activeSegment; i++) {
      yield {
        segmentLength: activeSegment,
        indexInSegment: i,
      };
    }
    nextSegments.push(randomInt(3, 10));
  }
}

// for (let [n, _] of zip(segmented(), new Array(100))) {
//   console.log('%', n)
// }

function* equator(): Generator<number> {
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
}

function* heights() {
  while (true) {
    yield caveHeight.EASY;
  }

  const scale = new LinearScale([0, 1], [caveHeight.EASY, caveHeight.HARD]);
  let i = 0;
  while (true) {
    const x = Math.min(i / MAX_DIFFICULTY_DISTANCE, 1);
    yield scale.invoke(x);
    i++;
  }
}
