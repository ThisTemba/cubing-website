import _ from "lodash";
import { getSTM } from "./algTools";

const CASE_SOLVES_CAP = 100;
const CASE_SOLVES_STAT_CAP = 20;

export const prepareCaseData = (newSolves, oldDoc) => {
  let CSC = CASE_SOLVES_CAP;
  let CSSC = CASE_SOLVES_STAT_CAP;
  const numSolves = getNumSolves(newSolves, oldDoc);
  const recentCaseSolves = getRecentCaseSolves(newSolves, oldDoc, CSC);
  const caseStats = getCaseStats(recentCaseSolves, numSolves, CSSC);
  return { caseStats, recentCaseSolves };
};

export const getNumSolves = (newSolves, oldDoc) => {
  const numNewSolves = newSolves.length;
  const numOldSolves = oldDoc?.data()?.caseStats?.numSolves || 0;
  return numNewSolves + numOldSolves;
};

export const getRecentCaseSolves = (newSolves, oldDoc, num) => {
  const oldSolves = oldDoc.data()?.recentCaseSolves || [];
  return _.take([...newSolves, ...oldSolves], num);
};

const calculateRates = (caseSolves, numSolves) => {
  const cSs = caseSolves;
  const n = numSolves;
  let hRate = cSs.filter((s) => s.hesitated === true).length / n;
  let nmRate = cSs.filter((s) => s.mistakes === 0).length / n;
  let mmRate = cSs.filter((s) => s.mistakes === 1).length / n;
  let cmRate = cSs.filter((s) => s.mistakes === 2).length / n;
  return { hRate, nmRate, mmRate, cmRate };
};

export const getCaseStats = (recentCaseSolves, numSolves, statsCap) => {
  const statCaseSolves = _.take(recentCaseSolves, statsCap);
  const numStatSolves = statCaseSolves.length;
  const rates = calculateRates(statCaseSolves, numStatSolves);
  const avgTime = _.mean(statCaseSolves.map((s) => s.dur));
  const totTime = _.sum(statCaseSolves.map((s) => s.dur));
  const totAlgLen = _.sum(statCaseSolves.map((s) => getSTM(s.alg)));
  const moveTime = 0.2; // the minimum ammount of time needed to let go of the spacebar and hit it again
  // by excluding this time, TPS is made slightly more accurate
  // without it, longer algorithms tend to have higher TPSes
  // TODO: This is bad for super quick solves
  const totTimeAdjusted = totTime - numStatSolves * moveTime;
  const avgTPS = totAlgLen / totTimeAdjusted;
  const caseStats = {
    numSolves,
    ...rates,
    avgTime,
    avgTPS,
    numStatSolves,
  };
  return caseStats;
};
