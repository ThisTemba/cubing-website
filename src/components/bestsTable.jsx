import useWindowDimensions from "../hooks/useWindowDimensions";
import { Table } from "react-bootstrap";
import { dispDur } from "../utils/displayValue";

const BestsTable = ({ bests }) => {
  const { xs } = useWindowDimensions();
  const getDate = (dateTime) => {
    return dateTime ? new Date(dateTime).toLocaleDateString() : "-";
  };
  const bestsToDisplay = [
    { label: "Ao100", key: "ao100" },
    { label: "Ao50", key: "ao50" },
    { label: "Ao12", key: "ao12" },
    { label: "Ao5", key: "ao5" },
    { label: "Single", key: "single" },
  ];
  if (!xs)
    return (
      <Table className="m-0">
        <tr>
          {bestsToDisplay.map((b) => {
            return <th>{b.label}</th>;
          })}
        </tr>
        <tr>
          {bestsToDisplay.map((b) => {
            const time = dispDur(bests[b.key]?.dur);
            return <td>{time}</td>;
          })}
        </tr>
        <tr style={{ fontSize: 14 }}>
          {bestsToDisplay.map((b) => {
            const dateTime = bests[b.key]?.dateTime;
            const date = getDate(dateTime);
            return <td>{date}</td>;
          })}
        </tr>
      </Table>
    );
  else
    return (
      <Table className="m-0">
        {bestsToDisplay.map((b) => {
          const time = dispDur(bests[b.key]?.dur);
          const dateTime = bests[b.key]?.dateTime;
          const date = getDate(dateTime);
          return (
            <tr>
              <th>{b.label}</th>
              <td>{time}</td>
              <td style={{ fontSize: 14 }}>{date}</td>
            </tr>
          );
        })}
      </Table>
    );
};
export default BestsTable;
