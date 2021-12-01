import { hello } from "./hello";

describe("hello()", () => {
  it("greets the world by default", () => {
    expect(hello()).toEqual("Hello world!");
  });

  it("greets others", () => {
    expect(hello("friend")).toEqual("Hello friend!");
    expect(hello("foe")).toEqual("Hello foe!");
  });
});
