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
    const finger = (code & 0x0f0) / 16;
    const id = code & 0x0ff;
    return { hand, finger, id };
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
    const map = {
      home: 0,
      R: 1,
      "R'": -1,
    };
    return map[grip];
  }

  NumtoGrip(num) {
    const map = {
      0: "home",
      1: "R",
      "-1": "R'",
    };
    return map[num];
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

    if (Math.abs(gripNum + change) > 1) {
      success = false;
    } else {
      const num = gripNum + change;
      this.grip = this.NumtoGrip(num);
      success = true;
    }
    return success;
  }

  push(code) {
    let success;
    if (code !== null) {
      this.codes.push(code);
      this.descs.push(this.getDesc(code));
      const regrip = this.getRegrip(code);
      success = this.changeGrip(regrip);
    } else {
      this.codes.push(null);
      this.descs.push(null);
      success = true;
    }
    return success;
  }

  nextMove(move) {
    const code = grips[this.grip][move]?.[0];
    if (typeof code === "undefined") {
      throw new Error(`No data for ${move} move in ${this.grip} grip`);
    } else {
      this.push(code);
    }
  }

  fingerAlgRegripless(alg) {
    if (alg.length === 0) return true;
    const moves = alg.split(" ");
    moves.forEach((move) => {
      this.nextMove(move);
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
    this.codes.forEach((code) => {
      const { hand, finger } = this.parseCode(code);
      console.log(hand, finger);
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

  const regriplessFing = new Fingering("R'");
  const success = regriplessFing.fingerAlgRegripless(alg);
  if (success)
    solutions.push({
      fingering: regriplessFing,
      regrip: null,
      position: null,
    });
  regrips.forEach((regrip) => {
    for (let i = 0; i < algLen; i++) {
      const fingering = new Fingering("R'");
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

const solutions = fingerAlg("F R U' R' U' R U R' F' R U R' U' R' F R F'");
solutions.forEach(({ fingering, regrip, position }) => {
  console.log();
  console.log(
    `Regrip: ${regrip?.toString(16) || "none"} at ${position || "nowhere"}`
  );
  console.log(fingering.descs);
});
