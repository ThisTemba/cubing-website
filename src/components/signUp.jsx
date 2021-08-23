import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, getUserDocRef } from "../services/firebase";
import LoginSignUpTemplate from "./common/logInSignUpTemplate";

export default function SignUp({ history }) {
  const [error, setError] = useState(null);

  const handleSubmit = (email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        newUserDocument(userCredential.user, email);
        history.push("/");
      })
      .catch((error) => setError(error));
  };

  const newUserDocument = (user, email) => {
    getUserDocRef(user)
      .set({
        email,
      })
      .then(() => {
        console.log("Document written with ID: ", user.uid);
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
