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
        "R2 U B' D R D' R' B U' R2 U F2 D' F2 D R2 U' R2 U'",
        "R F D B2 R D2 F U' L' U D F2 R2 U' F2 D B2 D' F2 U2",
        "R B2 D' B D B R U F2 U' R2 B2 D B2 U2 R2 F2 R2 U'",
        "R' F R U' R2 F' D' F D R2 F2 U2 F2 U' F2 U' F2",
        "R' D' L2 D2 F D' F' R F2 R2 U' L2 F2 L2 D B2 U F2 D'",
        "L F2 R2 F L F2 R2 F R2 U F2 L2 B2 D B2",
      ],
    },
    {
      id: "4ab6538f-771f-4004-abbf-ca0c3bc3ac09",
      name: "Line",
      algs: ["F R U R' U' F'", "F U R U' R' F'"],
      group: "",
      scrambles: [
        "L F2 L2 B L F2 L2 B R2 U F2 R2 B2 D F2 U2",
        "R D L2 D2 B' D B R' F2 U F2 D' L2 D2 L2 F2 U' F2 L2 D'",
        "R F R F2 L F' L U' F2 R2 B2 D2 R2 D R2 U' B2 U B2",
        "R' F' L U2 L' F R B2 U B2 L2 D F2 U' F2 L2 D' B2",
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
