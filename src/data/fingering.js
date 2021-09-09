class Fingering {
  constructor(grip) {
    this.grip = grip || "home";
    this.codes = [];
    this.descs = [];
  }

  push(code) {
    this.codes.push(code);
  }
}

const jperm = new Fingering();
jperm.push(0x060);
console.log(jperm.codes);
