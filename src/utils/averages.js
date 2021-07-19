import _ from "lodash";

export const aolastN = (solves, N) => {
  const Nsolves = _.takeRight(solves, N);
  return aoN(Nsolves, N);
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
  else return _.mean(trimmed.map((s) => s.solveTime.timeSeconds));
};

export const DNFsort = (solves) => {
  let DNFsolves = _.groupBy(solves, "penalty")["DNF"];
  let nonDNFsolves = _.difference(solves, DNFsolves);
  DNFsolves = _.sortBy(DNFsolves, "solveTime.timeSeconds"); // why not
  nonDNFsolves = _.sortBy(nonDNFsolves, "solveTime.timeSeconds");
  const sortedSolves = _.concat(nonDNFsolves, DNFsolves);
  return sortedSolves;
};
