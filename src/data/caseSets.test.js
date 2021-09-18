import pllCaseSet from "./pllCaseSet";
import ollCaseSet from "./ollCaseSet";
import eollCaseSet from "./eollCaseSet";
import ocllCaseSet from "./ocllCaseSet";
import epllCaseSet from "./epllCaseSet";
import cpllCaseSet from "./cpllCaseSet";
// import ttllCaseSet from "./ttllCaseSet";
// import tsleCaseSet from "./tsleCaseSet";
import f2l1CaseSet from "./f2l1CaseSet";
import _ from "lodash";
import { isValidAlg } from "../utils/algTools";

const caseSets = [
  ollCaseSet,
  pllCaseSet,
  eollCaseSet,
  ocllCaseSet,
  epllCaseSet,
  cpllCaseSet,
  // ttllCaseSet,
  // tsleCaseSet,
  f2l1CaseSet,
];
const caseSetKeys = ["details", "cases"];
const detailsKeys = ["id", "title", "mask", "view", "numCases"];
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

    describe("cases", () => {
      caseSet.cases.forEach((cas) => {
        describe(cas.name, () => {
          testForKeys(cas, caseKeys);

          it("scrambles has at least four scrambles", () => {
            expect(cas.scrambles.length >= 4).toBeTruthy();
          });
          it("algs isn't empty", () => {
            expect(cas.algs.length > 0).toBeTruthy();
          });
          it("all algs are valid", () => {
            cas.algs.forEach((alg) => {
              expect(isValidAlg(alg)).toBeTruthy();
            });
          });
        });
      });
    });
  });
});
