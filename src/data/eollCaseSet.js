const eollCaseSet = {
  details: {
    id: "eoll",
    title: "EOLL",
    subTitle: "2-Look OLL",
    subSubTitle: "First Look",
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
        "L U2 L' U' L2 F' L' F2 U' F' L'",
        "L F2 R' F' R F' U F U' F' L'",
        "U' L U F U' R U' R' U F' L'",
        "U2 L U F U' R U' R' U F' L'",
        "U L U F U' R U' R' U F' L'",
        "L F R U2 R' U R U2 R' F' L'",
      ],
    },
    {
      id: "4ab6538f-771f-4004-abbf-ca0c3bc3ac09",
      name: "Line",
      algs: ["F R U R' U' F'"],
      group: "",
      scrambles: [
        "U2 F' U R U2 L' U' L U2 R' F",
        "U F' U R U2 L' U' L U2 R' F",
        "F' L2 F2 U' L U' L' U2 F2 L2 F",
        "U' R U2 R' U' F' U' L' U' L F",
        "U2 R U2 R' U' F' U' L' U' L F",
        "U R U2 R' U' F' U' L' U' L F",
      ],
    },
    {
      id: "0cde1875-8598-459d-99f6-3fe033fcfea9",
      name: "Dot",
      algs: ["F R U R' U' F' f R U R' U' f'"],
      group: "",
      scrambles: [
        "F R' F' R U2 F R' F' R2 U2 R'",
        "R U2 R' F' L' U2 L F R U2 R'",
        "R' F' L' U2 L2 F R' F2 L' F2 R2",
        "L R' F L' U2 L F R' F L' R2",
        "R' F' U2 F2 U R U' R' F' U2 R",
        "R' U2 L F' L' U2 L F L' U2 R",
      ],
    },
  ],
};
export default eollCaseSet;
