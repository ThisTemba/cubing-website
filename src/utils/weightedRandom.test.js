import { relToAbs, cumSum, weightedRandomIndex } from "./weightedRandom";
import _ from "lodash";

describe("relToAbs", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  it("result is an array", () => {
    expect(Array.isArray(relToAbs(arr))).toBeTruthy();
  });
  it("result has same length as input", () => {
    expect(relToAbs(arr).length).toBe(arr.length);
  });
  it("result sum is 1", () => {
    expect(_.sum(relToAbs(arr))).toBe(1);
  });
  it("the ratio of nums at two indices is the same for both", () => {
    const rel = [...arr];
    const abs = relToAbs(rel);
    const [i1, i2] = [0, 1];
    expect(rel[i1] / rel[i2]).toBe(abs[i1] / abs[i2]);
  });
});

describe("cumSum", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  test("last item is sum", () => {
    expect(_.last(cumSum(arr))).toBe(_.sum(arr));
  });
  test("first item is same", () => {
    expect(cumSum(arr)[0]).toBe(arr[0]);
  });
  test("second item is first plus second", () => {
    expect(cumSum(arr)[1]).toBe(arr[0] + arr[1]);
  });
});

describe("weightedRandomIndex", () => {
  it("returns index from probs", () => {
    const weights = [0.1, 0.1, 0.8];
    const indices = weights.map((a, i) => i);
    expect(indices.includes(weightedRandomIndex(weights))).toBeTruthy();
  });
});
