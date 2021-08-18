import { weightedRandomIndex } from "./weightedRandom";

const getProbsFromCounts = (counts) => {
  if (counts.includes(0)) {
    const relProbs = counts.map((n) => (n === 0 ? 1 : 0));
    return relProbs;
  } else {
    const relProbs = counts.map((n) => 1 / n);
    return relProbs;
  }
};

const balancedRandomIndex = (counts) => {
  return weightedRandomIndex(getProbsFromCounts(counts));
};
export default balancedRandomIndex;
