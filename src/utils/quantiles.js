// sort array ascending
const asc = (arr) => arr.sort((a, b) => a - b);

const quantile = (arr, q) => {
  const sorted = asc(arr);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};
export const getP10 = (arr) => quantile(arr, 0.1);
export const getP90 = (arr) => quantile(arr, 0.95);

export const getQ0 = (arr) => quantile(arr, 0);
export const getQ1 = (arr) => quantile(arr, 0.25);
export const getQ2 = (arr) => quantile(arr, 0.5);
export const getQ3 = (arr) => quantile(arr, 0.75);
export const getQ4 = (arr) => quantile(arr, 1);
