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
import { dispDur } from "../utils/displayValue";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function SessionsChart({ sessionGroup }) {
  const { xs } = useWindowDimensions();
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

  const renderAxes = () => {
    const getYMax = (dataMax) => Math.ceil(dataMax / 5) * 5;
    const getYMin = (dataMin) => Math.floor(dataMin / 5) * 5;
    const common = { type: "number", stroke: axesColor };
    const labelCommon = { style: { textAnchor: "middle" }, fill: axesColor };

    return (
      <>
        <XAxis
          dataKey="sessionNum"
          name="Session Number"
          label={{
            value: "Session Number",
            position: "bottom",
            ...labelCommon,
          }}
          allowDecimals={false}
          {...common}
        />
        <YAxis
          dataKey="sessionAverage"
          name="Session Average"
          label={{
            value: "Session Average",
            position: "left",
            angle: -90,
            ...labelCommon,
          }}
          tickCount={16}
          domain={[getYMin, getYMax]}
          tickFormatter={(value) => dispDur(value)}
          unit="s"
          {...common}
        />
        <ZAxis dataKey="numSolves" range={[10, 200]} {...common} />
      </>
    );
  };

  return (
    <div style={{ height: "500px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={500} height={300} data={sessions} margin={margin}>
          <CartesianGrid strokeDasharray={[3, 3]} stroke={gridColor} />
          {renderAxes()}
          <Scatter name="Session Average" data={sessions} fill={primaryColor}>
            {renderErrorBar("iqrEB", 4)}
          </Scatter>
          <Line
            type="monotone"
            strokeWidth={0}
            dot={false}
            activeDot={false}
            name="Session Average"
            dataKey="sessionAverage"
            stroke={primaryColor}
          />
          <ReferenceDot x={10} y={10} r={20} fill="red" />
          {!xs && (
            <Tooltip
              labelFormatter={(label, other) => {
                const dateTime = other[0]?.payload.dateTime;
                const date = new Date(dateTime).toLocaleDateString();
                return "Session " + label + ": " + date;
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
