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
    const [hand, id] = [(code & 0xf00) / 256, code & 0x0ff];
    return { hand, id };
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
    if (code !== null) {
      this.codes.push(code);
      this.descs.push(this.getDesc(code));
      const regrip = this.getRegrip(code);
      this.changeGrip(regrip);
    } else {
      this.codes.push(null);
      this.descs.push(null);
    }
  }

  nextMove(move) {
    const code = grips[this.grip][move]?.[0];
    if (typeof code === "undefined") {
      throw new Error(`No data for ${move} move in ${grip} grip`);
    } else {
      this.push(code);
    }
  }

  fingerAlgRegripless(alg) {
    const moves = alg.split(" ");
    moves.forEach((move) => {
      this.nextMove(move);
    });
  }

  print() {
    this.descs.forEach((desc) => {
      console.log(desc);
    });
  }
}

const jperm = new Fingering();
jperm.nextMove("R");
jperm.nextMove("U");
jperm.nextMove("R'");
jperm.nextMove("U'");
console.log(jperm.descs);

module.exports = { Fingering };
