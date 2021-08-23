import React, { useEffect, useContext } from "react";
import Joi from "joi-browser";
import _ from "lodash";
import InputMosh from "./common/inputMosh";
import { getUserDocRef, UserContext } from "../services/firebase";
import { useState } from "react";

export default function TrainSettings() {
  const defaultCaseLearnedCriteria = {
    hRate: { threshold: 0.4, symbol: "<=" },
    mmRate: { threshold: 0.4, symbol: "<=" },
    cmRate: { threshold: 0.1, symbol: "<=" },
    numSolves: { threshold: 5, symbol: ">=" },
    avgTPS: { threshold: 3, symbol: ">=" },
  };

  const [errors, setErrors] = useState({});
  const [data, setData] = useState(criteriaToData(defaultCaseLearnedCriteria));
  const { user, userDoc } = useContext(UserContext);

  function dataToCriteria(data) {
    const clc = defaultCaseLearnedCriteria;
    const newclc = _.mapValues(data, (value, key) => {
      return { threshold: value, symbol: clc[key].symbol };
    });
    return newclc;
  }

  function criteriaToData(criteria) {
    const newData = _.mapValues(criteria, (value) => value.threshold);
    return newData;
  }

  useEffect(async () => {
    if (userDoc) {
      const trainSettings = userDoc.data()?.settings?.trainSettings;
      if (trainSettings) setData(trainSettings);
    }
  }, [userDoc]);

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
    const dataToWrite = _.mapValues(data, (v) => parseFloat(v));
    let userData = userDoc.data();
    let settings = userData.settings;
    userData.settings = { ...settings, trainSettings: dataToWrite };
    getUserDocRef(user)
      .set(userData)
      .then(console.log("Document written"))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderInput("hRate", "Max hesitation rate")}
        {renderInput("mmRate", "Max minor mistake rate")}
        {renderInput("cmRate", "Max critical mistake rate")}
        {renderInput("numSolves", "Min number of solves")}
        {renderInput("avgTPS", "Min average TPS")}
        {renderButton("Save")}
      </form>
    </div>
  );
}
