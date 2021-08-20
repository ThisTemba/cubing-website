import { useState, useEffect } from "react";
import { useAuthState, usersRef } from "../fire";

export default function useUserDoc(user) {
  const [userDoc, setUserDoc] = useState(null);
  useEffect(() => {
    let unsubscribe = () => {};
    const userDocRef = user ? usersRef.doc(user.uid) : null;
    if (user) {
      unsubscribe = userDocRef?.onSnapshot((userDoc) => setUserDoc(userDoc));
    }
    return unsubscribe;
  }, [user]);
  return userDoc;
}
