const defaultTrainSettings = {
  hRate: 0.4,
  mmRate: 0.4,
  cmRate: 0.1,
  avgTPS: 2,
  numSolves: 5,
};

export const getPropLearned = (prop, val, userTrainSettings) => {
  const trainSettings = userTrainSettings || defaultTrainSettings;
  const settingsValue = trainSettings[prop];
  const map = {
    hRate: { symbol: "<" },
    mmRate: { symbol: "<" },
    cmRate: { symbol: "<" },
    avgTPS: { symbol: ">" },
    numSolves: { symbol: ">" },
  };
  if (typeof map[prop] === "undefined") return null;
  if (map[prop].symbol === ">") {
    return val >= settingsValue;
  } else if (map[prop].symbol === "<") {
    return val <= settingsValue;
  } else throw new Error("symbol not recognized");
};

export const getStatus = (cas, trainSettings) => {
  const { hRate, mmRate, cmRate, avgTPS, numSolves } = cas;
  const allLearned =
    getPropLearned("hRate", hRate, trainSettings) &&
    getPropLearned("cmRate", cmRate, trainSettings) &&
    getPropLearned("mmRate", mmRate, trainSettings) &&
    getPropLearned("avgTPS", avgTPS, trainSettings) &&
    getPropLearned("numSolves", numSolves, trainSettings);
  if (allLearned) return 2;
  if (numSolves > 0) return 1;
  return 0;
};
