
const isValid = value => value !== Infinity && !isNaN(value) && typeof value === 'number';

const FASTER_THRESHOLD = 1.1;

export const isFaster = (a, b) => {
  if(!isValid(b)) {
    return isValid(a);
  }
  if(!isValid(a)) {
    return false;
  }
  return a > (b * FASTER_THRESHOLD);
}
export const isSlower = (a, b) => isFaster(b, a);