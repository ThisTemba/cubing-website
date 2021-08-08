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

const getCaseDocRef = (user, caseSetDetails, caseId) => {
  return getCaseSetDocRef(user, caseSetDetails).collection("cases").doc(caseId);
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

export const writeCasesToFirebase = (solves, caseIds, caseSetDetails, user) => {
  const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
  writeCasesToCaseDocs(solves, caseIds, caseSetDocRef).then((caseStatData) =>
    console.log(caseStatData)
  );
};
