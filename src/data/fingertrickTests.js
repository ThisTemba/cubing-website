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
