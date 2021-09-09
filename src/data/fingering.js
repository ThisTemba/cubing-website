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

  push(code) {
    this.codes.push(code);
  }
}

const jperm = new Fingering();
jperm.push(0x060);
console.log(jperm.codes);
