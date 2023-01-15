import { signInWithEmailAndPassword } from "@firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import LoginSignUpTemplate from "./common/logInSignUpTemplate";

export default function LogIn({ history }) {
  const [error, setError] = useState(null);

  const handleSubmit = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => history.goBack())
      .catch((error) => setError(error));
  };

  const forgotPasswordComp = (
    <div className="text-center mt-2" style={{ fontSize: 14 }}>
      <small>
        <Link to="password_reset">Forgot password?</Link>
      </small>
    </div>
  );

  return (
    <LoginSignUpTemplate
      title="Log in"
      submitLabel="Log in"
      onSubmit={handleSubmit}
      error={error}
      belowCard={
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      }
      belowButton={forgotPasswordComp}
    />
  );
}
