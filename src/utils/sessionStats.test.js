import { getSessionAverage } from "./averages";
import { getSessionStats } from "./sessionStats";
import _ from "lodash";

describe("getSessionStats", () => {
  it("returns an object", () => {
    const session = { solves: [{ solveTime: { timeSeconds: 1 } }] };
    expect(typeof getSessionStats(session)).toBe("object");
  });
  test("object has sessionAverage and numSolves keys", () => {
    const session = { solves: [{ solveTime: { timeSeconds: 1 } }] };
    expect(getSessionStats(session).sessionAverage).toBeDefined();
    expect(getSessionStats(session).numSolves).toBeDefined();
  });
  it("throws error if session has no solves", () => {
    expect(() => getSessionStats({ solves: [] })).toThrow();
  });
  describe("given twelve or more solves", () => {
    const session = {
      solves: _.fill(Array(12), {
        solveTime: { timeSeconds: _.random(1, 10) },
      }),
    };
    it("returns object with bestAo5", () => {
      expect(getSessionStats(session).bestAo5).toBeDefined();
    });
    it("returns object with bestAo12", () => {
      expect(getSessionStats(session).bestAo12).toBeDefined();
    });
    it("does not have bestAo50", () => {
      expect(getSessionStats(session).bestAo50).toBeUndefined();
    });
    it("does not have bestAo100", () => {
      expect(getSessionStats(session).bestAo100).toBeUndefined();
    });
  });
  describe("given 100+ solves", () => {
    const session = {
      solves: _.fill(Array(100), {
        solveTime: { timeSeconds: _.random(1, 10) },
      }),
    };
    it("returns object with bestAo50 defined", () => {
      expect(getSessionStats(session).bestAo50).toBeDefined();
    });
    it("returns object with bestAo100 defined", () => {
      expect(getSessionStats(session).bestAo100).toBeDefined();
    });
  });
});
