import React from "react";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useAuthState, db } from "../../fire";

export default function StatsPage() {
  const user = useAuthState();
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("sessions")
        .get()
        .then((querySnapshot) => {
          let data = querySnapshot.docs.map((d) => d.data());
          data = data.map((d) => [
            d.name,
            getDate(d.dateTime),
            d.stats.bestSingle,
            d.puzzle,
            d.stats.numSolves,
          ]);
          data = [
            ["name", "dateTime", "best single", "puzzle", "number of solves"],
            ...data,
          ];
          console.log(data);
          setChartData(data);
        });
    }
  }, [user]);

  const getDate = (dateString) => {
    let date = new Date();
    date.setTime(Date.parse(dateString));
    console.log(date.toLocaleTimeString());
    return date;
  };

  return (
    <div>
      <h1>Stats Page</h1>
      <div>
        <Chart
          width={"100%"}
          height={"500px"}
          chartType="BubbleChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            title: "Session Best Single vs Session Date",
            vAxis: { title: "Solve Time" },
            hAxis: { title: "Date" },
            bubble: { textStyle: { fontSize: 11 } },
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    </div>
  );
}
