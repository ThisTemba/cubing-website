import pllCaseSet from "./pllCaseSet";
import ollCaseSet from "./ollCaseSet";
import oellCaseSet from "./oellCaseSet";
import _ from "lodash";

const caseSets = [ollCaseSet, pllCaseSet, oellCaseSet];
const caseSetKeys = ["details", "cases"];
const detailsKeys = ["id", "name", "mask", "view", "numCases"];
const caseKeys = ["id", "name", "group", "scrambles", "algs"];

const testForKeys = (object, keys) => {
  keys.forEach((key) => {
    it(`has ${key} property`, () => {
      expect(object[key]).toBeDefined();
    });
  });
};

caseSets.forEach((caseSet) => {
  describe(caseSet.details.name, () => {
    testForKeys(caseSet, caseSetKeys);

    test("cases isn't empty", () => {
      expect(caseSet.cases.length > 0);
    });

    describe("details", () => {
      const details = caseSet.details;
      testForKeys(details, detailsKeys);

      test("numCases is accurate", () => {
        const { numCases } = details;
        const { cases } = caseSet;
        expect(numCases).toBe(cases.length);
      });
    });

    describe("random case", () => {
      const cas = _.sample(caseSet.cases);
      testForKeys(cas, caseKeys);

      it("scrambles has at least four scrambles", () => {
        expect(cas.scrambles.length >= 4).toBeTruthy();
      });
      it("algs isn't empty", () => {
        expect(cas.algs.length > 0).toBeTruthy();
      });
    });
  });
});
