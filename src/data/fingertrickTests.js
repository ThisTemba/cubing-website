const { fingertricks, grips } = require("./fingertricks");
const _ = require("lodash");

function parseMask(arr, length) {
  if ("number" !== typeof arr) {
    return arr;
  }
  var ret = [];
  for (let i = 0; i < length; i++) {
    var val = arr & 0xf; // should use "/" instead of ">>" to avoid unexpected type conversion
    ret[i] = val === 15 ? -1 : val;
    arr /= 16;
  }
  return ret;
}

const parseCode = (code) => {
  const parsedCode = parseMask(code, 3);
  return parsedCode;
};

const changeGrip = (grip, regrip) => {
  let newGrip;
  if (grip === "home") {
    if (regrip === 0x060) newGrip = "R";
    if (regrip === 0x061) newGrip = "R'";
  }
  if (grip === "R") {
    if (regrip === 0x061) newGrip = "home";
    if (regrip === 0x063) newGrip = "R'";
  }
  if (grip === "R'") {
    if (regrip === 0x060) newGrip = "home";
    if (regrip === 0x062) newGrip = "R";
  }
  newGrip = newGrip || grip;
  //   console.log("grip + move = newGrip,", grip, move, newGrip);
  return newGrip;
};

const getFtrick = (grip, move) => {
  // given a certain grip, the desired move and some data from previous moves, pick the best fingertrick
  const code = grips[grip][move]?.[0];
  if (typeof code === "undefined") {
    throw new Error(`No data for ${move} move in ${grip} grip`);
  } else if (code === null) {
    // console.log("No good way to do this move with this grip");
    return { code: null };
  }
  const [hand, id] = [(code & 0xf00) / 256, code & 0x0ff]; // split first and last two digits
  const ftrick = _.find(fingertricks, ["id", id]);
  return { code, hand, ftrick };
};

const attempAlgWithGrip = (initGrip, alg) => {
  const moves = alg.split(" ");
  let grip = initGrip;
  const ftricks = [];
  moves.forEach((move) => {
    const { code, hand, ftrick } = getFtrick(grip, move);
    if (code === null) {
      ftricks.push(null);
      return;
    } else {
      const regrip = ftrick.regrip ? hand * 256 + ftrick.regrip : null;
      grip = changeGrip(grip, regrip);
      const { description0, description1 } = ftrick;
      const desc = hand === 0 ? description0 : description1 || description0;
      ftricks.push((hand === 0 ? "right" : "left") + " " + desc);
    }
  });
  return ftricks;
};

const attemptAlg = (alg, includeInvalid = false) => {
  const grips = ["home", "R", "R'"];
  const solutions = [];
  grips.forEach((grip) => {
    const ftricks = attempAlgWithGrip(grip, alg);
    const isValid = !ftricks.includes(null) && !ftricks.includes(undefined);
    const include = isValid || includeInvalid;
    if (include) solutions.push({ ftricks, grip });
  });
  if (solutions.length > 0) return solutions;
  else return null;
};

const solutions = attemptAlg("R U' R U R U R U' R' U' R2", true);
solutions?.forEach(({ ftricks, grip }) => {
  console.log();
  console.log(`Basic solution with ${grip} grip:`);
  ftricks.forEach((a) => console.log(a));
});

if (!solutions) console.log("No solutions for given grips");
