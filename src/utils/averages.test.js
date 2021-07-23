import {
  getMeanTimeSeconds,
  aoAll,
  aolastN,
  listAoNs,
  bestAoN,
  getSessionAverage,
  getWorstSingle,
  getBestSingle,
} from "./averages";
import _ from "lodash";

describe("getBestSingle", () => {
  let solves = [
    { solveTime: { timeSeconds: 4 } },
    { solveTime: { timeSeconds: 7 } },
  ];
  it("returns a time from solves", () => {
    expect(solves.map((s) => s.solveTime.timeSeconds)).toContain(
      getBestSingle(solves)
    );
  });
  it("returns the minimum time", () => {
    expect(getBestSingle(solves)).toBe(4);
  });
});

describe("getWorstSingle", () => {
  let solves = [
    { solveTime: { timeSeconds: 4 } },
    { solveTime: { timeSeconds: 7 } },
  ];
  it("returns a time from solves", () => {
    expect(solves.map((s) => s.solveTime.timeSeconds)).toContain(
      getWorstSingle(solves)
    );
  });
  it("returns the minimum time", () => {
    expect(getWorstSingle(solves)).toBe(7);
  });
});

describe("getSessionAverage", () => {
  const solves = Array.from({ length: 7 }, () => {
    return {
      solveTime: { timeSeconds: _.random(1, 10) },
    };
  });
  it("gets aoAll if solves.length is >= 5", () => {
    const fiveSolves = _.take(solves, 5);
    const received = getSessionAverage(fiveSolves);
    const expected = aoAll(fiveSolves);
    expect(received).toEqual(expected);
  });
  it("gets the mean if solves.length < 5", () => {
    const fourSolves = _.take(solves, 4);
    const received = getSessionAverage(fourSolves);
    const expected = getMeanTimeSeconds(fourSolves);
    expect(received).toEqual(expected);
  });
  test;
});

describe("bestAoN", () => {
  const solves = Array.from({ length: 10 }, () => {
    return {
      solveTime: { timeSeconds: _.random(1, 10) },
    };
  });
  const AoNlist = listAoNs(solves, 5);
  it("returns the minimum value from AoNlist", () => {
    const minValue = Math.min(...AoNlist.filter((i) => typeof i === "number"));
    expect(bestAoN(solves, 5)).toBe(minValue);
  });
});

describe("listAoNs", () => {
  const solves = Array.from({ length: 10 }, () => {
    return {
    solveTime: { timeSeconds: _.random(1, 10) },
    };
  });
  it("returns an array", () => {
    expect(listAoNs(solves, 5)).toBeInstanceOf(Array);
  });
  test("first n - 1 items are '-'", () => {
    const result = _(listAoNs(solves, 6)).take(5).value();
    expect(result).toEqual(["-", "-", "-", "-", "-"]);
  });
  test("last item is aolastN", () => {
    expect(_.last(listAoNs(solves, 5))).toBe(aolastN(solves, 5));
  });
  it("returns all dashes if solves.length < n", () => {
    const n = 7;
    const newSolves = _.take(solves, n - 1);
    expect(listAoNs(newSolves, n)).toEqual(_.fill(Array(n - 1), "-"));
  });
});

describe("aolastN", () => {
  it("returns aoAll of last n items", () => {
    const solves = Array.from({ length: 10 }, () => {
      return {
      solveTime: { timeSeconds: _.random(1, 10) },
      };
    });
    expect(aolastN(solves, 5)).toBe(aoAll(_.takeRight(solves, 5)));
  });
});

describe("aoAll: ao5", () => {
  it("calculates average correctly", () => {
    let solves = [
      { solveTime: { timeSeconds: 10 } },
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 12 } },
      { solveTime: { timeSeconds: 11 } },
      { solveTime: { timeSeconds: 30 } },
    ];
    expect(aoAll(solves)).toBe(11);
  });
  it("excludes infinity correctly", () => {
    let solves = [
      { solveTime: { timeSeconds: 10 } },
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 12 } },
      { solveTime: { timeSeconds: 11 } },
      { solveTime: { timeSeconds: Infinity } },
    ];
    expect(aoAll(solves)).toBe(11);
  });
  it("includes infinity correctly", () => {
    let solves = [
      { solveTime: { timeSeconds: 10 } },
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 12 } },
      { solveTime: { timeSeconds: Infinity } },
      { solveTime: { timeSeconds: Infinity } },
    ];
    expect(aoAll(solves)).toBe(Infinity);
  });
  it("requires at least 5 solves", () => {
    let solves = [
      { solveTime: { timeSeconds: 10 } },
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 12 } },
      { solveTime: { timeSeconds: Infinity } },
    ];
    expect(() => aoAll(solves)).toThrowError();
  });
});

describe("getMeanTimeSeconds", () => {
  it("calculates the mean", () => {
    let solves = [
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 2 } },
    ];
    expect(getMeanTimeSeconds(solves)).toBe(1.5);
  });
  it("rounds to two decimal places", () => {
    let solves = [
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 1 } },
      { solveTime: { timeSeconds: 2 } },
    ];
    expect(getMeanTimeSeconds(solves)).toBe(1.33);
  });
  describe("infinity is included", () => {
    it("returns infinity", () => {
      let solves = [
        { solveTime: { timeSeconds: 1 } },
        { solveTime: { timeSeconds: Infinity } },
      ];
      expect(getMeanTimeSeconds(solves)).toBe(Infinity);
    });
  });
  it("throws error if solves does not have solvetime", () => {
    expect(() => getMeanTimeSeconds([1])).toThrow();
  });
  it("throws error if solveTimes do not have timeSeconds", () => {
    expect(() => getMeanTimeSeconds([{ solveTime: {} }])).toThrow();
  });
});
