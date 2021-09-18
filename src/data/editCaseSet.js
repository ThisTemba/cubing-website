const fs = require("fs");
const _ = require("lodash");

const caseSetName = "f2l1";
function editData(caseSet) {
  const newCases = caseSet.cases.map((c) => {
    c.id = uuidv4();
    return c;
  });
  return { ...caseSet, cases: newCases };
}

const oldfilename = `${caseSetName}CaseSet.js`;
const newFilename = `${caseSetName}CaseSetnew.js`;

//READ
const root = require(`./${caseSetName}CaseSet`);
const data = root.getData();

//EDIT
const newData = editData(data);

//WRITE
if (oldfilename !== newFilename) {
  const name = `${caseSetName}CaseSet`;
  const contents =
    `const ${name} = ` +
    JSON.stringify(newData) +
    `\n\n export default ${name}`;
  fs.writeFileSync(newFilename, contents);
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Need to include these lines in the file you want to manipulate. OBJECT is the object you want to edit

// exports.getData = function () {
//   return OBJECT;
// };
