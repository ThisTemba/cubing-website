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

// EXPORTS
export default firebase;

export const db = firebase.firestore();

export const auth = firebase.auth();

export const usersRef = db.collection("users");

export const UserContext = createContext(null);

export const getUserDocRef = (user) => {
  return db.collection("users").doc(user?.uid);
};

export const getCaseSetDocRef = (user, caseSetDetails) => {
  return getUserDocRef(user).collection("caseSets").doc(caseSetDetails.id);
};

export const setDocument = (docRef, data, logName = "Placeholder") => {
  docRef
    .set(data)
    .then(() => console.log(`${logName} document successfully written!`))
    .catch((error) => console.error("Error writing document: ", error));
};

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  firebase.auth().onAuthStateChanged((user) => {
    setUser(user ? user : null);
  });
  return user;
};
