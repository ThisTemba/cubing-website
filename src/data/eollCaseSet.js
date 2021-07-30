const eollCaseSet = {
  details: {
    id: "eoll",
    name: "EOLL",
    mask: "oell", // confusing, but deal with it
    view: "plan",
    numCases: 3,
  },
  cases: [
    {
      id: "20d58519-226b-4331-b346-545aad5d41a1",
      name: "L shape",
      algs: ["f R U R' U' f'"],
      group: "",
      scrambles: [
        "F U R U' R' F' U F2 R2 L2 F2 B2 R2 L2 B2",
        "R B2 U' L U' L B R B' L2 B2 R2 U B2 U B2 U B2 U' B2",
        "R U' B' R' U' B' R2 U B R2 B2 U' B2 R2 B2 U' B2 U2",
        "B U L U' L' B R2 L2 F2 D F2 R2 L2 B2 U",
      ],
    },
    {
      id: "4ab6538f-771f-4004-abbf-ca0c3bc3ac09",
      name: "Line",
      algs: ["F R U R' U' F'", "F U R U' R' F'"],
      group: "",
      scrambles: [
        "B' R' U' R U B R2 U' B2 R2 B2 U2 B2 R2 B2 U' R2",
        "F R U R' U' F U R2 U B2 L2 F2 D L2 B2 U' F2",
        "L U F' U' L' F' U F U2 L2 B2 R2 U' B2 L2 F2 D'",
        "R U R B' R' B U' R F2 R2 L2 B2 L2 U' R2 L2 D' R2 L2",
      ],
    },
    {
      id: "0cde1875-8598-459d-99f6-3fe033fcfea9",
      name: "Dot",
      algs: ["F R U R' U' F' f R U R' U' f'"],
      group: "",
      scrambles: [
        "F' U2 B L' U2 B L F' D2 R2 U B2 U F2 R2 B2 D B2 D L2",
        "L' B L B U2 L' B L U' R2 U R2 U' R2 F2 B2 D' L2 D F2",
        "L U2 R' F U2 R' F' L' D' B2 D' F2 D B2 D' L2 F2 D2 R2",
        "R L' B' L U2 L' B' R B' L U2 D2 R2 L2 U2 D2 L2",
        "R L' B R' U2 R B L' B R U2 D2 R2 L2 U2 D2",
      ],
    },
  ],
};
export default eollCaseSet;
