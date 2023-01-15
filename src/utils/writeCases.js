import { setDoc, getDoc, doc } from "@firebase/firestore";
import _ from "lodash";
import { getCaseSetDocRef } from "../services/firebase";
import { prepareCaseData } from "./caseStats";

const writeCasesToCaseDocs = (solves, caseIds, caseSetDocRef) => {
  const caseStatData = Promise.all(
    caseIds.map(async (caseId) => {
      const caseDocRef = doc(caseSetDocRef, "cases", caseId);
      const oldDoc = await getDoc(caseDocRef);
      const newSolves = _.filter(solves, ["caseId", caseId]);
      const data = prepareCaseData(newSolves, oldDoc);
      setDoc(caseDocRef, data);
      return { id: caseId, caseStats: data.caseStats };
    })
  );
  return caseStatData;
};

const writeCasesToCaseSetDoc = async (newCases, caseSetDocRef) => {
  const caseSetDoc = await getDoc(caseSetDocRef);
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
  setDoc(caseSetDocRef, { cases });
};

export const writeCasesToFirebase = (solves, caseIds, caseSetDetails, user) => {
  const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
  writeCasesToCaseDocs(solves, caseIds, caseSetDocRef).then((newCases) =>
    writeCasesToCaseSetDoc(newCases, caseSetDocRef)
  );
};
