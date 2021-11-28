import { zip } from "./util";

describe("zip()", () => {
  it("zips and stops at the first 'done'", () => {
    function* abc() {
      yield "a";
      yield "b";
      yield "c";
    }
    function* naturals() {
      let i = 1;
      while (true) {
        yield i;
        i++;
      }
    }
    const result = Array.from(zip(abc(), naturals()));
    expect(result).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});
