import useWindowDimensions from "../hooks/useWindowDimensions";
import { Table } from "react-bootstrap";

const StatsOverviewTable = ({ sessionGroup }) => {
  const { xs } = useWindowDimensions();
  const statsToDisplay = [
    { label: "Number of Solves", key: "numSolves" },
    { label: "Number of Sessions", key: "numSessions" },
  ];

  console.log(sessionGroup);
  if (!xs)
    return (
      <Table className="m-0">
        <tr>
          {statsToDisplay.map((b) => {
            return (
              <th>
                <span>{b.label}</span>
              </th>
            );
          })}
        </tr>
        <tr>
          {statsToDisplay.map((b) => {
            return <td>{sessionGroup[b.key]}</td>;
          })}
        </tr>
        <tr>
          <td>-</td>
          <td>-</td>
        </tr>
      </Table>
    );
  else
    return (
      <Table className="m-0">
        {statsToDisplay.map((b) => {
          return (
            <tr>
              <th>{b.label}</th>
              <td>{sessionGroup[b.key]}</td>
            </tr>
          );
        })}
      </Table>
    );
};
export default StatsOverviewTable;
