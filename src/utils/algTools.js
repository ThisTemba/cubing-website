import _ from "lodash";

const faceMoves = ["R", "L", "U", "D", "F", "B"];
const wideMoves = ["r", "l", "u", "d", "f", "b"];
const sliceMoves = ["M", "E", "S"];
const cubeRotations = ["x", "y", "z"];
export const validMoves = [].concat(
  faceMoves,
  wideMoves,
  sliceMoves,
  cubeRotations
);
export const modifiers = ["'", "2"];

export const isValidAlg = (alg) => {
  if (typeof alg !== "string") return false;
  const moves = alg.split(" ");
  let isValid = true;
  moves.forEach((m) => {
    if (isValidMove(m) === false) isValid = false;
  });
  return isValid;
};

export const isValidMove = (move) => {
  if (move.length > 2) return false;
  if (!validMoves.includes(move[0])) return false;
  if (move.length === 2) {
    if (!modifiers.includes(move[1])) return false;
  }
  return true;
};
