import { weightedRandomIndex } from "./weightedRandom";

const getProbsFromCounts = (counts) => {
  if (counts.includes(0)) {
    const relProbs = counts.map((n) => (n === 0 ? 1 : 0));
    return relProbs;
  } else {
    const first = counts[0];
    const relProbs = counts.map((n, i) => (i === 0 ? 1 : first / n));
    return relProbs;
  }
};

const balancedRandomIndex = (counts) => {
  return weightedRandomIndex(getProbsFromCounts(counts));
};
export default balancedRandomIndex;
