import { validMoves, modifiers, isValidMove, isValidAlg } from "./algTools";
import _, { curry } from "lodash";

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
