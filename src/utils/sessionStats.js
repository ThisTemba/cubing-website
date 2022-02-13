import { getSessionAverage, bestAoN } from "./averages";
import { getP10, getP90, getQ1, getQ2, getQ3 } from "../utils/quantiles";
import _ from "lodash";
import standardDeviation from "./standardDeviation";

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

export const newGetSessionStats = ({ solves }) => {
  if (!solves.length) throw new Error("session has no solves");
  if (solves[0].dur === undefined)
    throw new Error("some solves don't have durs");
  const durs = solves.map((s) => s.dur);

  // Always
  const numSolves = durs.length;
  const sessionAverage = getSessionAverage(durs);
  const bests = { single: Math.min(...durs) };

  const nonDNFDurs = durs.filter((dur) => dur !== Infinity);
  const quartiles = {
    q1: getQ1(nonDNFDurs),
    q2: getQ2(nonDNFDurs),
    q3: getQ3(nonDNFDurs),
  };
  const percentiles = {
    p10: getP10(nonDNFDurs),
    p90: getP90(nonDNFDurs),
  };
  const mean = _.mean(nonDNFDurs);
  const sd = standardDeviation(nonDNFDurs);
  const numNonDNFSolves = nonDNFDurs.length;
  const worstSingle = Math.max(...durs);
  const worstNonDNFSingle = Math.max(...nonDNFDurs);
  const worsts = { single: worstSingle, nonDNFSingle: worstNonDNFSingle };

  let stats = {
    sessionAverage,
    numSolves,
    numNonDNFSolves,
    bests,
    worsts,
    quartiles,
    percentiles,
    mean,
    sd,
  };

  // Conditionally
  let averagesToGet = [5, 12, 50, 100];
  averagesToGet = averagesToGet.filter((n) => n <= solves.length);
  averagesToGet.forEach((n) => (bests[`ao${n}`] = bestAoN(durs, n)));

  // TODO: add quartiles if there is enough data
  return stats;
};

export const getSessionGroupBestFromSesion = (sesh, bestName) => {
  const sessionGroupBest = {
    dur: sesh.bests[bestName],
    dateTime: sesh.dateTime,
    sessionId: sesh.id,
  };
  return sessionGroupBest;
};

export const updateSessionGroupBest = (bests, sesh, bestName) => {
  const sessionBest = sesh.bests[bestName];
  const currentBest = bests[bestName]?.dur;
  if (sessionBest) {
    const newBest = currentBest && sessionBest < currentBest;
    const noCurrentBest = !currentBest;
    if (newBest || noCurrentBest) {
      return getSessionGroupBestFromSesion(sesh, bestName);
    }
  }
  return bests[bestName];
};

export const getSessionGroupBests = (sessions) => {
  const bests = {};
  sessions.forEach((sesh) => {
    Object.keys(sesh.bests).forEach((bestName) => {
      bests[bestName] = updateSessionGroupBest(bests, sesh, bestName);
    });
  });
  return bests;
};

export const getSessionGroupStats = (sessions) => {
  const numSolves = _.sumBy(sessions, "numSolves");
  // const numNonDNFSolves = _.sumBy(sessions, "numNonDNFSolves");
  const numSessions = sessions.length;

  const bests = getSessionGroupBests(sessions);

  const sessionGroupStats = { numSolves, numSessions, bests };
  return sessionGroupStats;
};
