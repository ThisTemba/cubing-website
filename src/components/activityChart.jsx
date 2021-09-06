import React, { useContext, cloneElement } from "react";
import DarkModeContext from "../hooks/useDarkMode";
import _ from "lodash";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import useWindowDimensions from "../hooks/useWindowDimensions";
import CustomTooltip from "./common/customTooltip";

CalendarHeatmap.prototype.getHeight = function () {
  return (
    this.getWeekWidth() + (this.getMonthLabelSize() - this.props.gutterSize)
  );
};

//Source: https://github.com/kevinsqi/react-calendar-heatmap/issues/146#issuecomment-913795816
const WEEKDAYLABEL_LEFT = 5;
CalendarHeatmap.prototype.getTransformForWeekdayLabels = function () {
  if (this.props.horizontal) {
    return `translate(${WEEKDAYLABEL_LEFT}, ${this.getMonthLabelSize()})`;
  }
  return null;
};

const addDays = (dateTime, days) => {
  var date = new Date(dateTime);
  date.setDate(date.getDate() + days);
  return date;
};

const formatDate = (date) => {
  const firstSix = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const lastSix = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNames = [...firstSix, ...lastSix];

  let day = date.getDate();
  let monthName = monthNames[date.getMonth()];
  let year = date.getFullYear();

  return `${monthName} ${day}, ${year}`;
};

export default function ActivityChart({ sessions, numDays }) {
  const { xs } = useWindowDimensions();
  const { darkMode } = useContext(DarkModeContext);

  const endDate = new Date();
  const startDate = addDays(new Date(), -numDays);

  const getHeatmapValues = (sessions) => {
    const groupedByDate = _.groupBy(sessions, "date");
    const numSolvesByDate = Object.keys(groupedByDate).map((date) => {
      const sessions = groupedByDate?.[date];
      const numSolves = _.sumBy(sessions, "numSolves");
      const dateTime = sessions[0].dateTime;
      return { date: dateTime, numSolves };
    });
    const maxDailySolves = _.maxBy(numSolvesByDate, "numSolves").numSolves;
    const countsByDate = numSolvesByDate.map((item) => {
      return {
        ...item,
        count: Math.ceil((item.numSolves * 4) / maxDailySolves),
      };
    });
    let values = [];
    for (let i = 0; i < numDays; i++) {
      const dateTime = addDays(new Date(startDate), i + 1);
      const valueWithSolves = _.find(countsByDate, (item) => {
        const thisDate = dateTime.toDateString();
        const dataDate = new Date(item.date).toDateString();
        return thisDate === dataDate;
      });
      if (valueWithSolves) values.push(valueWithSolves);
      else values.push({ date: dateTime, count: 0, numSolves: 0 });
    }
    return values;
  };

  const transformDayElement = (element, value) => {
    const date = value ? formatDate(new Date(value.date)) : null;
    let message;
    if (value) message = `${value.numSolves} solves on ${date}`;
    else message = "No Solves";
    return (
      <CustomTooltip message={message} instant>
        {cloneElement(element)}
      </CustomTooltip>
    );
  };

  const classForValue = (value) => {
    const theme = darkMode ? "dark" : "light";
    if (!value) return `${theme}-0`;
    else return `${theme}-${value.count}`;
  };

  const values = getHeatmapValues(sessions);

  return (
    <div className={xs ? "m-3" : ""}>
      <CalendarHeatmap
        gutterSize={2}
        endDate={endDate}
        startDate={startDate}
        values={values}
        classForValue={classForValue}
        transformDayElement={transformDayElement}
        showWeekdayLabels={true}
      />
    </div>
  );
}
