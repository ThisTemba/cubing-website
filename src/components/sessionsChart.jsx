import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ErrorBar,
  ReferenceDot,
  LineChart,
  Line,
  Legend,
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
      stroke={primary + "50"}
      direction="y"
    />
  );
};

export default function SessionsChart({ statsData }) {
  const { globalStats, data } = statsData;
  const { minNumSolves, maxNumSolves } = globalStats;

  const sideMargin = 20;
  const margin = { top: 20, right: sideMargin, left: sideMargin, bottom: 20 };
  console.log(data);

  const getYMax = (dataMax) => {
    return Math.ceil(dataMax / 10) * 10;
  };
  return (
    <div style={{ height: "600px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data} margin={margin}>
          <CartesianGrid strokeDasharray={[3, 3]} />
          <XAxis
            dataKey="sessionNum"
            type="number"
            label={{
              value: "Session Number",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            dataKey="sessionAverage"
            type="number"
            tickCount={7}
            allowDecimals={false}
            domain={[0, getYMax]}
            label={{ value: "Time", angle: -90, position: "insideLeft" }}
          />
          <ZAxis dataKey="numSolves" range={[minNumSolves, maxNumSolves]} />
          <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />

          <Legend />

          <Line
            name="Best Ao100"
            type="monotone"
            dataKey="bestAo100"
            strokeWidth={2}
            stroke="#4285f4"
            dot={false}
          />
          <Line
            name="Best Ao50"
            type="monotone"
            dataKey="bestAo50"
            strokeWidth={2}
            stroke="#db4437"
            dot={false}
          />
          <Line
            name="Best Ao12"
            type="monotone"
            dataKey="bestAo12"
            strokeWidth={2}
            stroke="#f4b400"
            dot={false}
          />
          <Line
            name="Best Ao5"
            type="monotone"
            dataKey="bestAo5"
            strokeWidth={2}
            stroke="#0f9d58"
            dot={false}
          />
          <Line
            name="Best Single"
            type="monotone"
            dataKey="bestSingle"
            strokeWidth={2}
            stroke="#ab47bc"
            dot={false}
          />
          {/* <Line
            name="Session Average"
            type="monotone"
            dataKey="sessionAverage"
            strokeWidth={2}
            stroke={primary + "20"}
            dot={false}
          >
            {renderErrorBar("rangeEB", 1, primary)}
            {renderErrorBar("iqrEB", 4, primary)}
          </Line> */}

          {/* <Scatter
            type="monotone"
            data={data}
            fill={primary}
            strokeWidth={2}
          ></Scatter> */}
          {/* <Tooltip
            cursor={{ strokeDasharray: [3, 3] }}
            content={<SessionsChartTooltip />}
          /> */}
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
