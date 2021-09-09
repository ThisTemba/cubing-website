const { grips, fingertricks } = require("./fingertricks");
const _ = require("lodash");

class Fingering {
  constructor(grip) {
    this.grip = grip || "home";
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

  push(code) {
    this.codes.push(code);
  }
}

const jperm = new Fingering();
jperm.push(0x060);
console.log(jperm.codes);
