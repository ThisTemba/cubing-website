import {
  getSessionAverage,
  getBestSingle,
  getWorstSingle,
  bestAoN,
} from "./averages";

export const getSessionStats = ({ solves }) => {
  if (!solves.length) throw new Error("session has no solves");
  if (solves[0].dur === undefined)
    throw new Error("some solves don't have durs");
  const durs = solves.map((s) => s.dur);

  // Always
  const numSolves = durs.length;
  const bestSingle = Math.min(...durs);
  const worstSingle = Math.max(...durs);
  const sessionAverage = getSessionAverage(durs);

  let stats = { sessionAverage, numSolves, bestSingle, worstSingle };

  // Conditionally
  let averagesToGet = [5, 12, 50, 100];
  averagesToGet = averagesToGet.filter((n) => n <= solves.length);
  averagesToGet.forEach((n) => (stats[`bestAo${n}`] = bestAoN(durs, n)));

  // TODO: add quartiles if there is enough data
  return stats;
};
