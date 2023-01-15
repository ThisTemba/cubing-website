import { useState, createContext } from "react";
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { collection, doc, getFirestore } from "@firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyD3KDYppKymwXOQcffJdWI_3bZzLsaiUGE",
  authDomain: "cubing-website.firebaseapp.com",
  projectId: "cubing-website",
  storageBucket: "cubing-website.appspot.com",
  messagingSenderId: "2145506796",
  appId: "1:2145506796:web:1e8b26a481cfb66d51dcc9",
  measurementId: "G-BYLSDMPCQ0",
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// EXPORTS (mostly)

const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export const usersRef = collection(db, "users");

export const UserContext = createContext(null);

export const getUserDocRef = (user) => {
  return doc(db, "users", user?.uid);
};

export const getCaseSetDocRef = (user, caseSetDetails) => {
  return doc(getUserDocRef(user), "caseSets", caseSetDetails.id);
};

export const getMainSessionGroupDocRef = (user) => {
  return doc(getUserDocRef(user), "puzzles", "3x3", "sessionGroups", "main");
};

export const useAuthState = () => {
  const [user, setUser] = useState();
  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    setUser(user ? user : null);
  });
  return user;
};
