import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Scatter,
  CartesianGrid,
  ReferenceLine,
  ErrorBar,
  ReferenceDot,
  ComposedChart,
  Line,
} from "recharts";

const renderReferenceLine = (best, label) => {
  return (
    <>
      <ReferenceDot
        x={best.sessionNum}
        y={best.dur}
        r={8}
        fill="#ff00ff55"
        stroke="none"
      />
      <ReferenceLine
        y={best.dur}
        label={{
          position: "right",
          value: label,
        }}
        strokeWidth={0.2}
        stroke="#ff00ff"
        strokeDasharray={[6, 3]}
      />
    </>
  );
};

const renderErrorBar = (key, width, primary) => {
  return (
    <ErrorBar
      dataKey={key}
      width={0}
      strokeWidth={width}
      stroke={primary + "70"}
      direction="y"
    />
  );
};

const renderBests = (globalStats) => {
  const { bestSingle, bestAo5, bestAo12, bestAo50, bestAo100 } = globalStats;

  return (
    <>
      {renderReferenceLine(bestSingle, "Best Single")}
      {renderReferenceLine(bestAo5, "Best Ao5")}
      {renderReferenceLine(bestAo12, "Best Ao12")}
      {renderReferenceLine(bestAo50, "Best Ao50")}
      {renderReferenceLine(bestAo100, "Best Ao100")}
    </>
  );
};

export default function SessionsChart({ data, globalStats }) {
  const primary = "#198754";
  const { minNumSolves, maxNumSolves } = globalStats;

  const showBests = false;
  const margin = { top: 20, right: 20, left: 20, bottom: 20 };
  return (
    <div style={{ height: "600px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={500} height={300} data={data} margin={margin}>
          <CartesianGrid strokeDasharray={[3, 3]} />
          <XAxis dataKey="sessionNum" type="number" />
          <YAxis
            dataKey="sessionAverage"
            type="number"
            tickCount={7}
            allowDecimals={false}
          />
          <ZAxis dataKey="numSolves" range={[minNumSolves, maxNumSolves]} />
          <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />

          {showBests && renderBests(globalStats)}
          <Line
            type="monotone"
            dataKey="sessionAverage"
            stroke={primary + "90"}
            strokeWidth={2}
            dot={false}
          />
          <Scatter type="monotone" data={data} fill={primary} strokeWidth={2}>
            {renderErrorBar("rangeEB", 1, primary)}
            {renderErrorBar("iqrEB", 4, primary)}
          </Scatter>
          <Tooltip cursor={{ strokeDasharray: [3, 3] }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
