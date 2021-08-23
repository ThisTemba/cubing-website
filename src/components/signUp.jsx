import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, getUserDocRef, setDoc } from "../services/firebase";
import LoginSignUpTemplate from "./common/logInSignUpTemplate";

export default function SignUp({ history }) {
  const [error, setError] = useState(null);

  const handleSubmit = (email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userDocRef = getUserDocRef(userCredential.user);
        setDoc(userDocRef, { email }, "user");
        history.push("/");
      })
      .catch((error) => setError(error));
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
