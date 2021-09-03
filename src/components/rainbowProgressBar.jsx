import React, { useContext } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import DarkModeContext from "../hooks/useDarkMode";

export default function RainbowProgressBar({ value: currentValue, stages }) {
  const { darkMode } = useContext(DarkModeContext);

  const barValue = (start, end, value) => {
    if (start <= value && value < end) {
      return (value - start) / (end - start);
      // fractional progress from start to end
    } else {
      return value >= end ? 1 : 0;
    }
  };

  const data = stages.map((stage, i) => {
    const start = i === 0 ? 0 : stages[i - 1].end;
    const stop = stage.end;
    return {
      value: barValue(start, stop, currentValue),
      fill: stage.color,
    };
  });

  return (
    <RadialBarChart
      width={512}
      height={512}
      innerRadius="20%"
      outerRadius="100%"
      data={data}
      startAngle={180}
      endAngle={0}
    >
      <PolarAngleAxis type="number" domain={[0, 1]} tick={false} />
      <RadialBar
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        background={{ fill: darkMode ? "#343a40" : "#e9ecef" }}
        clockWise={true}
        dataKey="value"
      />
    </RadialBarChart>
  );
}

RainbowProgressBar.defaultProps = {
  value: 40,
  stages: [
    { end: 5, color: "#0d6efd" },
    { end: 12, color: "#6610f2" },
    { end: 25, color: "#6f42c1" },
    { end: 50, color: "#d63384" },
    { end: 100, color: "#dc3545" },
  ],
};
