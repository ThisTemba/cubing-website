import React, { useState } from "react";
import { Link } from "react-router-dom";
import { setDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth, getUserDocRef } from "../services/firebase";
import LoginSignUpTemplate from "./common/logInSignUpTemplate";

export default function SignUp({ history }) {
  const [error, setError] = useState(null);

  const handleSubmit = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userDocRef = getUserDocRef(userCredential.user);
        setDoc(userDocRef, { email });
        history.push("/");
      })
      .catch((error) => setError(error));
  };

  return (
    <LoginSignUpTemplate
      title="Sign up"
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
