import { useState, useEffect } from "react";
import { getMainSessionGroupDocRef } from "../services/firebase";

export default function useMainSessionGroup(user) {
  const [sessionGroupDoc, setSessionGroupDoc] = useState();

  useEffect(() => {
    let unsubscribe = () => {};
    const loadingUser = typeof user === "undefined";
    if (!loadingUser) {
      if (user) {
        const sessionGroupDocRef = getMainSessionGroupDocRef(user);
        unsubscribe = sessionGroupDocRef?.onSnapshot((sessionGroupDoc) =>
          setSessionGroupDoc(sessionGroupDoc)
        );
      } else setSessionGroupDoc(null);
    }
    return unsubscribe;
  }, [user]);
  return sessionGroupDoc;
}
