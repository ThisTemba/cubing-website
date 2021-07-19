import _ from "lodash";

export const getbestSingle = (solves) => {
  const bestSingle = Math.min(
    ...solves
      .filter((s) => s.penalty !== "DNF")
      .map((s) => s.solveTime.timeSeconds)
  );
  return bestSingle;
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

export const aolastN = (solves, n) => {
  return aoAll(_.takeRight(solves, n));
};

const aoAll = (solves) => {
  let sorted = DNFsort(solves);
  let trimmed = _.slice(
    sorted,
    Math.ceil(solves.length * 0.05),
    sorted.length - Math.ceil(solves.length * 0.05)
  );

  if (_.some(trimmed, ["penalty", "DNF"])) return "DNF";
  else {
    const times = trimmed.map((s) => s.solveTime.timeSeconds);
    return _.round(_.mean(times), 2);
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
