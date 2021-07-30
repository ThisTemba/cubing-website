const oellCaseSet = {
  details: {
    id: "oell",
    name: "OELL",
    mask: "oell",
    view: "plan",
    numCases: 3,
  },
  cases: [
    {
      id: "20d58519-226b-4331-b346-545aad5d41a1",
      name: "L shape",
      algs: ["f R U R' U' f'"],
      group: "Orient Edges",
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
      group: "Orient Edges",
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
      group: "Orient Edges",
      scrambles: [
        "R U B2 R' B2 R2 U' R' U L2 F2 R2 U L2 U L2 U' F2 U' L2",
        "R U B2 R' B2 R2 U' R U R2 B2 L2 D2 B2 L2 U F2 U R2 F2",
        "R U B2 R' B2 R2 U' R' B2 L2 D2 L2 U L2 D R2 D R2 L2 U2",
        "R' U' F2 R F2 R2 U R F2 L2 D2 F2 L2 U B2 U R2 B2 U",
      ],
    },
  ],
};
export default oellCaseSet;
