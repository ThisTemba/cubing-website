import React from "react";
import GridLoader from "react-spinners/GridLoader";

export default function PageSpinner({ loading }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "60vh" }}
    >
      <GridLoader loading={loading} speedMultiplier={0.5} color="#999999aa" />
    </div>
  );
}
