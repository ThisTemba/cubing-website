import React, { useContext } from "react";
import DarkModeContext from "../hooks/useDarkMode";
import _ from "lodash";
import CalendarHeatmap from "react-calendar-heatmap";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function ActivityChart({ sessions }) {
  const { darkMode } = useContext(DarkModeContext);
  const { xs } = useWindowDimensions();
  const groupedByDate = _.groupBy(sessions, "date");

  const absCounts = Object.keys(groupedByDate).map((date) => {
    const sessions = groupedByDate?.[date];
    const numSolves = _.sumBy(sessions, "numSolves");
    const dateTime = sessions[0].dateTime;
    return { date: dateTime, count: numSolves };
  });

  const maxDailySolves = _.maxBy(absCounts, "count").count;

  const relCounts = absCounts.map((item) => {
    return { ...item, count: Math.ceil((item.count * 4) / maxDailySolves) };
  });
  const endDate = new Date();
  const startDate = new Date().setDate(endDate.getDate() - (xs ? 130 : 365));
  return (
    <CalendarHeatmap
      endDate={endDate}
      startDate={startDate}
      values={relCounts}
      classForValue={(value) => {
        const theme = darkMode ? "dark" : "light";
        if (!value) return `${theme}-0`;
        else return `${theme}-${value.count}`;
      }}
      className="m-0 p-0"
      gutterSize={2}
    />
  );
}
