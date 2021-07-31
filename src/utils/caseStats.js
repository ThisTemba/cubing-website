import _ from "lodash";

const CASE_SOLVES_CAP = 10;
const CASE_SOLVES_STAT_CAP = 3;

export const prepareCaseData = (newSolves, oldDoc) => {
  const numSolves = getNumSolves(newSolves, oldDoc);
  const recentCaseSolves = getRecentCaseSolves(
    newSolves,
    oldDoc,
    CASE_SOLVES_CAP
  );
  const caseStats = getCaseStats(
    recentCaseSolves,
    numSolves,
    CASE_SOLVES_STAT_CAP
  );
  return { caseStats, recentCaseSolves };
};

export const getNumSolves = (newSolves, oldDoc) => {
  let numSolves = newSolves.length;
  numSolves += oldDoc.exists ? oldDoc.data().caseStats.numSolves : 0;
  return numSolves;
};

export const getRecentCaseSolves = (newSolves, oldDoc, num) => {
  const oldSolves = oldDoc.exists ? oldDoc.data().recentCaseSolves : [];
  const allSolves = [...newSolves, ...oldSolves];
  return _.take(allSolves, num);
};

export const getCaseStats = (recentCaseSolves, numSolves, statsCap) => {
  const statCaseSolves = _.take(recentCaseSolves, statsCap);
  const numStatSolves = statCaseSolves.length;
  const rates = calculateRates(statCaseSolves, numStatSolves);
  const avgTime = _.mean(statCaseSolves.map((s) => s.dur));
  const caseStats = {
    numSolves,
    ...rates,
    avgTime,
    numStatSolves,
  };
  return caseStats;
};

const calculateRates = (caseSolves, numSolves) => {
  let hRate = caseSolves.filter((s) => s.hesitated === true);
  let mmRate = caseSolves.filter((s) => s.mistakes === 1);
  let cmRate = caseSolves.filter((s) => s.mistakes === 2);
  hRate = hRate.length / numSolves;
  mmRate = mmRate.length / numSolves;
  cmRate = cmRate.length / numSolves;
  return { hRate, mmRate, cmRate };
};
