import { useState, useEffect } from "react";
import { getMainSessionGroupDocRef } from "../services/firebase";

export default function useMainSessionGroup(user) {
  const [sessionGroupDoc, setSessionGroupDoc] = useState();
  const loadingUser = typeof user === "undefined";

  useEffect(() => {
    let unsubscribe = () => {};
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
