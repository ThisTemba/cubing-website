import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
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
import { dispDur } from "../utils/displayValue";

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

export default function SessionsChart({ data, globalStats }) {
  const primary = "#198754";
  const { bestSingle, bestAo5, bestAo12, bestAo50, bestAo100 } = globalStats;
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
            tickFormatter={dispDur}
            allowDecimals={false}
          />
          <ZAxis dataKey="numSolves" range={[minNumSolves, maxNumSolves]} />
          <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />

          {showBests && renderReferenceLine(bestSingle, "Best Single")}
          {showBests && renderReferenceLine(bestAo5, "Best Ao5")}
          {showBests && renderReferenceLine(bestAo12, "Best Ao12")}
          {showBests && renderReferenceLine(bestAo50, "Best Ao50")}
          {showBests && renderReferenceLine(bestAo100, "Best Ao100")}
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
