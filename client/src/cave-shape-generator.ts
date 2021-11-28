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
import { randomInt, riggedRandomInt } from "./util";
import { LinearScale } from "./linear-scale";

new LinearScale([1, 2], [3, 4]);

export function* makeCaveShapeGenerator() {
  let elevation = 0;
  let blockIndex = 0;
  for (let segmentIndex = 0; ; segmentIndex++) {
    // const caveHeight = caveHeightRange.HARD;
    // const maxDeltaY = maxDeltaYRange.HARD;
    // const minDeltaX = minDeltaXRange.HARD;
    const { caveHeight, maxDeltaY, minDeltaX } =
      getDifficultySettings(blockIndex);
    console.log(blockIndex);
    const maxElevation = HEIGHT - caveHeight - 2 * MARGIN;

    let { targetElevation, segmentLength } = makeRandomSegment(
      elevation,
      caveHeight,
      maxDeltaY,
      minDeltaX,
      maxElevation
    );
    const interpolator = new LinearScale(
      [0, segmentLength],
      [elevation, targetElevation]
    );
    for (let i = 0; i < segmentLength; i++) {
      elevation = interpolator.invoke(i);
      let floor = HEIGHT - MARGIN - elevation;
      const ceiling = floor - caveHeight;

      yield { ceiling, floor, segmentIndex };
      blockIndex++;
    }
    elevation = targetElevation;
  }
}

const caveHeightInterpolator = new LinearScale(
  [0, MAX_DIFFICULTY_DISTANCE],
  [caveHeightRange.EASY, caveHeightRange.HARD]
);

const maxDeltaYInterpolator = new LinearScale(
  [0, MAX_DIFFICULTY_DISTANCE],
  [maxDeltaYRange.EASY, maxDeltaYRange.HARD]
);

const minDeltaXInterpolator = new LinearScale(
  [0, MAX_DIFFICULTY_DISTANCE],
  [minDeltaXRange.EASY, minDeltaXRange.HARD]
);

function getDifficultySettings(blockIndex: number) {
  if (blockIndex < MAX_DIFFICULTY_DISTANCE) {
    return {
      caveHeight: caveHeightInterpolator.invoke(blockIndex),
      maxDeltaY: maxDeltaYInterpolator.invoke(blockIndex),
      minDeltaX: minDeltaXInterpolator.invoke(blockIndex),
    };
  } else {
    return {
      caveHeight: caveHeightRange.HARD,
      maxDeltaY: maxDeltaYRange.HARD,
      minDeltaX: minDeltaXRange.HARD,
    };
  }
}

function* myCycle() {
  while (true) {
    yield 260;
    yield 520;
    yield 0;
  }
}

const cycle = myCycle();

function makeRandomSegment(
  elevation: number,
  caveHeight: number,
  maxDeltaY: number,
  minDeltaX: number,
  maxElevation: number
) {
  const hi = Math.min(elevation + maxDeltaY, maxElevation);
  const lo = Math.max(elevation - maxDeltaY, 0);

  // const targetElevation = (cycle.next() as any).value;
  const targetElevation = randomInt(lo, hi);
  // const targetElevation = riggedRandomInt(lo, hi);
  const segmentLength = randomInt(minDeltaX, MAX_DELTA_X);
  // const segmentLength = 3;
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
