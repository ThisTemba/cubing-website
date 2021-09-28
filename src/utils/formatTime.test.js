import { getTimeString } from "./formatTime";

describe("getTimeString", () => {
  it("returns a string", () => {
    expect(typeof getTimeString(0)).toBe("string");
  });
  it("floors correctly", () => {
    expect(getTimeString(126)).toBe("0.12");
  });
  it("works with minutes and seconds", () => {
    expect(getTimeString(3599999)).toBe("59:59.99");
  });
  it("resets on the hour", () => {
    expect(getTimeString(3600000)).toMatch("0.00");
  });
  it("returns '-' if not passed a number", () => {
    expect(getTimeString(NaN)).toBe("-");
    expect(getTimeString(undefined)).toBe("-");
    expect(getTimeString("some string")).toBe("-");
  })
});
