const { grips, fingertricks } = require("./fingertricks");
const _ = require("lodash");

class Fingering {
  constructor(grip) {
    this.grip = typeof grip !== "undefined" ? grip : "home";
    this.codes = [];
    this.descs = [];
    this.moves = [];
  }

  parseCode(code) {
    const hand = (code & 0xf00) / 256;
    const group = (code & 0x0f0) / 16;
    const finger = (code & 0xff0) / 16;
    const id = code & 0x0ff;
    return { hand, finger, id, group };
  }

  findFingertrick(code) {
    const { id } = this.parseCode(code);
    return _.find(fingertricks, ["id", id]);
  }

  getDesc(code) {
    const { description0, description1 } = this.findFingertrick(code);
    const { hand } = this.parseCode(code);
    const desc = hand === 0 ? description0 : description1 || description0;
    return (hand ? "left" : "right") + " " + desc;
  }

  gripToNum(grip) {
    const num =
      grip === "home" ? 0 : grip === "R" ? 1 : grip === "R'" ? -1 : null;
    return num;
  }

  NumtoGrip(num) {
    const grip =
      num === 0 ? "home" : num === 1 ? "R" : num === -1 ? "R'" : null;
    return grip;
  }

  getRegrip = (code) => {
    const ftrick = this.findFingertrick(code);
    const { hand } = this.parseCode(code);
    const hasRegrip = typeof ftrick.regrip !== "undefined";
    if (hasRegrip) return hand * 256 + ftrick.regrip;
    else return null;
  };

  changeGrip(regrip) {
    let success;
    const gripNum = this.gripToNum(this.grip);
    let change = 0;
    if (regrip === 0x060) change = 1;
    if (regrip === 0x061) change = -1;
    if (regrip === 0x062) change = 2;
    if (regrip === 0x063) change = -2;
    if (regrip === 0x068) change = 1;
    if (regrip === 0x069) change = -1;
    if (regrip === 0x06a) change = 2;
    if (regrip === 0x06b) change = -2;

    if (Math.abs(gripNum + change) > 1) {
      success = false;
    } else {
      const num = gripNum + change;
      this.grip = this.NumtoGrip(num);
      success = true;
    }
    return success;
  }

  push(code, debug = false, move = null) {
    let success;
    const oldGrip = this.grip;
    if (code !== null) {
      this.codes.push(code);
      const desc = this.getDesc(code);
      this.descs.push(desc);
      // console.log(desc, " : ", this.grip);
      const regrip = this.getRegrip(code);
      success = this.changeGrip(regrip);
      if (debug) {
        const m = move.padEnd(3, " ");
        const c = decimalToHex(code).padEnd(6, " ");
        const d = this.getDesc(code).padEnd(20, " ");
        const g = oldGrip.padEnd(4, " ");
        const r = this.grip.padEnd(5, " ");
        console.log(`M: ${m} C: ${c} G: ${g} => ${r} D: ${d}`);
      }
    } else {
      this.codes.push(null);
      this.descs.push(null);
      success = true;
    }
    return success;
  }

  nextMove(move, { prevFinger, prevPrevFinger, prevHand }) {
    let code = grips[this.grip][move]?.[0];

    const { finger, id, hand } = this.parseCode(code);
    if (id === 0x20) {
      const prevPrevMove = this.codes[i - 2];
      if ((prevPrevMove === 0x020 || prevPrevMove === 0x023) && hand === 0)
        code = 0x030;
      if ((prevPrevMove === 0x120 || prevPrevMove === 0x123) && hand === 1)
        code = 0x130;
    }
    if (id === 0x22 && this.grip === "home") {
      if (prevHand === 0) code = 0x122;
      if (prevHand === 1) code = 0x022;
    }
    if (id === 0x48 && this.grip === "home") {
      if (prevHand === 0) code = 0x148;
      if (prevHand === 1) code = 0x048;
    }
    if (typeof code === "undefined") {
      throw new Error(`No data for ${move} move in ${this.grip} grip`);
    } else {
      this.push(code);
    }
  }

  fingerAlgRegripless(alg) {
    if (alg.length === 0) return true;
    const moves = alg.split(" ");
    moves.forEach((move, i) => {
      const { finger: prevFinger } = this.parseCode(this.codes[i - 1]);
      const { hand: prevHand } = this.parseCode(this.codes[i - 1]);
      const { finger: prevPrevFinger } = this.parseCode(this.codes[i - 2]);
      const prevData = { prevFinger, prevPrevFinger, prevHand };
      this.nextMove(move, prevData);
    });
    if (this.codes.includes(null)) return false;
    else return true;
  }

  print() {
    this.descs.forEach((desc) => {
      console.log(desc);
    });
  }

  get score() {
    let score = this.codes.length;
    this.codes.forEach((code, i) => {
      const { hand, group } = this.parseCode(code);
      if (group == 6) {
        const { hand: prevHand } = this.parseCode(this.codes[i - 1]);
        const { hand: nextHand } = this.parseCode(this.codes[i + 1]);
        if (prevHand === hand && hand === nextHand) score += 1;
      }
    });
    return score;
  }
}

module.exports = { Fingering };

const fingerAlg = function (alg) {
  const regrips = [0x060, 0x061, 0x062, 0x063];
  const solutions = [];
  const moves = alg.split(" ");
  const algLen = moves.length;

  const regriplessFing = new Fingering();
  const success = regriplessFing.fingerAlgRegripless(alg);
  if (success)
    solutions.push({
      fingering: regriplessFing,
      regrip: null,
      position: null,
    });
  regrips.forEach((regrip) => {
    for (let i = 0; i < algLen; i++) {
      const fingering = new Fingering();
      const headAlg = moves.slice(0, i).join(" ");
      const tailAlg = moves.slice(i).join(" ");

      const success1 = fingering.fingerAlgRegripless(headAlg);
      if (!success1) continue;

      if (regrip) {
        const success2 = fingering.push(regrip);
        if (!success2) continue;
      }

      const success3 = fingering.fingerAlgRegripless(tailAlg);
      if (!success3) continue;

      solutions.push({ fingering, regrip, position: i });
    }
  });
  return solutions;
};

const solutions = fingerAlg("R U R' U R U2 R'");
const bestSolution = _.minBy(solutions, (solution) => solution.fingering.score);
console.log(bestSolution.fingering.descs);

// solutions.forEach(({ fingering, regrip: regrp, position: pos }) => {
//   const position = typeof pos === "number" ? pos : "nowhere";
//   const regrip = regrp?.toString(16) || "none";
//   console.log();
//   console.log(`Regrip: ${regrip} at ${position}`);
//   console.log("Score:", fingering.score);
//   console.log(fingering.descs);
// });
