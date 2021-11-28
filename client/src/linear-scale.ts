// Similar to d3 scaleLinear

export class LinearScale {
  private m: number; // slope
  private b: number; // y-intercept

  constructor(domain: [number, number], range: [number, number]) {
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
