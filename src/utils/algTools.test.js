import {
  validMoves,
  modifiers,
  isValidMove,
  isValidAlg,
  invertAlg,
  toFaceMoves,
} from "./algTools";
import _, { curry } from "lodash";

describe("toFaceMoves", () => {
  it("does not affect non wide/slice moves", () => {
    expect(toFaceMoves("R U R' U' x")).toBe("R U R' U' x");
  });
  it("works with normal wide moves", () => {
    expect(toFaceMoves("r")).toBe("x L");
    expect(toFaceMoves("f")).toBe("z B");
  });
  it("works with normal slice moves", () => {
    expect(toFaceMoves("M")).toBe("x' R L'");
    expect(toFaceMoves("S")).toBe("z F' B");
  });
  it("works with inverted wide moves", () => {
    expect(toFaceMoves("r'")).toBe("x' L'");
  });
  it("works with inverted slice moves", () => {
    expect(toFaceMoves("M'")).toBe("x R' L");
    expect(toFaceMoves("S'")).toBe("z' F B'");
  });
});

describe("invertAlg", () => {
  it("throws error is alg is not valid", () => {
    expect(() => invertAlg("RU")).toThrowError();
  });
  it("returns an alg with the same number of moves", () => {
    const alg = "R U R' U'";
    const inLen = alg.split(" ").length;
    const outLen = invertAlg(alg).split(" ").length;
    expect(inLen).toBe(outLen);
  });
  it("works with some examples", () => {
    expect(invertAlg("R U R' U'")).toBe("U R U' R'");
    expect(invertAlg("R U R' U' x S2")).toBe("S2 x' U R U' R'");
  });
  it("returns a valid alg if input is valid", () => {
    expect(isValidAlg(invertAlg("R U R' U'"))).toBeTruthy();
  });
});

describe("isValidAlg", () => {
  it("returns a boolean", () => {
    expect(typeof isValidAlg()).toBe("boolean");
  });
  it("returns false if input is not a string", () => {
    expect(isValidAlg(true)).toBeFalsy();
    expect(isValidAlg(4)).toBeFalsy();
    expect(isValidAlg({})).toBeFalsy();
  });
  it("correctly validates these algs", () => {
    expect(isValidAlg("R U R' U'")).toBeTruthy();
    expect(isValidAlg("R U R' U' x S2")).toBeTruthy();
    expect(isValidAlg("R U r U' x M'")).toBeTruthy();
    expect(isValidAlg("RU R' U' x S2")).toBeFalsy();
    expect(isValidAlg("R U R' U' x Y")).toBeFalsy();
  });
});

describe("isValidMove", () => {
  it("returns a boolean", () => {
    expect(typeof isValidMove("")).toBe("boolean");
  });
  it("returns false if input is more than 2 chars", () => {
    expect(isValidMove("R'c")).toBeFalsy();
  });
  it("returns false if first character of input is not in validMoves", () => {
    expect(isValidMove("P")).toBeFalsy();
  });
  describe("input has two characters", () => {
    it("returns false if second character is not in modifiers", () => {
      expect(isValidMove("x`")).toBeFalsy();
    });
  });
  it("returns true otherwise", () => {
    const validMove = _.sample(validMoves);
    expect(isValidMove(validMove)).toBeTruthy();

    const validModifiedMove = validMove + _.sample(modifiers);
    expect(isValidMove(validModifiedMove)).toBeTruthy();
  });
});
