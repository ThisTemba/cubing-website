import {
  aoAll,
  aoLastN,
  listAoNs,
  bestAoN,
  getSessionAverage,
} from "./averages";
import _ from "lodash";

describe("aoAll: ao5", () => {
  it("calculates average correctly", () => {
    let durs = [10, 1, 12, 11, 30];
    expect(aoAll(durs)).toBe(11);
  });
  it("excludes infinity correctly", () => {
    let durs = [10, 1, 11, 12, Infinity];
    expect(aoAll(durs)).toBe(11);
  });
  it("includes infinity correctly", () => {
    let durs = [10, 1, 12, Infinity, Infinity];
    expect(aoAll(durs)).toBe(Infinity);
  });
  it("throws error is durs.length < 5", () => {
    let durs = [10, 1, 12, Infinity];
    expect(() => aoAll(durs)).toThrowError();
  });
});

describe("aoLastN", () => {
  it("returns aoAll of last n items", () => {
    const durs = [3, 6, 4, 6, 3, 3, 7, 8, 2, 2];
    expect(aoLastN(durs, 5)).toBe(aoAll(_.takeRight(durs, 5)));
  });
});

describe("listAoNs", () => {
  const durs = [8, 4, 4, 2, 2, 2, 4, 3, 3, 7];
  it("returns an array", () => {
    expect(listAoNs(durs, 5)).toBeInstanceOf(Array);
  });
  test("first n - 1 items are '-'", () => {
    const n = 6;
    const result = _(listAoNs(durs, n))
      .take(n - 1)
      .value();
    expect(result).toEqual(["-", "-", "-", "-", "-"]);
  });
  test("last item is aolastN", () => {
    expect(_.last(listAoNs(durs, 5))).toBe(aoLastN(durs, 5));
  });
  it("returns all dashes if durs.length < n", () => {
    const n = 7;
    const newDurs = _.take(durs, n - 1);
    expect(listAoNs(newDurs, n)).toEqual(_.fill(Array(n - 1), "-"));
  });
});

describe("bestAoN", () => {
  const durs = [10, 6, 5, 3, 8, 7, 6, 6, 7, 4];
  const AoNlist = listAoNs(durs, 5);
  it("throws error if n > durs.length", () => {
    expect(() => bestAoN(durs, durs.length + 1)).toThrowError();
  });

  it("returns the minimum value from AoNlist", () => {
    const minValue = Math.min(...AoNlist.filter((i) => typeof i === "number"));
    expect(bestAoN(durs, 5)).toBe(minValue);
  });
});

describe("getSessionAverage", () => {
  const durs = [7, 10, 2, 6, 8, 10, 6];
  it("gets aoAll if durs.length is >= 5", () => {
    const fiveDurs = _.take(durs, 5);
    expect(getSessionAverage(fiveDurs)).toEqual(aoAll(fiveDurs));
  });
  it("gets the mean if durs.length < 5", () => {
    const fourDurs = _.take(durs, 4);
    expect(getSessionAverage(fourDurs)).toEqual(_.mean(fourDurs));
  });
  test;
});
