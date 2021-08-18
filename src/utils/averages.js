import _ from "lodash";

export const aoAll = (durs) => {
  if (durs.length < 5)
    throw new Error("Need at least 5 times to calculate aoAll");
  let sorted = _.sortBy(durs); // works because for DNF timeSeconds = Infinity
  const trimSize = Math.ceil(durs.length * 0.05);
  let trimmed = _.slice(sorted, trimSize, sorted.length - trimSize);
  return _.mean(trimmed);
};

export const aoLastN = (durs, n) => {
  return aoAll(_.takeRight(durs, n));
};

export const listAoNs = (durs, n) => {
  let dursCopy = [...durs];
  let AoNlist = [];
  let noValueValue = undefined;
  if (durs.length < n) return durs.map(() => noValueValue);
  while (dursCopy.length >= n) {
    AoNlist.push(aoLastN(dursCopy, n));
    dursCopy.pop();
  }
  const end = Array(n - 1).fill(noValueValue);
  return [...AoNlist, ...end].reverse();
};

export const bestAoN = (durs, n) => {
  if (n > durs.length) throw new Error("n must be <= durs.length");
  const AoNlist = listAoNs(durs, n);
  const bestAoN = Math.min(...AoNlist.filter((i) => typeof i === "number"));
  return bestAoN;
};

export const getSessionAverage = (durs) => {
  return durs.length >= 5 ? aoAll(durs) : _.mean(durs);
};
