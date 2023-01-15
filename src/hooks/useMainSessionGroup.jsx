import { useState, useEffect } from "react";
import { onSnapshot } from "@firebase/firestore";
import { getMainSessionGroupDocRef } from "../services/firebase";

export default function useMainSessionGroup(user) {
  const [sessionGroupDoc, setSessionGroupDoc] = useState();

  useEffect(() => {
    let unsubscribe = () => {};
    const loadingUser = typeof user === "undefined";
    if (!loadingUser) {
      if (user) {
        const sessionGroupDocRef = getMainSessionGroupDocRef(user);
        unsubscribe = onSnapshot(sessionGroupDocRef, (sessionGroupDoc) =>
          setSessionGroupDoc(sessionGroupDoc)
        );
      } else setSessionGroupDoc(null);
    }
    return unsubscribe;
  }, [user]);
  return sessionGroupDoc;
}
