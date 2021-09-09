const { fingertricks } = require("./fingertricks");

function parseMask(arr, length) {
  if ("number" !== typeof arr) {
    return arr;
  }
  var ret = [];
  for (let i = 0; i < length; i++) {
    var val = arr & 0xf; // should use "/" instead of ">>" to avoid unexpected type conversion
    ret[i] = val === 15 ? -1 : val;
    arr /= 16;
  }
  return ret;
}

const parseFingertrick = (ftrick) => {
  const parsedCode = parseMask(ftrick.code, 3);
  const index = parsedCode[0];
  const groupNum = parsedCode[1];
  const hand = parsedCode[2];

  //   console.log("group", ftrick.group);
  console.log("groupNum", groupNum);
  console.log("index", index);
  console.log("");
  return parsedCode;
};

const readFingertricks = (fingertricks) => {
  fingertricks.forEach((ftrick) => parseFingertrick(ftrick));
};
readFingertricks(fingertricks);

const changeGrip = (grip, move) => {
  let newGrip;
  if (grip === "home" && move === "R") newGrip = "R";
  if (grip === "home" && move === "R'") newGrip = "R'";
  if (grip === "R" && move === "R'") newGrip = "home";
  if (grip === "R'" && move === "R") newGrip = "home";
  if (grip === "R" && move === "R2'") newGrip = "R'";
  if (grip === "R" && move === "R2") newGrip = "R'";
  if (grip === "R'" && move === "R2") newGrip = "R";
  if (grip === "home" && move === "r") newGrip = "R";
  if (grip === "home" && move === "r'") newGrip = "R'";
  if (grip === "R" && move === "r'") newGrip = "home";
  if (grip === "R'" && move === "r") newGrip = "home";
  if (grip === "R" && move === "r2'") newGrip = "R'";
  if (grip === "R" && move === "r2") newGrip = "R'";
  if (grip === "R'" && move === "r2") newGrip = "R";
  newGrip = newGrip || grip;
  //   console.log("grip + move = newGrip,", grip, move, newGrip);
  return newGrip;
};

const attemptMove = (grip, move) => {
  //   console.log(grip, move);
  const code = grips[grip][move]?.[0];
  if (typeof code === "undefined") {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `could not find ${move} move in ${grip} grip`
    );
    return code;
  }
  //   console.log(code?.toString(16));
  const lefty = code > 0xff;
  const hand = lefty ? "left" : "right";
  const ftrick = _.find(fingertricks, ["code", lefty ? code - 256 : code]);
  return code !== null ? hand + " " + ftrick?.description : null;
};

const attempAlgWithGrip = (initGrip, alg) => {
  const moves = alg.split(" ");
  let grip = initGrip;
  const ftricks = [];
  moves.forEach((move) => {
    const attemptedMove = attemptMove(grip, move);
    grip = changeGrip(grip, move);
    ftricks.push(attemptedMove);
  });
  return ftricks;
};

const attemptAlg = (alg) => {
  const grips = ["home", "R", "R'"];
  const solutions = [];
  grips.forEach((grip) => {
    const ftricks = attempAlgWithGrip(grip, alg);
    if (!ftricks.includes(null) && !ftricks.includes(undefined)) {
      solutions.push({ grip, ftricks });
    }
  });
  solutions.forEach(({ ftricks, grip }) => {
    console.log();
    console.log(`Basic solution with ${grip} grip:`);
    ftricks.forEach((a) => console.log(a));
  });
  if (solutions.length === 0) console.log("No basic solutions found");
};

const res = attemptAlg("F R U' R' U' R U R' F' R U R' U' R' F R F'");
