import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../fire";
import LoginSignUpTemplate from "./common/logInSignUpTemplate";

export default function SignUp({ history }) {
  const [error, setError] = useState(null);

  const handleSubmit = (email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        newUserDocument(userCredential.user.uid, email);
        history.push("/");
      })
      .catch((error) => setError(error));
  };

  const newUserDocument = (uid, email) => {
    db.collection("users")
      .doc(uid)
      .set({
        email,
      })
      .then(() => {
        console.log("Document written with ID: ", uid);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  return (
    <LoginSignUpTemplate
      title="Sign up to GCW!"
      submitLabel="Sign up"
      onSubmit={handleSubmit}
      error={error}
      type={"signup"}
      belowCard={
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      }
    />
  );
}
