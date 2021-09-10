const { fingertricks, grips } = require("./fingertricks");
const { Fingering } = require("./fingering");
const _ = require("lodash");

const fingering = new Fingering();

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
    if (regrip === 0x062) return null;
    if (regrip === 0x063) return null;
  }
  if (grip === "R") {
    if (regrip === 0x060) return null;
    if (regrip === 0x061) newGrip = "home";
    if (regrip === 0x062) return null;
    if (regrip === 0x063) newGrip = "R'";
  }
  if (grip === "R'") {
    if (regrip === 0x060) newGrip = "home";
    if (regrip === 0x061) return null;
    if (regrip === 0x062) newGrip = "R";
    if (regrip === 0x063) return null;
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
    return { code: null, hand: null, ftrick: null };
  }
  const { hand } = fingering.parseCode(code);
  const ftrick = fingering.findFingertrick(code);
  return { code, hand, ftrick };
};

const attemptRegripless = (initGrip, alg) => {
  if (alg.length === 0) return null;
  const moves = alg.split(" ");
  let grip = initGrip;
  const descs = [];
  const codes = [];
  const fingering1 = new Fingering();
  moves.forEach((move) => {
    const { code, hand, ftrick } = getFtrick(grip, move);
    if (code === null) {
      return;
    } else {
      fingering1.push(code);
      // const regrip = ftrick.regrip ? hand * 256 + ftrick.regrip : null;
      // grip = changeGrip(grip, regrip);
      // const { description0, description1 } = ftrick;
      // const desc = hand === 0 ? description0 : description1 || description0;
      // descs.push((hand === 0 ? "right" : "left") + " " + desc);
      // codes.push(hand * 256 + code);
    }
  });
  return fingering1;
};

const { descs } = attemptRegripless("home", "R U R'");
console.log(descs);

const attemptWithRegrips = (alg) => {
  const moves = alg.split(" ");
  const regrips = [null, 0x060, 0x061, 0x062, 0x063];
  const len = moves.length;
  const solution = { codes: [], descs: [] };
  let grip = "home";
  regrips.forEach((regrip) => {
    console.log();
    console.log(`For ${regrip?.toString(16)} regrip:`);
    for (let i = 0; i < len + 1; i++) {
      const head = moves.slice(0, i).join(" ");
      const tail = moves.slice(i).join(" ");

      const solHead = attemptRegripless(grip, head);
      if (solHead?.codes.includes(null)) continue;
      else {
        if (solHead) {
          solution.codes.push(...solHead?.codes);
          solution.descs.push(...solHead?.descs);
        }
      }

      const newGrip = changeGrip(solHead?.grip || grip, regrip);
      if (newGrip === null) continue;
      else {
        solution.codes.push(regrip);
        const id = regrip & 0xff;
        const hand = regrip & (0xf00 / 256);
        const { description0, description1 } = _.find(fingertricks, ["id", id]);
        const desc =
          (hand ? "left" : "right") + " " + hand ? description1 : description0;
        solution.descs.push(desc);
      }

      // console.log(solHead?.grip);

      const solTail = attemptRegripless(newGrip, tail);
      if (solTail?.codes.includes(null)) continue;
      else {
        if (solTail) {
          solution.codes.push(...solTail?.codes);
          solution.descs.push(...solTail?.descs);
        }
      }

      // console.log(
      //   solHead?.descs || [],
      //   solHead?.grip,
      //   "=>",
      //   newGrip,
      //   solTail?.descs || []
      // );
      console.log(solution.codes);
    }
  });
};

// attemptWithRegrips("R' U R' U' R D' R' D R' U D' R2 U' R2 D R2");

// const attemptAlg = (alg, includeInvalid = false) => {
//   const grips = ["home", "R", "R'"];
//   const solutions = [];
//   grips.forEach((grip) => {
//     let { codes, descs } = attemptRegripless(grip, alg);
//     const isValid = !descs.includes(null) && !descs.includes(undefined);
//     const include = isValid || includeInvalid;
//     if (include) solutions.push({ codes, descs, grip });
//   });
//   if (solutions.length > 0) return solutions;
//   else return null;
// };

// const algometer = (codes) => {
//   return codes.length;
// };

// const solutions = attemptAlg("R U' R", true);

// solutions?.forEach(({ codes, descs, grip }) => {
//   console.log();
//   console.log(`Basic solution with ${grip} grip:`);
//   descs.forEach((a) => console.log(a));
//   console.log(algometer(codes));
// });

// if (!solutions) console.log("No solutions for given grips");
