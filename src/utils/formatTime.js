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

export const getSolveTime = (time, isSeconds = false) => {
  if (typeof time !== "number") throw new Error("time must be a number");
  if (typeof isSeconds !== "boolean")
    throw new Error("isSeconds must be a boolean");
  const timeRaw = Math.round(isSeconds ? time * 1000 : time); // ms
  const timeSeconds = timeRaw / 1000;
  const timeString = getTimeString(timeRaw);
  const solveTime = { timeRaw, timeSeconds, timeString };
  return solveTime;
};
