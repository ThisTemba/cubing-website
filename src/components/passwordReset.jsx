import React, { useState } from "react";
import { auth } from "../fire";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import CenterCard from "./common/centerCard";
import Input from "./common/input";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setError(null);
        setMessage(`Email sent to: ${email.slice()}!`);
        setEmail("");
      })
      .catch((error) => {
        setError(error);
      });
    console.log(email);
  };

  const formContent = (
    <>
      <Input
        id="email"
        value={email}
        setValue={setEmail}
        type="email"
        label="Enter your email address to receive a password reset link"
      />
      <Button className="w-100" type="submit">
        Reset password
      </Button>
    </>
  );

  const forgotPasswordComp = (
    <p>
      Don't have an account? <Link to="/signup">Sign up</Link>
    </p>
  );

  const content = (
    <>
      {message && <Alert variant="success">{message}</Alert>}
      <Form onSubmit={handleSubmit}>{formContent}</Form>
    </>
  );
  return (
    <CenterCard
      title="Reset your password"
      content={content}
      error={error}
      belowCard={forgotPasswordComp}
    />
  );
}
