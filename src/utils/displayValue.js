import { getTimeString } from "./formatTime";

const undefinedValue = "-";

export const dispDur = (dur) => {
  if (typeof dur === "undefined") return undefinedValue;
  return dur === Infinity ? "DNF" : getTimeString(dur * 1000);
};

export const dispDecimal = (number, n = 2) => {
  if (typeof number === "undefined") return undefinedValue;
  return number.toFixed(n);
};

export const dispOverline = (string) => {
  return <span style={{ textDecoration: "overline" }}>{string}</span>;
};
