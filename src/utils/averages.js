import _ from "lodash";
import getTimeString from "./getTimeString";

export const getBestSingle = (solves) => {
  return _.min(getNonDNFTimes(solves));
};

export const getWorstSingle = (solves) => {
  return _.max(getNonDNFTimes(solves));
};

const getNonDNFTimes = (solves) => {
  return _.chain(solves)
    .filter((s) => s.penalty !== "DNF")
    .map((s) => s.solveTime.timeSeconds)
    .value();
};

export const getSessionAverage = (solves) => {
  if (solves.length >= 5) return aoAll(solves);
  else if (_.some(solves, ["penalty", "DNF"])) return "DNF";
  else {
    let times = solves.map((s) => s.solveTime.timeSeconds);
    console.log(times);
    const res = _.chain(times).mean().round(2).value();
    return res;
  }
};

export const bestAoN = (solves, n) => {
  if (solves.length < n)
    throw `Can't get best Ao${n} from ${solves.length} solves`;
  let poppableSolves = [...solves];
  let bestAvg = aolastN(solves, n);
  while (poppableSolves.length >= n) {
    let avg = aolastN(poppableSolves, n);
    bestAvg =
      (avg !== "DNF" && avg < bestAvg) || bestAvg === "DNF" ? avg : bestAvg;
    poppableSolves.pop();
    console.log(avg);
  }
  console.log("bestAvg:", bestAvg);
  return bestAvg;
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
  if (solves.length < 5) throw "Need at least 5 solves to calculate aoAll";
  let sorted = DNFsort(solves);
  let trimmed = _.slice(
    sorted,
    Math.ceil(solves.length * 0.05),
    sorted.length - Math.ceil(solves.length * 0.05)
  );

  if (_.some(trimmed, ["penalty", "DNF"])) return "DNF";
  else {
    const times = trimmed.map((s) => s.solveTime.timeSeconds);
    return getTimeString(_.round(_.mean(times), 2) * 1000);
  }
};

export const DNFsort = (solves) => {
  let DNFsolves = _.groupBy(solves, "penalty")["DNF"];
  let nonDNFsolves = _.difference(solves, DNFsolves);
  DNFsolves = _.sortBy(DNFsolves, "solveTime.timeSeconds"); // why not
  nonDNFsolves = _.sortBy(nonDNFsolves, "solveTime.timeSeconds");
  const sortedSolves = _.concat(nonDNFsolves, DNFsolves);
  return sortedSolves;
};
