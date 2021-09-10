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

  push(code) {
    this.codes.push(code);
  }
}

const jperm = new Fingering();
jperm.push(0x060);
console.log(jperm.codes);
