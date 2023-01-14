import { useState, useEffect } from "react";
import { doc, onSnapshot } from "@firebase/firestore";
import { usersRef } from "../services/firebase";

export default function useUserDoc(user) {
  const [userDoc, setUserDoc] = useState();

  useEffect(() => {
    const loadingUser = typeof user === "undefined";
    let unsubscribe = () => {};
    if (!loadingUser) {
      if (user) {
        const userDocRef = doc(usersRef, user.uid);
        unsubscribe = onSnapshot(userDocRef, (userDoc) => setUserDoc(userDoc));
      } else setUserDoc(null);
    }
    return unsubscribe;
  }, [user]);
  return userDoc;
}
