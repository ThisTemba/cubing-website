import {
  getStatLearned,
  getCaseLearned,
  getStatus,
  aggregateStatus,
  sortStatusSingle,
  sortStatusAggregated,
  sortStatus,
} from "./learnedStatus";
import _ from "lodash";

const caseLearnedCriteria = {
  hRate: { threshold: 0.5, symbol: "<=" },
  cmRate: { threshold: 0.5, symbol: "<=" },
  mmRate: { threshold: 0.1, symbol: "<=" },
  numSolves: { threshold: 2, symbol: ">=" },
  avgTPS: { threshold: 2, symbol: ">=" },
};

const clc = caseLearnedCriteria;

describe("getStatLearned", () => {
  describe("with valid input", () => {
    describe("with learnable stat", () => {
      it("returns a boolean", () => {
        const cmRate = 0.1;
        expect(typeof getStatLearned({ cmRate }, clc)).toBe("boolean");
      });
      it("returns true if the stat is learned", () => {
        const hRate = 0.1;
        expect(getStatLearned({ hRate }, clc)).toBe(true);
        const numSolves = 2;
        expect(getStatLearned({ numSolves }, clc)).toBe(true);
      });
      it("returns false if the stat is not learned", () => {
        const cmRate = 0.9;
        expect(getStatLearned({ cmRate }, clc)).toBe(false);
        const hRate = 0.9;
        expect(getStatLearned({ hRate }, clc)).toBe(false);
      });
    });
    describe("with unlearnable stat", () => {
      it("returns a null", () => {
        const nmRate = 0.1;
        expect(getStatLearned({ nmRate }, clc)).toBe(null);
      });
    });
  });
  describe("with invalid input", () => {
    it("throws error if first param is not an object", () => {
      const nmRate = 0.1;
      expect(() => getStatLearned(nmRate, clc)).toThrowError();
    });
  });
});

describe("getCaseLearned", () => {
  describe("with valid input", () => {
    it("returns a boolean", () => {
      const cas = { hRate: 0, cmRate: 0, mmRate: 0, numSolves: 5, avgTPS: 5 };
      expect(typeof getCaseLearned(cas, clc)).toBe("boolean");
    });
    it("returns true if all stats learned", () => {
      const cas = { hRate: 0, cmRate: 0, mmRate: 0, numSolves: 5, avgTPS: 5 };
      expect(getCaseLearned(cas, clc)).toBe(true);
    });
    it("returns false if not all stats learned", () => {
      const cas1 = { hRate: 0, cmRate: 0, mmRate: 1, numSolves: 5, avgTPS: 5 };
      expect(getCaseLearned(cas1, clc)).toBe(false);
      const cas2 = { hRate: 0, cmRate: 1, mmRate: 0, numSolves: 5, avgTPS: 5 };
      expect(getCaseLearned(cas2, clc)).toBe(false);
    });
    it("returns false if not all stats available", () => {
      const cas1 = { hRate: 0, cmRate: 0, mmRate: 0 };
      expect(getCaseLearned(cas1, clc)).toBe(false);
      const cas2 = {};
      expect(getCaseLearned(cas2, clc)).toBe(false);
    });
  });
});

describe("getStatus", () => {
  describe("with valid arguments", () => {
    it("returns a number", () => {
      const cas = {};
      expect(typeof getStatus(cas, clc)).toBe("number");
    });
    it("returns 2 if cas is learned", () => {
      const cas = { hRate: 0, cmRate: 0, mmRate: 0, numSolves: 5, avgTPS: 5 };
      expect(getStatus(cas, clc)).toBe(2);
    });
    it("returns 1 if cas is not learned but has solves", () => {
      const cas = { hRate: 0, mmRate: 0, numSolves: 5, avgTPS: 5 };
      expect(getStatus(cas, clc)).toBe(1);
    });
    it("returns 0 if cas has no solves", () => {
      const cas = { hRate: 0, mmRate: 0, numSolves: 0, avgTPS: 5 };
      expect(getStatus(cas, clc)).toBe(0);
    });
  });
});

describe("aggregateStatus", () => {
  it("returns an object", () => {
    const statuses = [1, 2, 0, 1, 1, 0];
    expect(typeof aggregateStatus(statuses)).toBe("object");
  });
  it("returns the counts of each status", () => {
    const statuses = [1, 2, 0, 1, 1, 0];
    expect(aggregateStatus(statuses)).toEqual({ 0: 2, 1: 3, 2: 1 });
  });
});

describe("sortStatusSingle", () => {
  it("returns 1 if sA > sB", () => {
    expect(sortStatusSingle(1, 0)).toBe(1);
  });
  it("returns -1 otherwise", () => {
    expect(sortStatusSingle(0, 0)).toBe(-1);
    expect(sortStatusSingle(0, 1)).toBe(-1);
  });
});

describe("sortStatusAggregated", () => {
  describe("learnedA% !== learnedB%", () => {
    it("returns 1 if learnedA% > learnedB%", () => {
      const sA = {
        0: 0,
        1: 1,
        2: 1, // 50%
      };
      const sB = {
        0: 3,
        1: 3,
        2: 3, // 30%
      };
      const AisBigger = true;
      expect(sortStatusAggregated(sA, sB)).toBe(AisBigger ? 1 : -1);
    });
    it("returns -1 if learnedA% < learnedB%", () => {
      const sA = {
        0: 0,
        1: 1,
        2: 1, // 50%
      };
      const sB = {
        0: 1,
        1: 1,
        2: 8, // 80%
      };
      const AisBigger = false;
      expect(sortStatusAggregated(sA, sB)).toBe(AisBigger ? 1 : -1);
    });
  });
  describe("learnedA% === learnedB%", () => {
    it("returns 1 is learningA% > learningB%", () => {
      const sA = {
        0: 0,
        1: 2, // 20%
        2: 8, // 80%
      };
      const sB = {
        0: 1,
        1: 1, // 10%
        2: 8, // 80%
      };
      const AisBigger = true;
      expect(sortStatusAggregated(sA, sB)).toBe(AisBigger ? 1 : -1);
    });
    it("returns -1 otherwise", () => {
      const sA = {
        0: 2,
        1: 0, // 0%
        2: 8, // 80%
      };
      const sB = {
        0: 1,
        1: 1, // 10%
        2: 8, // 80%
      };
      const AisBigger = false;
      expect(sortStatusAggregated(sA, sB)).toBe(AisBigger ? 1 : -1);
    });
  });
});

describe("sortStatus", () => {
  describe("status is aggregated", () => {
    it("returns the aggregated status sort", () => {
      const sA = {
        0: 2,
        1: 0, // 0%
        2: 8, // 80%
      };
      const sB = {
        0: 1,
        1: 1, // 10%
        2: 8, // 80%
      };
      const AisBigger = false;
      expect(sortStatus(sA, sB)).toBe(AisBigger ? 1 : -1);
    });
  });
  describe("status is not aggregated", () => {
    it("returns the single status sort", () => {
      expect(sortStatus(0, 0)).toBe(-1);
      expect(sortStatus(0, 1)).toBe(-1);
    });
  });
});
