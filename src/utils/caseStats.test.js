import { getNumSolves, getRecentCaseSolves } from "./caseStats";

describe("getNumSolves", () => {
  const newSolves = ["a", "b", "c"];
  describe("oldDoc does not exist", () => {
    const oldDoc = { exists: false };
    it("returns length of newSolves", () => {
      expect(getNumSolves(newSolves, oldDoc)).toBe(newSolves.length);
    });
  });
  describe("oldDoc does exist", () => {
    const oldDoc = {
      exists: true,
      data: () => ({ caseStats: { numSolves: 7 } }),
    };
    it("returns sum of num new solves and old numSolves", () => {
      const numSolves = newSolves.length + oldDoc.data().caseStats.numSolves;
      expect(getNumSolves(newSolves, oldDoc)).toBe(numSolves);
    });
  });
});

describe("getRecentCaseSolves", () => {
  test("result[0] === newSolves[0]", () => {
    const newSolves = ["a", "b", "c"];
    const oldDoc = { exists: false };
    const num = 3;
    expect(getRecentCaseSolves(newSolves, oldDoc, num)[0]).toBe("a");
  });
  describe("num < totalSolves", () => {
    const newSolves = ["a", "b", "c"];
    const oldDoc = {
      exists: true,
      data: () => ({ recentCaseSolves: ["d", "e"] }),
    };
    const num = 4;
    test("result.length === num", () => {
      const result = getRecentCaseSolves(newSolves, oldDoc, num);
      expect(result.length).toEqual(num);
    });
    test("result is [...newSolves, ...oldSolves] trimmed", () => {
      const result = getRecentCaseSolves(newSolves, oldDoc, num);
      expect(result).toEqual(["a", "b", "c", "d"]);
    });
  });
  describe("num > totalSolves", () => {
    const newSolves = ["a", "b", "c"];
    const oldDoc = {
      exists: true,
      data: () => ({ recentCaseSolves: ["d", "e"] }),
    };
    const num = 7;
    test("result is [...newSolves, ...oldSolves] untrimmed", () => {
      const result = getRecentCaseSolves(newSolves, oldDoc, num);
      expect(result).toEqual(["a", "b", "c", "d", "e"]);
    });
  });
  // haven't tested when the doc is undefined because I'm lazy, sorry
});
