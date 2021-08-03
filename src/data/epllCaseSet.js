const epllCaseSet = {
  details: {
    id: "epll",
    title: "EPLL",
    subTitle: "2-Look PLL",
    subSubTitle: "Second Look",
    mask: "ll",
    view: "plan",
    numCases: 4,
  },
  cases: [
    {
      id: "dc9d5589-0258-43de-bc5f-146e9f38539f",
      name: "H perm",
      group: "",
      prob: 1,
      arrows: ["U1U7-s8-black,U7U1-s8-black,U3U5-s8-black,U5U3-s8-black"],
      scrambles: [
        "R L D2 R L D2 R2 B2 D2 B2 L2 F2 U2 R2 F2 U2",
        "F B D2 F B D2 F2 R2 D2 R2 B2 L2 U2 F2 L2 U2",
        "B F D2 B F D2 B2 L2 D2 L2 F2 R2 U2 B2 R2 U2",
        "L R D2 L R D2 L2 F2 D2 F2 R2 B2 U2 L2 B2 U2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=70",
      algs: ["M2 U M2 U2 M2 U M2", "M2 U' M2 U2 M2 U' M2"],
    },
    {
      id: "8de1fc54-9674-4b3c-80c8-13d97383559f",
      name: "Z perm",
      group: "",
      prob: 2,
      arrows: ["U3U7-s8-black,U7U3-s8-black,U1U5-s8-black,U5U1-s8-black"],
      scrambles: [
        "R L U2 R L' U' R2 U' R2 U' R2 U' R2 U' R2 B2 R2 B2",
        "F B U2 F B' U R2 F2 R2 U F2 U R2 F2 R2 U F2 U'",
        "B F U2 B F' U L2 B2 L2 U B2 U L2 B2 L2 U B2 U'",
        "L R U2 L R' U' L2 U' L2 U' L2 U' L2 U' L2 F2 L2 F2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=85",
      algs: [
        "M' U' M2 U' M2 U' M' U2 M2",
        "M' U M2 U M2 U M' U2 M2",
        "y M2 U M2 U M' U2 M2 U2 M'",
        "M2 U' M2 U' M' U2 M2 U2 M'",
      ],
    },
    {
      id: "c111db3e-42fc-4c83-8686-8f759c7f6c9e",
      name: "Ua perm",
      group: "",
      prob: 4,
      arrows: ["U5U3-s8-black,U7U5-s8-black,U3U7-s8-black"],
      scrambles: [
        "F2 D F2 R2 F2 D R2 F2 D2 F2 B2 L2 B2 R2 D2 R2",
        "R2 U' B2 R2 B2 U B2 R2 B2 U2 B2 U2 R2 B2 R2 U2 B2",
        "R2 U' F2 R2 F2 U R' L F2 D2 B2 U2 R L B2 D2",
        "R2 D' R2 F2 R2 D R L' F2 D2 B2 U2 R' L' B2 D2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=18",
      algs: [
        "M2 U M U2 M' U M2",
        "R U' R U R U R U' R' U' R2",
        "y2 R2 U' R' U' R U R U R U' R",
      ],
    },
    {
      id: "9731cb2b-73db-4b8c-b811-9c7775c80552",
      name: "Ub perm",
      group: "",
      prob: 4,
      arrows: ["U3U5-s8-black,U5U7-s8-black,U7U3-s8-black"],
      scrambles: [
        "F2 U' L2 F2 L2 U F2 L2 U2 L2 F2 L2 U2 F2 L2 U2 F2",
        "F2 D' F2 R2 B2 U R D2 F2 B2 U2 L' F2 R2 U2 B2 U2",
        "F2 D' F2 L2 F2 D F2 L2 D2 L2 B2 R2 U2 F2 R2 U2 B2",
        "L2 U B2 L2 B2 U B2 U2 B2 U2 L2 B2 L2 U2 L2 U2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=43",
      algs: [
        "M2 U' M U2 M' U' M2",
        "R2 U R U R' U' R' U' R' U R'",
        "y2 R' U R' U' R' U' R' U R U R2",
      ],
    },
  ],
};
export default epllCaseSet;
