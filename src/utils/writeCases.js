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

export const writeCasesToFirebase = (solves, caseIds, caseSetDetails, user) => {
  caseIds.map((caseId) => {
    const docRef = getCaseDocRef(user, caseSetDetails, caseId);
    docRef
      .get()
      .then((oldDoc) => {
        const newSolves = _.filter(solves, ["caseId", caseId]);
        const data = prepareCaseData(newSolves, oldDoc);
        setDocument(docRef, data);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  });
};
