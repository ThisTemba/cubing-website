import { getTimeString, getSolveTime } from "./formatTime";

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

describe("getSolveTime", () => {
  it("retuns solveTime", () => {
    expect(getSolveTime(1000)).toStrictEqual({
      timeString: "1.00",
      timeSeconds: 1,
      timeRaw: 1000,
    });
  });
  it("works with seconds and milliseconds", () => {
    expect(getSolveTime(1, true)).toStrictEqual({
      timeString: "1.00",
      timeSeconds: 1,
      timeRaw: 1000,
    });
  });
  it("throws error if input type is wrong", () => {
    expect(() => getSolveTime("60000")).toThrow();
    expect(() => getSolveTime(50, "asdf")).toThrow();
  });
});
