export const getTimeString = (timeMilliseconds) => {
  let cs = Math.floor(timeMilliseconds / 10) % 100; // centiseconds
  let s = Math.floor(timeMilliseconds / 1000) % 60;
  let m = Math.floor(timeMilliseconds / 60000) % 60;
  cs = cs < 10 ? "0" + cs : cs;
  let timeString = "";
  if (m === 0) {
    timeString = `${s}.${cs}`;
  } else {
    s = s < 10 ? "0" + s : s;
    timeString = `${m}:${s}.${cs}`;
  }
  return timeString;
};

export const displayTimeSeconds = (timeSeconds) => {
  if (typeof timeSeconds !== "number") return timeSeconds;
  const res =
    timeSeconds === Infinity ? "DNF" : getTimeString(timeSeconds * 1000);
  return res;
};
