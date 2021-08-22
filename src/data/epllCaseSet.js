const epllCaseSet = {
  details: {
    id: "epll",
    title: "EPLL",
    subTitle: "2-Look PLL 2",
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
        "L2 B2 F2 R2 D L2 B2 F2 R2",
        "L2 B2 F2 R2 D' L2 B2 F2 R2",
        "L2 B2 F2 R2 D' L2 B2 F2 R2 U'",
        "L2 B2 F2 R2 D L2 B2 F2 R2 U'",
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
        "L2 R2 D' L2 R2 U' L2 B2 L2 R2 F2 R2",
        "B2 R2 U B2 U' R2 B2 R2 U' R2 U R2",
        "F2 R2 U' F2 U R2 F2 R2 U R2 U' R2",
        "L2 R2 D L2 R2 U L2 B2 L2 R2 F2 R2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=85",
      algs: [
        "M' U' M2 U' M2 U' M' U2 M2",
        "M' U M2 U M2 U M' U2 M2",
        "M2 U M2 U M' U2 M2 U2 M'",
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
        "R2 U2 F2 L2 B2 D B2 L2 F2 U' R2",
        "R2 U' F2 R2 F2 U2 F2 R2 F2 U' R2",
        "F2 U' R2 B2 L2 D L2 B2 R2 U2 F2",
        "R2 U' F2 L2 B2 D B2 L2 F2 U2 R2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=18",
      algs: [
        "M2 U M U2 M' U M2",
        "R U' R U R U R U' R' U' R2",
        "R2 U' R' U' R U R U R U' R",
      ],
    },
    {
      id: "9731cb2b-73db-4b8c-b811-9c7775c80552",
      name: "Ub perm",
      group: "",
      prob: 4,
      arrows: ["U3U5-s8-black,U5U7-s8-black,U7U3-s8-black"],
      scrambles: [
        "R2 U F2 L2 B2 D' B2 L2 F2 U2 R2",
        "F2 U2 R2 B2 L2 D' L2 B2 R2 U F2",
        "R2 U2 F2 L2 B2 D' B2 L2 F2 U R2",
        "R2 U F2 R2 F2 U2 F2 R2 F2 U R2",
      ],
      video:
        "https://www.youtube.com/embed/9r_HqG4zSbk?controls=0&amp;start=43",
      algs: [
        "M2 U' M U2 M' U' M2",
        "R2 U R U R' U' R' U' R' U R'",
        "R' U R' U' R' U' R' U R U R2",
      ],
    },
  ],
};
export default epllCaseSet;
