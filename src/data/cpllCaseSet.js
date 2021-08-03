const cpllCaseSet = {
  details: {
    id: "cpll",
    title: "CPLL",
    subTitle: "2-Look PLL",
    subSubTitle: "First Look",
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
      arrows: ["U2U8-s8-black,U8U2-s8-black"],
      scrambles: [
        "R L U2 R L F2 U L2 U' R2 U B2 R2 D B2 R2 U",
        "L R B2 L' R D B2 U2 F2 R2 F2 U L2 U R2 U' F2 U",
        "L R U2 L R' U L2 B2 L2 R2 D B2 D' F2 D R2 F2 U2",
        "L R B2 L' R D B2 U2 F2 R2 F2 U L2 U R2 U' F2 U",
      ],
      algs: ["R U R' U' R' F R2 U' R' U' R U R' F'"],
    },
    {
      id: "bf1c3991-fab1-441a-84bd-53d8674bdc16",
      name: "No Headlights",
      group: "",
      prob: 4,
      arrows: ["U0U8-s8-black,U8U0-s8-black"],
      scrambles: [
        "R L' U2 R' L U2 F2 R2 U R2 U2 F2 U' R2 U2 R2 F2 U",
        "F B U2 F B U F2 U2 L2 U' L2 F2 U2 F2 U L2 U2 B2",
        "F B U2 F B' U' L2 U R2 D' R2 U' B2 D R2 D' L2 U'",
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
