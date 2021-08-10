// Source= http://cube.rider.biz/visualcube.php
import * as SRVisualizer from "sr-visualizer";
import React, { useRef, useEffect } from "react";
import _ from "lodash";

const CubeImageInternal = (props) => {
  const imageRef = useRef(null);

  useEffect(() => SRVisualizer.cubeSVG(imageRef.current, props), []);

  return <div ref={imageRef}></div>;
};

const CubeImage = (props) => {
  const dyanmicKey = _.values(props).join();
  return <CubeImageInternal {...props} key={dyanmicKey} />;
};

CubeImage.defaultProps = {
  width: "50",
  height: "50",
  // bg: "t", // transparent
  // ac: "n", // black arrows?
};

export const CaseImage = (props) => {
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

export default CubeImage;

// Possibly outdated:
// this is all very clever. the SRVisualizer thing works by adding an image to a div
// this image is added when the component CubeImageInternal is mounted
// it is not added when the component updates because it is literally adding images
// doing this ultimately results in multiple images populating the target div

// instead, we can remount the whole CubeImageInternal component whenever props change
// this creates an entirely new div to put our new image in and so avoids the problem
// to remount a component on prop update we assign a prop-dependent key
// Source: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
// to avoid having to set this key value in this special way whenever we want a live image
// we wrap CubeImageInternal in a separate component called CubeImage

// the CubeImage component takes an optional boolean property "live"
// when this is set to true, a key is created that depends on the other properties
// if these other properties change, the key changes and the internal component remounts

// we extract live from the other properties using the spread operator: {live, ...props}
// this collects all the props that are not called "live" into a new object
// we then destructure this object, again using the spread operator to send all the props to the child component
// at the same time we set the key to the dynamic key we created
// this completely abstracts away the weird implementation and lets us use CubeImage as usual
// very cool....
