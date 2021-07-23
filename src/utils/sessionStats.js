import {
  getSessionAverage,
  getBestSingle,
  getWorstSingle,
  bestAoN,
} from "./averages";

export const getSessionStats = ({ solves }) => {
  if (!solves.length) throw new Error("session has no solves");

  // Always
  const numSolves = solves.length;
  const bestSingle = getBestSingle(solves);
  const worstSingle = getWorstSingle(solves);
  const sessionAverage = getSessionAverage(solves);

  let stats = { sessionAverage, numSolves, bestSingle, worstSingle };

  // Conditionally
  let averagesToGet = [5, 12, 50, 100];
  averagesToGet = averagesToGet.filter((n) => n <= solves.length);
  averagesToGet.forEach((n) => (stats[`bestAo${n}`] = bestAoN(solves, n)));

  // TODO: add quartiles if there is enough data
  return stats;
};
