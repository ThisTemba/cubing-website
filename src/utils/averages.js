import _ from "lodash";

export const getBestSingle = (solves) => {
  return _.min(solves.map((s) => s.solveTime.timeSeconds));
};

export const getWorstSingle = (solves) => {
  return _.max(solves.map((s) => s.solveTime.timeSeconds));
};

export const getSessionAverage = (solves) => {
  if (solves.length >= 5) return aoAll(solves);
  else return getMeanTimeSeconds(solves);
};

export const bestAoN = (solves, n) => {
  const AoNlist = listAoNs(solves, n);
  const bestAoN = Math.min(...AoNlist.filter((i) => typeof i === "number"));
  return bestAoN;
};

export const listAoNs = (solves, n) => {
  let poppableSolves = [...solves];
  let AoNlist = [];
  let noValueValue = "-";
  if (solves.length < n) return solves.map(() => noValueValue);
  while (poppableSolves.length >= n) {
    AoNlist.push(aolastN(poppableSolves, n));
    poppableSolves.pop();
  }
  const end = Array(n - 1).fill(noValueValue);
  return [...AoNlist, ...end].reverse();
};

export const aolastN = (solves, n) => {
  return aoAll(_.takeRight(solves, n));
};

export const aoAll = (solves) => {
  if (solves.length < 5)
    throw new Error("Need at least 5 solves to calculate aoAll");
  let sorted = _.sortBy(solves, "solveTime.timeSeconds"); // works because for DNF timeSeconds = Infinity
  let trimmed = _.slice(
    sorted,
    Math.ceil(solves.length * 0.05),
    sorted.length - Math.ceil(solves.length * 0.05)
  );
  return getMeanTimeSeconds(trimmed);
};

export const getMeanTimeSeconds = (solves) => {
  if (solves[0].solveTime === undefined)
    throw new Error("solves does not have solveTime");
  if (solves[0].solveTime.timeSeconds === undefined)
    throw new Error("solveTime does not have timeSeconds");
  const times = solves.map((s) => s.solveTime.timeSeconds);
  return _.chain(times).mean().round(2).value();
};
