import { db } from "../fire";
import _ from "lodash";
import { prepareCaseData } from "./caseStats";

const getCaseDocRef = (caseId, user, caseSetDetails) => {
  return db
    .collection("users")
    .doc(user.uid)
    .collection("caseSets")
    .doc(caseSetDetails.id)
    .collection("cases")
    .doc(caseId);
};

const writeCaseToFirebase = (docRef, data) => {
  docRef
    .set(data)
    .then(() => console.log("Document successfully written!"))
    .catch((error) => console.error("Error writing document: ", error));
};

export const writeCasesToFirebase = (solves, caseIds, caseSetDetails, user) => {
  caseIds.map((caseId) => {
    const docRef = getCaseDocRef(caseId, user, caseSetDetails);
    docRef
      .get()
      .then((oldDoc) => {
        const newSolves = _.filter(solves, ["caseId", caseId]);
        const data = prepareCaseData(newSolves, oldDoc);
        writeCaseToFirebase(docRef, data);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  });
};
