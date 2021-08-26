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

  const renderLine = (name, dataKey, stroke) => {
    const props = { name, dataKey, stroke };
    return <Line type="monotone" strokeWidth={2} dot={false} {...props} />;
  };

  const renderLines = () => {
    return (
      <>
        {renderLine("Best Ao100", "bestAo100", "#4285f4")}
        {renderLine("Best Ao50", "bestAo50", "#db4437")}
        {renderLine("Best Ao12", "bestAo12", "#f4b400")}
        {renderLine("Best Ao5", "bestAo5", "#0f9d58")}
        {renderLine("Best Single", "bestSingle", "#ab47bc")}
      </>
    );
  };

  return (
    <div style={{ height: "600px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data} margin={margin}>
          <CartesianGrid strokeDasharray={[3, 3]} />
          <XAxis
            type="number"
            dataKey="sessionNum"
            label={{
              value: "Session Number",
              position: "insideBottomRight",
              offset: -5,
            }}
            name="session"
          />
          <YAxis
            type="number"
            dataKey="sessionAverage"
            tickCount={7}
            domain={[0, getYMax]}
            label={{ value: "Time", angle: -90, position: "insideLeft" }}
            unit="s"
          />
          {renderLines()}

          <Legend />
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
