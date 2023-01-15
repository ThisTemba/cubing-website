import { useEffect, useState, createContext } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import _ from "lodash";
import { getUserDocRef } from "../services/firebase";
import ollCaseSet from "../data/ollCaseSet";
import pllCaseSet from "../data/pllCaseSet";
import eollCaseSet from "../data/eollCaseSet";
import ocllCaseSet from "../data/ocllCaseSet";
import epllCaseSet from "../data/epllCaseSet";
import cpllCaseSet from "../data/cpllCaseSet";
import f2l1CaseSet from "../data/f2l1CaseSet";
import { aggregateStatus, getStatus } from "../utils/learnedStatus";

const CaseSetsContext = createContext(null);
export default CaseSetsContext;

const localCaseSets = [
  eollCaseSet,
  ocllCaseSet,
  cpllCaseSet,
  epllCaseSet,
  pllCaseSet,
  ollCaseSet,
  f2l1CaseSet,
];

const mergeCase = (localCase, remoteCase) => {
  const mergedCase = {
    alg: remoteCase?.alg || localCase.algs[0],
    ...localCase,
    ...remoteCase?.caseStats,
  };
  return mergedCase;
};

const mergeCases = (localCases, remoteCases) => {
  const mergedCases = localCases.map((localCase) => {
    const remoteCase = _.find(remoteCases, ["id", localCase.id]);
    return mergeCase(localCase, remoteCase);
  });
  return mergedCases;
};

const mergeCaseSet = (localCaseSet, remoteCaseSet) => {
  const remoteCases = remoteCaseSet.cases;
  const localCases = localCaseSet.cases;
  const mergedCases = mergeCases(localCases, remoteCases);
  const { details } = localCaseSet;
  const mergedCaseSet = { details, cases: mergedCases };
  return mergedCaseSet;
};

const prepareLocalCaseSet = (localCaseSet) => {
  const { cases, details } = localCaseSet;
  const newCases = cases.map((c) => ({ ...c, alg: c.algs[0] }));
  return { cases: newCases, details };
};

const getCaseSetStatus = (cases, userDoc) => {
  const userTrainSettings = userDoc?.data()?.settings?.trainSettings;
  const statuses = cases.map((c) => getStatus(c, userTrainSettings));
  const counts = aggregateStatus(statuses);
  return counts;
};

const getMergedCaseSets = (localCaseSets, snapshot, userDoc) => {
  const mergedCaseSets = localCaseSets.map((localCaseSet) => {
    const id = localCaseSet.details.id;
    const remoteCaseSet = _.find(snapshot?.docs, ["id", id])?.data();
    const mergedCaseSet = remoteCaseSet
      ? mergeCaseSet(localCaseSet, remoteCaseSet)
      : prepareLocalCaseSet(localCaseSet);
    const caseSetStatus = getCaseSetStatus(mergedCaseSet.cases, userDoc);
    mergedCaseSet.details.status = caseSetStatus;
    return mergedCaseSet;
  });
  return mergedCaseSets;
};

export function useCaseSets(user, userDoc) {
  const [caseSets, setCaseSets] = useState();

  useEffect(() => {
    let unsubscribe = () => {};
    const loadingUser = typeof user === "undefined";
    const loadingUserDoc = typeof userDoc === "undefined";
    if (!loadingUser && !loadingUserDoc) {
      if (user) {
        const caseSetsRef = collection(getUserDocRef(user), "caseSets");
        unsubscribe = onSnapshot(caseSetsRef, (snapshot) => {
          const merged = getMergedCaseSets(localCaseSets, snapshot, userDoc);
          setCaseSets(merged);
        });
      } else {
        const merged = getMergedCaseSets(localCaseSets, undefined, userDoc);
        setCaseSets(merged);
      }
    }
    return unsubscribe;
  }, [user, userDoc]);

  return caseSets;
}
