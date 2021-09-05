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
        <tbody>
          <tr>
            {statsToDisplay.map((b) => {
              return <th key={b.key}>{b.label}</th>;
            })}
          </tr>
          <tr>
            {statsToDisplay.map((b) => {
              return <td key={b.key}>{sessionGroup[b.key]}</td>;
            })}
          </tr>
          <tr>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </Table>
    );
  else
    return (
      <Table className="m-0">
        <tbody>
          {statsToDisplay.map((b) => {
            return (
              <tr key={b.key}>
                <th>{b.label}</th>
                <td>{sessionGroup[b.key]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
};
export default StatsOverviewTable;
