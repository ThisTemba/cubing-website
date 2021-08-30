import React, { useContext } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ComposedChart,
  Line,
  Scatter,
  Legend,
  ErrorBar,
  ReferenceDot,
} from "recharts";
import DarkModeContext from "../hooks/useDarkMode";

export default function SessionsChart({ sessionGroup }) {
  const sessions = sessionGroup.sessions.map((sesh, i) => {
    const { quartiles, sessionAverage } = sesh;
    const sessionNum = i + 1;
    const iqrEB = [
      sessionAverage - quartiles.q1,
      quartiles.q3 - sessionAverage,
    ];
    return { ...sesh, iqrEB, sessionNum };
  });
  const { darkMode } = useContext(DarkModeContext);

  const primaryColor = "#4285f4";
  const gridColor = darkMode ? "#6c757d" : "#ced4da";
  const axesColor = darkMode ? "#ced4da" : "#495057";
  const dotColor = darkMode ? "#212529" : "#FFFFFF";
  const errorBarColor = darkMode ? primaryColor + "70" : primaryColor + "50";

  const sideMargin = 20;
  const margin = { top: 20, right: sideMargin, left: sideMargin, bottom: 20 };
  console.log(sessions);

  const getYMax = (dataMax) => {
    return Math.ceil(dataMax / 5) * 5;
    // return Math.ceil(dataMax);
  };

  const getYMin = (dataMin) => {
    return Math.floor(dataMin / 5) * 5;
    // return Math.floor(dataMin);
  };

  const renderLine = (name, dataKey, stroke) => {
    const props = { name, dataKey, stroke };
    return <Scatter type="monotone" strokeWidth={2} dot={true} {...props} />;
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

  const renderErrorBar = (key, width) => {
    return (
      <ErrorBar
        dataKey={key}
        width={0}
        strokeWidth={width}
        stroke={errorBarColor}
        direction="y"
      />
    );
  };

  return (
    <div style={{ height: "500px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={500} height={300} data={sessions} margin={margin}>
          <CartesianGrid strokeDasharray={[3, 3]} stroke={gridColor} />
          <XAxis
            type="number"
            dataKey="sessionNum"
            label={{
              value: "Session Number",
              position: "insideBottom",
              offset: -5,
              fill: axesColor,
            }}
            tickCount={7}
            allowDecimals={false}
            stroke={axesColor}
            name="Session Number"
          />
          <YAxis
            type="number"
            tickCount={11}
            domain={[getYMin, getYMax]}
            dataKey="sessionAverage"
            label={{
              value: "Session Average",
              angle: -90,
              position: "insideLeft",
              fill: axesColor,
            }}
            stroke={axesColor}
            unit="s"
            name="Session Average"
          />
          <ZAxis
            type="number"
            dataKey="numSolves"
            stroke={axesColor}
            range={[10, 200]}
          />
          <Scatter
            // type="monotone"
            // strokeWidth={2}
            // dot={{ stroke: primaryColor, strokeWidth: 2, fill: dotColor }}
            name="Session Average"
            data={sessions}
            fill={primaryColor}
            // stroke={primaryColor}
          >
            {/* {renderErrorBar("rangeEB", 1)} */}
            {renderErrorBar("iqrEB", 4)}
          </Scatter>
          <Line
            type="monotone"
            strokeWidth={0}
            // dot={{ stroke: primaryColor, strokeWidth: 2, fill: dotColor }}

            dot={false}
            activeDot={false}
            name="Session Average"
            dataKey="sessionAverage"
            stroke={primaryColor}
          />
          <ReferenceDot x={10} y={10} r={20} fill="red" />
          <Tooltip
            labelFormatter={(label, other) => {
              const dateTime = other[0]?.payload.dateTime;
              const date = new Date(dateTime).toLocaleDateString();
              return "Session " + label + ": " + date;
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
