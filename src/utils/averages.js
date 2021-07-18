import _ from "lodash";

export const aolastN = (solves, N) => {
  const Nsolves = _.takeRight(solves, N);
  return aoN(Nsolves, N);
};

export const aoN = (Nsolves, N) => {
  if (Nsolves.length !== N) {
    throw "Nsolves.length !== N in aoN calculation";
  }
  let sortedSolves = DNFsort(Nsolves);
  const excludeNum = Math.ceil(N * 0.05);
  console.log(excludeNum);

  let trimmedSolves = _.slice(
    sortedSolves,
    excludeNum,
    sortedSolves.length - excludeNum
  );

  if (_.some(trimmedSolves, ["penalty", "DNF"])) {
    return "DNF";
  } else {
    return _.mean(trimmedSolves.map((s) => s.solveTime.timeSeconds));
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
