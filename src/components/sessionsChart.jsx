import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function SessionsChart({ statsData }) {
  const { data } = statsData;

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
            name="session"
          />
          <YAxis
            dataKey="sessionAverage"
            type="number"
            tickCount={7}
            allowDecimals={false}
            domain={[0, getYMax]}
            label={{ value: "Time", angle: -90, position: "insideLeft" }}
            unit="s"
          />
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
          <Tooltip
            formatter={(value) => value + "s"}
            labelFormatter={(label, other) => {
              const dateTime = other[0]?.payload.dateTime;
              const date = new Date(dateTime).toLocaleDateString();
              return "Session " + label + ": " + date;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
