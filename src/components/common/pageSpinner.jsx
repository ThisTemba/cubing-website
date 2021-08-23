import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function PageSpinner() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "60vh" }}
    >
      <BeatLoader speedMultiplier={1.5} color="#999999aa" />
    </div>
  );
}
