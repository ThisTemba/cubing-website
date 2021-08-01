const _ = require("lodash");

export const relToAbs = (ws) => {
  const sum = _.sum(ws);
  ws = ws.map((w) => w / sum);
  return ws;
};

export const cumSum = (arr) => {
  let cumArr = [...arr];
  cumArr.forEach((n, i) => (cumArr[i] = i > 0 ? n + cumArr[i - 1] : n));
  return cumArr;
};

export const weightedRandom = (array, probs) => {
  if (array.length !== probs.length)
    throw new Error("array and probs must have the same length");
  const cumProbs = cumSum(probs);
  const rand = Math.random();
  for (let i = 0; i < cumProbs.length; i++) {
    if (rand < cumProbs[i]) {
      var index = i;
      break;
    }
  }
  return array[index];
};
