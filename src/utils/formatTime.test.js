import { getTimeString, displayTimeSeconds } from "./formatTime";

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
});

describe("displayTimeSeconds", () => {
  describe("input is finite number", () => {
    it("returns getTimeString(timeSeconds/1000)", () => {
      expect(displayTimeSeconds(123456 / 1000)).toBe(getTimeString(123456));
    });
  });
  it("returns 'DNF' if input is Infinity", () => {
    expect(displayTimeSeconds(Infinity)).toBe("DNF");
  });
  it("returns the input if input is NaN", () => {
    expect(displayTimeSeconds("hello")).toBe("hello");
  });
});
