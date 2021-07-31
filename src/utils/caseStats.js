import _ from "lodash";

const CASE_SOLVES_CAP = 10;
const CASE_SOLVES_STAT_CAP = 3;

export const prepareCaseData = (solves, caseId, oldDoc) => {
  let newSolves = _.filter(solves, ["caseId", caseId]);
  let oldSolves = [];
  let numSolves = newSolves.length;
  if (oldDoc.exists) {
    oldSolves = oldDoc.data().recentCaseSolves;
    numSolves += oldDoc.data().caseStats.numSolves;
  }
  let allSolves = [...newSolves, ...oldSolves];
  let recentCaseSolves = _.take(allSolves, CASE_SOLVES_CAP);

  // num case solves to calculate stats from: CASE_SOLVES_STAT_CAP
  let statCaseSolves = _.take(recentCaseSolves, CASE_SOLVES_STAT_CAP);
  const caseStats = getCaseStats(statCaseSolves, numSolves);

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

const getCaseStats = (caseSolves, numSolves) => {
  const numStatSolves = caseSolves.length;
  let hRate = caseSolves.filter((s) => s.hesitated === true);
  let mmRate = caseSolves.filter((s) => s.mistakes === 1);
  let cmRate = caseSolves.filter((s) => s.mistakes === 2);
  hRate = hRate.length / numStatSolves;
  mmRate = mmRate.length / numStatSolves;
  cmRate = cmRate.length / numStatSolves;
  const avgTime = _.mean(caseSolves.map((s) => s.dur));
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
