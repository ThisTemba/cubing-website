import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Input from "./input";
import CenterCard from "./centerCard";

export default function LoginSignUpTemplate({
  title,
  submitLabel,
  error,
  belowCard: textBelowCard,
  belowButton,
  onSubmit,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const cardContent = (
    <>
      <Form onSubmit={handleSubmit}>
        <Input
          id={"email"}
          value={email}
          setValue={setEmail}
          type="email"
          label="Email"
        />
        <Input
          id={"password"}
          value={password}
          setValue={setPassword}
          type="password"
          label="Password"
        />
        <Button className="w-100" type="submit">
          {submitLabel}
        </Button>
      </Form>
      {belowButton}
    </>
  );

  const belowCard = (
    <div className="w-100 text-center mt-2">{textBelowCard}</div>
  );

  return (
    <CenterCard
      content={cardContent}
      belowCard={belowCard}
      title={title}
      error={error}
    />
  );
}
LoginSignUpTemplate.defaultProps = {
  title: "Title",
  submitLabel: "Submit Label",
  bottomComp: <p></p>,
  bottomText: "",
};
