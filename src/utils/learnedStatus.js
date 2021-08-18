import _ from "lodash";

const opMap = {
  "<=": (a, b) => a <= b,
  ">=": (a, b) => a >= b,
};

export function getStatLearned(statObj, CaseLearnedCriteria) {
  if (typeof statObj !== "object") throw new Error("statObj must be an object");
  const [statName, statValue] = _.toPairs(statObj)[0];
  if (_(CaseLearnedCriteria).has(statName)) {
    const { symbol, threshold } = CaseLearnedCriteria[statName];
    return opMap[symbol](statValue, threshold);
  } else return null;
}

export function getCaseLearned(cas, CaseLearnedCriteria) {
  if (!CaseLearnedCriteria) return;
  const learnedbools = Object.keys(CaseLearnedCriteria).map((key) => {
    return getStatLearned({ [key]: cas[key] }, CaseLearnedCriteria);
  });
  return !_.some(learnedbools, (b) => b === false);
}

export function getStatus(cas, CaseLearnedCriteria) {
  const learned = getCaseLearned(cas, CaseLearnedCriteria);
  const hasSolves = cas.numSolves > 0;
  return learned ? 2 : hasSolves ? 1 : 0;
}

export function aggregateStatus(values) {
  return _.countBy(values);
}

export function sortStatusSingle(sA, sB) {
  return sA > sB ? 1 : -1;
}

export function sortStatusAggregated(statusCountsA, statusCountsB) {
  const totalA = _.sum(_.values(statusCountsA));
  const totalB = _.sum(_.values(statusCountsB));
  const sB = _.mapValues(statusCountsB, (s) => s / totalB);
  const sA = _.mapValues(statusCountsA, (s) => s / totalA);
  const AisBigger = sA[2] !== sB[2] ? sA[2] > sB[2] : sA[1] > sB[1];
  return AisBigger ? 1 : -1;
}

export function sortStatus(sA, sB) {
  return typeof sA === "object"
    ? sortStatusAggregated(sA, sB)
    : sortStatusSingle(sA, sB);
}
