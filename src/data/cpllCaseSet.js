const cpllCaseSet = {
  details: {
    id: "cpll",
    name: "CPLL",
    mask: "coll",
    view: "plan",
    numCases: 2,
  },
  cases: [
    {
      id: "b35780e5-4cf7-4278-ba74-4384a3470022",
      name: "Headlights",
      group: "",
      prob: 4,
      arrows: ["U3U5-s8,U5U3-s8,U2U8-s8,U8U2-s8"],
      scrambles: [
        "R L F2 R L U R2 U' L2 F2 U' F2 U F2 R2 U' R2 F2",
        "F B L2 F B' U2 F2 U F2 U' R2 B2 U' L2 U B2 D' R2",
        "B F R2 B' F' U' R2 U R2 D' R2 D2 B2 U B2 D' R2",
        "L R B2 L' R D B2 U2 F2 R2 F2 U L2 U R2 U' F2 U",
      ],
      algs: ["R U R' U' R' F R2 U' R' U' R U R' F'"],
    },
    {
      id: "bf1c3991-fab1-441a-84bd-53d8674bdc16",
      name: "No Headlights",
      group: "",
      prob: 4,
      arrows: ["U1U3-s8,U3U1-s8,U0U8-s8,U8U0-s8"],
      scrambles: [
        "R L B2 R' L' U' L2 U' L2 U B2 D B2 D' R2 U R2 U",
        "F B U2 F B' U' L2 U R2 D' R2 U' B2 D R2 D' L2 U'",
        "B F U2 B' F U' L2 U R2 D' R2 U' B2 D R2 D' L2 U'",
        "L R B2 L' R' U' L2 U' L2 U B2 D B2 D' R2 U R2 U",
      ],
      algs: [
        "F R U' R' U' R U R' F' R U R' U' R' F R F'",
        "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
      ],
    },
  ],
};
export default cpllCaseSet;
