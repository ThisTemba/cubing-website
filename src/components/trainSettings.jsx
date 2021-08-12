import React, { useEffect } from "react";
import Joi from "joi-browser";
import InputMosh from "./common/inputMosh";
import { db, useAuthState } from "../fire";
import { useState } from "react";

export default function TrainSettings() {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    hRate: 0.4,
    mmRate: 0.4,
    cmRate: 0.1,
    avgTPS: 2,
    numSolves: 2,
  });
  const user = useAuthState();

  useEffect(async () => {
    if (user) {
      const userDocRef = db.collection("users").doc(user.uid);
      const userDoc = await userDocRef.get();
      let userData = userDoc.data();
      let settings = userData.settings;
      if (settings && settings.trainSettings) setData(settings.trainSettings);
    }
  }, [user]);

  const schema = {
    hRate: Joi.number().required().min(0).max(1).label("Max hRate"),
    mmRate: Joi.number().required().min(0).max(1).label("Max mmRate"),
    cmRate: Joi.number().required().min(0).max(1).label("Max cmRate"),
    numSolves: Joi.number().required().min(1).label("Min numSolves"),
    avgTPS: Joi.number().required().min(0.1).label("Min avgTPS"),
  };

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const _schema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, _schema);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    setErrors(errors || {});
    if (errors) return;

    doSubmit();
  };

  const handleChange = ({ currentTarget: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    const newData = { ...data };
    newData[input.name] = input.value;

    setErrors(newErrors);
    setData(newData);
  };

  const renderButton = (label) => {
    return (
      <button disabled={validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };

  const renderInput = (name, label, type = "text") => {
    return (
      <InputMosh
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={handleChange}
        error={errors[name]}
      />
    );
  };

  const doSubmit = async () => {
    const userDocRef = db.collection("users").doc(user.uid);
    const userDoc = await userDocRef.get();
    let userData = userDoc.data();
    let settings = userData.settings;
    userData.settings = { ...settings, trainSettings: data };
    userDocRef
      .set(userData)
      .then(console.log("Document written"))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderInput("hRate", "Max hRate")}
        {renderInput("mmRate", "Max mmRate")}
        {renderInput("cmRate", "Max cmRate")}
        {renderInput("numSolves", "Min numSolves")}
        {renderInput("avgTPS", "Min avgTPS")}
        {renderButton("Save")}
      </form>
    </div>
  );
}
