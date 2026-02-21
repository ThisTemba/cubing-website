import { collection, getDocs, getDoc, updateDoc, setDoc, deleteField } from "@firebase/firestore";
import { getCaseSetDocRef } from "../services/firebase";

export default async function resetCaseSet(user, caseSetDetails) {
  const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
  const casesCollRef = collection(caseSetDocRef, "cases");

  // Clear stats from all case sub-docs, keep alg
  const caseDocs = await getDocs(casesCollRef);
  await Promise.all(
    caseDocs.docs.map((d) =>
      updateDoc(d.ref, {
        caseStats: deleteField(),
        recentCaseSolves: deleteField(),
      })
    )
  );

  // Clear caseStats from main doc, keep id + alg per case
  const caseSetDoc = await getDoc(caseSetDocRef);
  const data = caseSetDoc.data();
  if (data?.cases) {
    const resetCases = data.cases.map(({ id, alg }) =>
      alg ? { id, alg } : { id }
    );
    await setDoc(caseSetDocRef, { cases: resetCases });
  }
}
