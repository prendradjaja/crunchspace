import { take } from "./util";

describe("take()", () => {
  it("takes first N elements", () => {
    const result = Array.from(take(3, [1, 2, 3, 4, 5]));
    expect(result).toEqual([1, 2, 3]);
  });

  it("stops early if not enough elements", () => {
    const result = Array.from(take(3, [1, 2]));
    expect(result).toEqual([1, 2]);
  });
});
