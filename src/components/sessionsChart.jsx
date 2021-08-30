import React, { useContext } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  ErrorBar,
  ReferenceDot,
} from "recharts";
import DarkModeContext from "../hooks/useDarkMode";
import { dispDur } from "../utils/displayValue";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { Card, Table } from "react-bootstrap";

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

  const gray = { 400: "#ced4da", 600: "#6c757d", 700: "#495057" };
  const primaryColor = darkMode ? "#967bb6" : "#af94cf";
  const gridColor = darkMode ? gray[700] : gray[400];
  const axesColor = darkMode ? gray[400] : gray[700];
  const errorBarColor = darkMode ? primaryColor + "80" : primaryColor + "50";

  const sideMargin = 20;
  const margin = { top: 20, right: sideMargin, left: sideMargin, bottom: 20 };
  console.log(sessions);

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
          domain={["auto", "auto"]}
          tickFormatter={(value) => dispDur(value)}
          unit="s"
          {...common}
        />
        <ZAxis dataKey="numSolves" range={[10, 200]} {...common} />
      </>
    );
  };

  const renderTooltip = ({ active, payload, label }) => {
    if (active) {
      const sesh = payload?.[0]?.payload;
      const { sessionNum, sessionAverage, numSolves, dateTime, quartiles } =
        sesh;
      const { q1, q3 } = quartiles;
      const date = new Date(dateTime).toLocaleDateString();
      const cellStyle = { borderColor: darkMode ? "#495057" : "" };
      return (
        <Card style={{ background: darkMode ? "#343a40" : "#fcfdfe" }}>
          <span className="m-1">
            Session {sessionNum}: {date}
          </span>

          <Table size="sm">
            <tr>
              <td style={cellStyle}>Num Solves: </td>
              <td style={cellStyle}>{numSolves}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Session Average: </td>
              <td style={cellStyle}>{dispDur(sessionAverage)}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Middle 50% </td>
              <td style={cellStyle}>
                {dispDur(q3)} - {dispDur(q1)}
              </td>
            </tr>
          </Table>
        </Card>
      );
    } else return <></>;
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
              content={renderTooltip}
              animationDuration={200}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
