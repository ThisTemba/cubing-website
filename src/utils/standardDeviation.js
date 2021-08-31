import _ from "lodash";

export default function standardDeviation(arr) {
  const mu = _.mean(arr);
  const squaredDifferences = _.map(arr, (val) => Math.pow(val - mu, 2));
  const variance = _.mean(squaredDifferences);
  const standardDeviation = Math.sqrt(variance);
  return standardDeviation;
}
