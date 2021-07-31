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
const wideToFaceMap = {
  r: "x L",
  u: "y D",
  f: "z B",
  l: "x' R",
  d: "y' U",
  b: "z' F",
  "r'": "x' L'",
  "u'": "y' D'",
  "f'": "z' B'",
  "l'": "x R'",
  "d'": "y U'",
  "b'": "z F'",
};
const sliceToFaceMap = {
  M: "x' R L'",
  E: "y' U D'",
  S: "z F' B",
  "M'": "x R' L",
  "E'": "y U' D",
  "S'": "z' F B'",
};

export const toFaceMoves = (alg) => {
  let moves = alg.split(" ");
  moves = moves.map((m) => {
    if (sliceMoves.includes(m[0])) return sliceToFaceMap[m];
    if (wideMoves.includes(m[0])) return wideToFaceMap[m];
    return m;
  });
  return moves.join(" ");
};

export const invertAlg = (alg) => {
  if (!isValidAlg(alg)) throw new Error("input is not a valid algorithm");
  const invertedAlg = _(alg)
    .split(" ")
    .reverse()
    .map((m) => invertMove(m))
    .join(" ");
  return invertedAlg;
};

const invertMove = (move) => {
  let result = "";
  _.endsWith(move, "2")
    ? (result = move)
    : _.endsWith(move, "'")
    ? (result = move.slice(0, -1))
    : (result = move + "'");
  return result;
};

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
  if (move.length > 3) return false;
  if (!validMoves.includes(move[0])) return false;
  if (move.length === 2) {
    if (!modifiers.includes(move[1])) return false;
  }
  if (move.length === 3) {
    if (!modifiers.includes(move[2])) return false;
    if (move[1] === move[2]) return false;
  }
  return true;
};

export const getSTM = (alg) => {
  if (!isValidAlg(alg)) throw new Error("alg is not valid");
  let inter = alg.replace(/'/g, "");
  inter = inter.replace(/2/g, "");
  const rawMoves = inter.split(" ");
  const nonRotMoves = _.difference(rawMoves, cubeRotations);
  return nonRotMoves.length;
};
