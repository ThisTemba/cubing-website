import { useState, useEffect } from "react";
import { usersRef } from "../services/firebase";

export default function useUserDoc(user) {
  const [userDoc, setUserDoc] = useState();
  const loadingUser = typeof user === "undefined";

  useEffect(() => {
    let unsubscribe = () => {};
    if (!loadingUser) {
      if (user) {
        const userDocRef = usersRef.doc(user.uid);
        unsubscribe = userDocRef?.onSnapshot((userDoc) => setUserDoc(userDoc));
      } else setUserDoc(null);
    }
    return unsubscribe;
  }, [user]);
  return userDoc;
}
