// Similar to d3 scaleLinear

export class LinearScale {
  private m: number; // slope
  private b: number; // y-intercept

  constructor(domain: [number, number], range: [number, number]) {
    // console.log(domain, range);
    const [x1, x2] = domain;
    const [y1, y2] = range;
    this.m = (y2 - y1) / (x2 - x1);
    this.b = y1 - this.m * x1;
  }

  // Equivalent to calling the scale in d3
  invoke(x: number) {
    return this.m * x + this.b;
  }
}

// const myLine = new LinearScale(
//   [0, 5],
//   [10, 100],
// );

// for (let i = 0; i <= 5; i++) {
//   console.log(i, myLine.invoke(i));
// }

const globals = window as any;
globals.LinearScale = LinearScale;
