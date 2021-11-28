import { HEIGHT } from "./constants";

export function* makeCaveShapeGenerator() {
  for (let y of equator()) {
    yield {
      equator: y,
      ceiling: y - 200,
      floor: y + 200,
    };
  }
}

function* equator(): Generator<number> {
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
  yield HEIGHT * 0.5;
}
