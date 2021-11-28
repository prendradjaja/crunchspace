import {
  HEIGHT,
  caveHeight,
  maxDeltaY,
  minDeltaX,
  MAX_DIFFICULTY_DISTANCE,
} from "./constants";
import { zip } from "./util";
import { LinearScale } from "./linear-scale";

new LinearScale([1, 2], [3, 4]);

export function* makeCaveShapeGenerator() {
  let i = 0;
  for (let [y, height] of zip(equator(), heights())) {
    yield {
      equator: y,
      ceiling: y - height / 2,
      floor: y + height / 2,
    };
    i++;
  }
}

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
    yield scale.applyScale(x);
    i++;
  }
}
