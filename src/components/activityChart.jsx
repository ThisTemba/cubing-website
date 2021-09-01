import React, { useContext, cloneElement } from "react";
import DarkModeContext from "../hooks/useDarkMode";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import _ from "lodash";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function ActivityChart({ sessions, numDays }) {
  const { darkMode } = useContext(DarkModeContext);

  const renderTooltip = (props, message) => (
    <Tooltip content id="button-tooltip" {...props}>
      <span>{message}</span>
    </Tooltip>
  );
  const formatDate = (date) => {
    const firstSix = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const lastSix = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNames = [...firstSix, ...lastSix];

    let day = date.getDate();
    let monthName = monthNames[date.getMonth()];
    let year = date.getFullYear();

    return `${monthName} ${day}, ${year}`;
  };

  const getHeatmapValues = (sessions) => {
    const groupedByDate = _.groupBy(sessions, "date");
    const absCounts = Object.keys(groupedByDate).map((date) => {
      const sessions = groupedByDate?.[date];
      const numSolves = _.sumBy(sessions, "numSolves");
      const dateTime = sessions[0].dateTime;
      return { date: dateTime, numSolves };
    });
    const maxDailySolves = _.maxBy(absCounts, "numSolves").numSolves;
    const values = absCounts.map((item) => {
      return {
        ...item,
        count: Math.ceil((item.numSolves * 4) / maxDailySolves),
      };
    });
    return values;
  };

  const endDate = new Date();
  const startDate = new Date().setDate(endDate.getDate() - numDays);

  return (
    <CalendarHeatmap
      endDate={endDate}
      startDate={startDate}
      values={getHeatmapValues(sessions)}
      classForValue={(value) => {
        const theme = darkMode ? "dark" : "light";
        if (!value) return `${theme}-0`;
        else return `${theme}-${value.count}`;
      }}
      className="m-0 p-0"
      gutterSize={2}
      tooltipDataAttrs={(value) => {
        return {
          "data-tip": ` has count: ${value.date}`,
        };
      }}
      transformDayElement={(element, value) => {
        const date = value ? formatDate(new Date(value.date)) : null;
        let message;
        if (value) message = `${value.numSolves} solves on ${date}`;
        else message = "No Solves";
        return (
          <OverlayTrigger
            placement="top"
            delay={{ show: 0, hide: 0 }}
            overlay={(props) => renderTooltip(props, message)}
          >
            {cloneElement(element)}
          </OverlayTrigger>
        );
      }}
    />
  );
}
