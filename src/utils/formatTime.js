export const getTimeString = (timeMilliseconds) => {
  let cs = Math.floor(timeMilliseconds / 10) % 100; // centiseconds
  let s = Math.floor(timeMilliseconds / 1000) % 60;
  let m = Math.floor(timeMilliseconds / 60000) % 60;
  cs = cs < 10 ? "0" + cs : cs;
  let timeString = "";
  if (m === 0) timeString = `${s}.${cs}`;
  else {
    s = s < 10 ? "0" + s : s;
    timeString = `${m}:${s}.${cs}`;
  }
  return timeString;
};

export const displayDur = (dur) => {
  return dur === Infinity ? "DNF" : getTimeString(dur * 1000);
};
