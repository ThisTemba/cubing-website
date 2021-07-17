import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../fire";
import LoginSignUpTemplate from "./common/logInSignUpTemplate";

export default function SignUp({ history }) {
  const [error, setError] = useState(null);

  const handleSubmit = (email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => history.push("/"))
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
