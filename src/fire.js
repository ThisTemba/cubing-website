import { useState } from "react";
import firebase from "firebase";
import "firebase/auth";

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

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  firebase.auth().onAuthStateChanged((user) => {
    setUser(user ? user : null);
  });
  return user;
};
