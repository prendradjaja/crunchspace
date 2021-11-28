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
  let elevation: number;

  for (let i = 0; i < 21; i++) {
    yield { ceiling: 130, floor: 1308, segmentIndex: -1 };
  }

  // Initial elevation
  {
    const { caveHeight } = getDifficultySettings(0);
    const maxElevation = HEIGHT - caveHeight - 2 * MARGIN; // Maybe DRY this -- maxElevation is calculated twice
    elevation = maxElevation / 2;
  }

  let blockIndex = 0;
  for (let segmentIndex = 0; ; segmentIndex++) {
    const { caveHeight, maxDeltaY, minDeltaX } =
      getDifficultySettings(blockIndex);
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
