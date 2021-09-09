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

// const getFtrick = (grip, move, dataFromPreviousMoves) => {
//   // given a certain grip, the desired move and some data from previous moves, pick the best fingertrick
//   const fullCode = grips[grip][move]?.[0];
//   if (typeof fullCode === "undefined") {
//     throw new Error(`No data for ${move} move in ${grip} grip`);
//   }
//   if (fullCode === null) {
//     const ftrick = null;
//     return { code: fullCode, ftrick };
//   }
//   const hand = fullCode > 0xff ? 1 : 0;
//   const fingerMotion = fullCode > 0xff ? fullCode - 0x100 : fullCode;
//   const ftrick = _.find(fingertricks, ["code", fingerMotion]);
//   console.log(ftrick);

//   return { code: fullCode, ftrick, hand };
// };

// const attempAlgWithGrip = (initGrip, alg) => {
//   const moves = alg.split(" ");
//   let grip = initGrip;
//   const ftricks = [];
//   moves.forEach((move) => {
//     const { code, ftrick, hand } = getFtrick(grip, move);
//     grip = changeGrip(grip, ftrick?.regrip);
//     if (code !== null && code !== undefined) {
//       ftricks.push(hand ? "left" : "right" + " " + ftrick?.description);
//       const fullCode = parseCode(ftrick?.code);
//       fullCode[2] = hand;
//       const finger = fullCode.slice(1);
//       console.log(finger);
//     } else {
//       ftricks.push(null);
//     }
//   });
//   return ftricks;
// };

// const attemptAlg = (alg) => {
//   const grips = ["home", "R", "R'"];
//   const solutions = [];
//   grips.forEach((grip) => {
//     const ftricks = attempAlgWithGrip(grip, alg);
//     if (!ftricks.includes(null) && !ftricks.includes(undefined)) {
//       solutions.push({ grip, ftricks });
//     }
//   });
//   solutions.forEach(({ ftricks, grip }) => {
//     console.log();
//     console.log(`Basic solution with ${grip} grip:`);
//     ftricks.forEach((a) => console.log(a));
//   });
//   if (solutions.length === 0) console.log("No basic solutions found");
// };

// const res = attemptAlg("R U R' U' R' F R2 U' R' U' R U R' F'");
