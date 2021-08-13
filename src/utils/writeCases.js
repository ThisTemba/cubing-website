import _ from "lodash";
import { db } from "../fire";
import { prepareCaseData } from "./caseStats";

export const getCaseSetDocRef = (user, caseSetDetails) => {
  return db
    .collection("users")
    .doc(user.uid)
    .collection("caseSets")
    .doc(caseSetDetails.id);
};

export const setDocument = (docRef, data, name = "Placeholder") => {
  docRef
    .set(data)
    .then(() => console.log(`${name} document successfully written!`))
    .catch((error) => console.error("Error writing document: ", error));
};

const writeCasesToCaseDocs = (solves, caseIds, caseSetDocRef) => {
  const caseStatData = Promise.all(
    caseIds.map(async (caseId) => {
      const caseDocRef = caseSetDocRef.collection("cases").doc(caseId);
      const oldDoc = await caseDocRef.get();
      const newSolves = _.filter(solves, ["caseId", caseId]);
      const data = prepareCaseData(newSolves, oldDoc);
      setDocument(caseDocRef, data, "CaseDoc");
      return { id: caseId, caseStats: data.caseStats };
    })
  );
  return caseStatData;
};

const writeCasesToCaseSetDoc = async (newCases, caseSetDocRef) => {
  const caseSetDoc = await caseSetDocRef.get();
  let cases = [...newCases];
  if (caseSetDoc.exists && caseSetDoc.data()) {
    const oldCases = caseSetDoc.data().cases;
    if (oldCases) {
      const mergedCases = newCases.map((newCase) => {
        const oldCase = _.find(oldCases, ["id", newCase.id]);
        const mergedCase = oldCase
          ? { ...oldCase, caseStats: newCase.caseStats }
          : { ...newCase };
        return mergedCase;
      });
      cases = _(oldCases)
        .differenceBy(mergedCases, "id")
        .concat(mergedCases)
        .value();
    } else {
      cases = newCases;
    }
  }
  setDocument(caseSetDocRef, { cases }, "CaseSetDoc");
};

export const writeCasesToFirebase = (solves, caseIds, caseSetDetails, user) => {
  const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
  writeCasesToCaseDocs(solves, caseIds, caseSetDocRef).then((newCases) =>
    writeCasesToCaseSetDoc(newCases, caseSetDocRef)
  );
};
