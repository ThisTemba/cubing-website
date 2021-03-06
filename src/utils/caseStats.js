import _ from "lodash";
import { getSTM } from "./algTools";

const CASE_SOLVES_CAP = 100;
const CASE_SOLVES_STAT_CAP = 20;

export const prepareCaseData = (newSolves, oldCaseDoc) => {
  let CSC = CASE_SOLVES_CAP;
  let CSSC = CASE_SOLVES_STAT_CAP;
  const numSolves = getNumSolves(newSolves, oldCaseDoc);
  const recentCaseSolves = getRecentCaseSolves(newSolves, oldCaseDoc, CSC);
  const caseStats = getCaseStats(recentCaseSolves, numSolves, CSSC);
  return { caseStats, recentCaseSolves };
};

export const getNumSolves = (newSolves, oldCaseDoc) => {
  const numNewSolves = newSolves.length;
  const numOldSolves = oldCaseDoc?.data()?.caseStats?.numSolves || 0;
  return numNewSolves + numOldSolves;
};

export const getRecentCaseSolves = (newSolves, oldCaseDoc, num) => {
  const oldSolves = oldCaseDoc.data()?.recentCaseSolves || [];
  const allSolves = [...newSolves, ...oldSolves];
  return _.take(allSolves, num);
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
  const times = _.map(statCaseSolves, "dur");
  const numStatSolves = statCaseSolves.length;
  const rates = calculateRates(statCaseSolves, numStatSolves);
  const avgTime = _.mean(times);
  const totAlgLen = _.sum(statCaseSolves.map((s) => getSTM(s.alg)));
  const moveTime = 0.2; // the minimum ammount of time needed to let go of the spacebar and hit it again
  // by excluding this time, TPS is made slightly more accurate
  // without it, longer algorithms tend to have higher TPSes
  // TODO: This is bad for super quick solves
  const totTimeAdjusted = _.sum(times) - numStatSolves * moveTime;
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
