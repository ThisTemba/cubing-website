// Source= http://cube.rider.biz/visualcube.php
import { cubeSVG } from "sr-visualizer";
import React, { useRef, useEffect } from "react";
import _ from "lodash";

const CubeImageInternal = (props) => {
  const imageRef = useRef(null);

  useEffect(() => cubeSVG(imageRef.current, { ...props, colorScheme }), []);

  return <div ref={imageRef}></div>;
};

const Face = { U: 0, R: 1, F: 2, D: 3, L: 4, B: 5 };

const colorScheme = {
  [Face.U]: "yellow",
  [Face.R]: "red",
  [Face.F]: "#1F51FF", // brighter blue
  [Face.D]: "white",
  [Face.L]: "orange",
  [Face.B]: "#00D800", // default green
};

export const CubeImage = (props) => {
  const dyanmicKey = _.values(props).join();
  return <CubeImageInternal {...props} key={dyanmicKey} />;
};

CubeImage.defaultProps = {
  width: "50",
  height: "50",
};

const CaseImage = (props) => {
  if (!props.caseSetDetails)
    throw new Error("CaseImage must have caseSetDetails property");
  const alg = props.case ? props.case.algs[0] : props.alg;
  const arrows = props.case
    ? props.case.arrows
      ? props.case.arrows[0]
      : ""
    : "";
  const { caseSetDetails, size } = props;
  const { mask, view } = caseSetDetails;
  const rest = { mask, view, arrows };
  return (
    <CubeImage case={alg ? alg : ""} height={size} width={size} {...rest} />
  );
};

CaseImage.defaultProps = {
  size: "100",
};

export default CaseImage;
