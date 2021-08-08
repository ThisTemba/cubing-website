import _ from "lodash";
import { db } from "../fire";
import { prepareCaseData } from "./caseStats";

const getCaseSetDocRef = (user, caseSetDetails) => {
  return db
    .collection("users")
    .doc(user.uid)
    .collection("caseSets")
    .doc(caseSetDetails.id);
};

const setDocument = (docRef, data) => {
  docRef
    .set(data)
    .then(() => console.log("Document successfully written!"))
    .catch((error) => console.error("Error writing document: ", error));
};

const writeCasesToCaseDocs = (solves, caseIds, caseSetDocRef) => {
  const caseStatData = Promise.all(
    caseIds.map(async (caseId) => {
      const caseDocRef = caseSetDocRef.collection("cases").doc(caseId);
      const oldDoc = await caseDocRef.get();
      const newSolves = _.filter(solves, ["caseId", caseId]);
      const data = prepareCaseData(newSolves, oldDoc);
      setDocument(caseDocRef, data);
      return { id: caseId, caseStats: data.caseStats };
    })
  );
  return caseStatData;
};

const writeCasesToCaseSetDoc = async (newCases, caseSetDocRef) => {
  const caseSetDoc = await caseSetDocRef.get();
  let cases = [...newCases];
  if (caseSetDoc.exists) {
    const oldCases = caseSetDoc.data().cases;
    cases = _(oldCases).differenceBy(newCases, "id").concat(newCases).value();
  }
  setDocument(caseSetDocRef, { cases });
};

export const writeCasesToFirebase = (solves, caseIds, caseSetDetails, user) => {
  const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
  writeCasesToCaseDocs(solves, caseIds, caseSetDocRef).then((newCases) =>
    writeCasesToCaseSetDoc(newCases, caseSetDocRef)
  );
};
