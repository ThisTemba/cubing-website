import { useState, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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
firebase.initializeApp(firebaseConfig);

// EXPORTS (mostly)
export default firebase;

const db = firebase.firestore();
export const auth = firebase.auth();

export const usersRef = db.collection("users");

export const UserContext = createContext(null);

export const getUserDocRef = (user) => {
  return db.collection("users").doc(user?.uid);
};

export const getCaseSetDocRef = (user, caseSetDetails) => {
  return getUserDocRef(user).collection("caseSets").doc(caseSetDetails.id);
};

export const setDoc = (docRef, data, logName = "Placeholder") => {
  const successMsg = `${logName} document successfully written!`;
  const errorMsg = `Error writing ${logName} document: `;
  docRef
    .set(data)
    .then(() => console.log(successMsg))
    .catch((error) => console.error(errorMsg, error));
};

export const useAuthState = () => {
  const [user, setUser] = useState();
  const loading = typeof user === "undefined";
  firebase.auth().onAuthStateChanged((user) => {
    console.log("set user");
    setUser(user ? user : null);
  });
  return { user, loading };
};
