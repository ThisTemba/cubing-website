import React from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";

export default function MultiProgressBar(props) {
  const { values, variants } = props;
  const sum = _.sum(values);
  const percents = values.map((v) => (v * 100) / sum);
  return (
    <ProgressBar style={{ height: "8px" }}>
      {percents.map((p, i) => (
        <ProgressBar variant={variants[i]} now={p} key={i} />
      ))}
    </ProgressBar>
  );
}

MultiProgressBar.defaultProps = {
  values: [20, 20, 60],
  variants: ["primary", "success", "info"],
};
