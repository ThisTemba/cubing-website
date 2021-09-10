const { grips, fingertricks } = require("./fingertricks");
const _ = require("lodash");

class Fingering {
  constructor(grip) {
    this.grip = typeof grip !== "undefined" ? grip : 0;
    this.codes = [];
    this.descs = [];
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

  changeGrip(regrip) {
    let change = 0;
    if (regrip === 0x060) change = 1;
    if (regrip === 0x061) change = -1;
    if (regrip === 0x062) change = 2;
    if (regrip === 0x063) change = -2;

    if (typeof this.grip !== "number") {
      throw new Error("THIS GRIP SEEMS INVALID");
    } else {
      if (Math.abs(this.grip + change) > 1) {
        throw new Error("THIS GRIP SEEMS INVALID");
      } else {
        this.grip = this.grip + change;
      }
    }
  }

  push(code) {
    this.codes.push(code);
  }
}

const jperm = new Fingering();
jperm.push(0x060);
console.log(jperm.codes);
