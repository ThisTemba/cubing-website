import { getTimeString, displayDur } from "./formatTime";

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

describe("displayDur", () => {
  describe("input is finite number", () => {
    it("returns getTimeString(timeSeconds/1000)", () => {
      expect(displayDur(123456 / 1000)).toBe(getTimeString(123456));
    });
  });
  it("returns 'DNF' if input is Infinity", () => {
    expect(displayDur(Infinity)).toBe("DNF");
  });
});