import _ from "lodash";

const CASE_SOLVES_CAP = 10;
const CASE_SOLVES_STAT_CAP = 3;

export const prepareCaseData = (newSolves, oldDoc) => {
  const numSolves = getNumSolves(newSolves, oldDoc);
  const recentCaseSolves = getRecentCaseSolves(newSolves, oldDoc);
  const caseStats = getCaseStats(recentCaseSolves, numSolves);

  const data = { caseStats, recentCaseSolves };
  console.log("preparedData", data);

  return data;
};

const getNumSolves = (newSolves, oldDoc) => {
  let numSolves = newSolves.length;
  numSolves += oldDoc.exists ? oldDoc.data().caseStats.numSolves : 0;
  return numSolves;
};

const getRecentCaseSolves = (newSolves, oldDoc) => {
  const oldSolves = oldDoc.exists ? oldDoc.data().recentCaseSolves : [];
  const allSolves = [...newSolves, ...oldSolves];
  return _.take(allSolves, CASE_SOLVES_CAP);
};

const getCaseStats = (recentCaseSolves, numSolves) => {
  const statCaseSolves = _.take(recentCaseSolves, CASE_SOLVES_STAT_CAP);
  const numStatSolves = statCaseSolves.length;
  let hRate = statCaseSolves.filter((s) => s.hesitated === true);
  let mmRate = statCaseSolves.filter((s) => s.mistakes === 1);
  let cmRate = statCaseSolves.filter((s) => s.mistakes === 2);
  hRate = hRate.length / numStatSolves;
  mmRate = mmRate.length / numStatSolves;
  cmRate = cmRate.length / numStatSolves;
  const avgTime = _.mean(statCaseSolves.map((s) => s.dur));
  const caseStats = {
    numSolves,
    hRate,
    mmRate,
    cmRate,
    avgTime,
    numStatSolves,
  };
  return caseStats;
};
