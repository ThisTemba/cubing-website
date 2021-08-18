import { weightedRandomIndex } from "./weightedRandom";

const getProbsFromCounts = (counts) => {
  const zeroProb = counts.length / 2;
  return counts.map((n) => (n === 0 ? zeroProb : 1 / n));
};

const balancedRandomIndex = (counts) => {
  return weightedRandomIndex(getProbsFromCounts(counts));
};
export default balancedRandomIndex;
