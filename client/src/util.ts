export function* take<T>(count: number, iterable: Iterable<T>): Generator<T> {
  const iterator = iterable[Symbol.iterator]();
  for (let i = 0; i < count; i++) {
    const item = iterator.next();
    if (item.done) {
      return;
    } else {
      yield item.value;
    }
  }
}

// Generates a random int between min and max (inclusive!)
// From https://stackoverflow.com/a/7228322/1945088
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function* makeCycle() {
  while (true) {
    yield 0;
    yield 0;
    yield 0;
    yield 1;
    yield 1;
    yield 1;
  }
}
const myCycle = makeCycle();
export function riggedRandomInt(min: number, max: number) {
  return (myCycle.next() as any).value ? max : min;
}
