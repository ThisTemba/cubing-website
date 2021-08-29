import {
  getSessionGroupBestFromSesion,
  getSessionGroupBests,
  getSessionGroupStats,
  getSessionStats,
  updateSessionGroupBest,
} from "./sessionStats";
import _, { update } from "lodash";

describe("getSessionStats", () => {
  it("returns an object", () => {
    const session = { solves: [{ dur: 1 }] };
    expect(typeof getSessionStats(session)).toBe("object");
  });

  it("throws error if session has no solves", () => {
    expect(() => getSessionStats({ solves: [] })).toThrow();
  });
  it("throws error if first solve has no dur", () => {
    const session = { solves: [{ solveTime: { timeSeconds: 1 } }] };
    expect(() => getSessionStats(session)).toThrow();
  });
  test("object has sessionAverage and numSolves keys", () => {
    const session = { solves: [{ dur: 1 }] };
    expect(getSessionStats(session).sessionAverage).toBeDefined();
    expect(getSessionStats(session).numSolves).toBeDefined();
    expect(typeof getSessionStats(session).numSolves).toBe("number");
  });
  describe("given twelve or more solves", () => {
    const session = {
      solves: _.fill(Array(12), { dur: _.random(1, 10) }),
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
      solves: _.fill(Array(100), { dur: _.random(1, 10) }),
    };
    it("returns object with bestAo50 defined", () => {
      expect(getSessionStats(session).bestAo50).toBeDefined();
    });
    it("returns object with bestAo100 defined", () => {
      expect(getSessionStats(session).bestAo100).toBeDefined();
    });
  });
});

describe("getSessionGroupBest", () => {
  it("returns an object", () => {
    const session = {
      bests: { single: 10 },
      dateTime: new Date().toString(),
      id: "qwertyuiop",
    };
    expect(typeof getSessionGroupBestFromSesion(session, "single")).toBe(
      "object"
    );
  });
  it("object has keys dur, dateTime, sessionId", () => {
    const session = {
      bests: { single: 10 },
      dateTime: new Date().toString(),
      id: "qwertyuiop",
    };
    const keys = Object.keys(getSessionGroupBestFromSesion(session, "single"));
    expect(keys.includes("dur")).toBeTruthy();
    expect(keys.includes("dateTime")).toBeTruthy();
    expect(keys.includes("sessionId")).toBeTruthy();
  });
  test("returned object dur prop equals session best", () => {
    const session = {
      bests: { single: 10 },
      dateTime: new Date().toString(),
      id: "qwertyuiop",
    };
    expect(getSessionGroupBestFromSesion(session, "single").dur).toBe(10);
  });
});

describe("updateSessionGroupBest", () => {
  it("returns an object", () => {
    const bests = {};
    const session = {
      bests: { single: 10 },
      dateTime: new Date().toString(),
      id: "qwertyuiop",
    };
    expect(typeof updateSessionGroupBest(bests, session, "single")).toBe(
      "object"
    );
  });
  it("object has keys dur, dateTime, sessionId", () => {
    const bests = {};
    const session = {
      bests: { single: 10 },
      dateTime: new Date().toString(),
      id: "qwertyuiop",
    };
    const keys = Object.keys(updateSessionGroupBest(bests, session, "single"));
    expect(keys.includes("dur")).toBeTruthy();
    expect(keys.includes("dateTime")).toBeTruthy();
    expect(keys.includes("sessionId")).toBeTruthy();
  });
  describe("sessionBest exists", () => {
    describe("currentBest exists", () => {
      it("returns sessionBest if less than currentBest", () => {
        const sessionBest = 10;
        const currentBest = 20;

        const bests = { single: { dur: currentBest } };
        const session = { bests: { single: sessionBest } };
        const newBest = updateSessionGroupBest(bests, session, "single").dur;

        expect(newBest).toBe(sessionBest);
      });
      it("returns currentBest if less than sessionBest", () => {
        const sessionBest = 20;
        const currentBest = 10;

        const bests = { single: { dur: currentBest } };
        const session = { bests: { single: sessionBest } };
        const newBest = updateSessionGroupBest(bests, session, "single").dur;

        expect(newBest).toBe(currentBest);
      });
    });
    describe("currentBest does not exist", () => {
      it("returns sessionBest", () => {
        const bestName = "ao50";
        const sessionBest = 22;

        const bests = {
          single: { dur: 10 },
          ao5: { dur: 18 },
          ao12: { dur: 20 },
        };
        const session = {
          bests: { single: 19, ao5: 22, ao12: 24, ao50: sessionBest },
        };
        const newBest = updateSessionGroupBest(bests, session, bestName).dur;

        expect(newBest).toBe(sessionBest);
      });
    });
  });
  describe("sessionBest does not exist", () => {
    it("returns currentBest ", () => {
      const bestName = "ao100";
      const currentBest = 23.54;
      const bests = {
        single: { dur: 10 },
        ao5: { dur: 18 },
        ao12: { dur: 20 },
        ao50: { dur: 22 },
        ao100: { dur: currentBest },
      };
      const session = { bests: { single: 19, ao5: 22, ao12: 24 } };
      const newBest = updateSessionGroupBest(bests, session, bestName).dur;

      expect(newBest).toBe(currentBest);
    });
  });
});

describe("getSessionGroupBests", () => {
  it("returns an object", () => {
    const sessions = [
      {
        bests: { single: 10 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
      {
        bests: { single: 10, ao5: 18 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
    ];
    expect(typeof getSessionGroupBests(sessions)).toBe("object");
  });
  test("each child object has keys dur, dateTime, sessionId", () => {
    const sessions = [
      {
        bests: { single: 10 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
      {
        bests: { single: 10, ao5: 18 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
    ];
    const bestSingle = getSessionGroupBests(sessions).single;
    expect(Object.keys(bestSingle).includes("dur")).toBeTruthy();
    expect(Object.keys(bestSingle).includes("dateTime")).toBeTruthy();
    expect(Object.keys(bestSingle).includes("sessionId")).toBeTruthy();
  });
  test("num children === num bests of session with max num bests", () => {
    const sessions = [
      {
        bests: { single: 10 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
      {
        bests: { single: 10, ao5: 18 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
      {
        bests: { single: 10, ao5: 18, ao12: 20, ao50: 22 },
        dateTime: new Date().toString(),
        id: "qwertyuiop",
      },
    ];
    const sessionGroupBests = getSessionGroupBests(sessions);
    expect(Object.keys(sessionGroupBests).length).toBe(4);
  });
  it("works as expected on a complex example", () => {
    const sessions = [
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
      },
      {
        bests: { single: 12, ao5: 17 },
        dateTime: "date2",
        id: "2345",
      },
      {
        bests: { single: 17, ao5: 19, ao12: 20, ao50: 22, ao100: 23 },
        dateTime: "date2",
        id: "3456",
      },
      {
        bests: { single: 15, ao5: 18, ao12: 19, ao50: 21 },
        dateTime: "date3",
        id: "4567",
      },
    ];
    const result = getSessionGroupBests(sessions);
    const expectedResult = {
      single: { dur: 12, dateTime: "date2", sessionId: "2345" },
      ao5: { dur: 17, dateTime: "date2", sessionId: "2345" },
      ao12: { dur: 19, dateTime: "date3", sessionId: "4567" },
      ao50: { dur: 21, dateTime: "date3", sessionId: "4567" },
      ao100: { dur: 23, dateTime: "date2", sessionId: "3456" },
    };
    expect(result).toEqual(expectedResult);
  });
});

describe("getSessionGroupStats", () => {
  it("returns an object", () => {
    const sessions = [
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
      },
    ];
    expect(typeof getSessionGroupStats(sessions)).toBe("object");
  });
  test("returned value has bests,numSolves,numSessions keys", () => {
    const sessions = [
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
      },
    ];
    const keys = Object.keys(getSessionGroupStats(sessions));
    ["bests", "numSolves", "numSessions"].forEach((key) =>
      expect(keys.includes(key)).toBeTruthy()
    );
  });
  test("numSessions === sessions.length", () => {
    const sessions = [
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
      },
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
      },
    ];
    expect(getSessionGroupStats(sessions).numSessions).toBe(2);
  });
  test("numSolves === sum of numSolves in each session", () => {
    const sessions = [
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
        numSolves: 5,
      },
      {
        bests: { single: 16 },
        dateTime: "date1",
        id: "1234",
        numSolves: 6,
      },
    ];
    expect(getSessionGroupStats(sessions).numSolves).toBe(11);
  });
});
