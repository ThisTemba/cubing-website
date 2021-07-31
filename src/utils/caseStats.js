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

  // num case solves to store: CASE_SOLVES_CAP
  let recentCaseSolves = _.take(allSolves, CASE_SOLVES_CAP);

  // num case solves to calculate stats from: CASE_SOLVES_STAT_CAP
  let statCaseSolves = _.take(recentCaseSolves, CASE_SOLVES_STAT_CAP);
  let hRate = statCaseSolves.filter((s) => s.hesitated === true);
  let mmRate = statCaseSolves.filter((s) => s.mistakes === 1);
  let cmRate = statCaseSolves.filter((s) => s.mistakes === 2);
  hRate = hRate.length / statCaseSolves.length;
  mmRate = mmRate.length / statCaseSolves.length;
  cmRate = cmRate.length / statCaseSolves.length;
  const avgTime = _.mean(statCaseSolves.map((s) => s.dur));
  const caseStats = {
    numSolves,
    hRate,
    mmRate,
    cmRate,
    avgTime,
  };

  const data = { caseStats, recentCaseSolves };
  console.log("preparedData", data);

  return data;
};
