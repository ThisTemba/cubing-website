import useWindowDimensions from "../hooks/useWindowDimensions";
import { Table } from "react-bootstrap";
import { dispDur } from "../utils/displayValue";
import { Tooltip, OverlayTrigger, Popover } from "react-bootstrap";

const BestsTable = ({ bests }) => {
  const { xs } = useWindowDimensions();
  const getDate = (dateTime) => {
    return dateTime ? new Date(dateTime).toLocaleDateString() : "-";
  };
  const renderTooltip = (props, message) => (
    <Tooltip content id="button-tooltip" {...props}>
      <span>{message}</span>
    </Tooltip>
  );
  const bestsToDisplay = [
    {
      label: "Ao100",
      key: "ao100",
      tooltip: "Average of 100 excludes the best 5 solves and worst 5 solves",
    },
    {
      label: "Ao50",
      key: "ao50",
      tooltip: "Average of 50 excludes the best 3 solves and worst 3 solves",
    },
    {
      label: "Ao12",
      key: "ao12",
      tooltip: "Average of 12 excludes the best solve and worst solve",
    },
    {
      label: "Ao5",
      key: "ao5",
      tooltip: "Average of 5 excludes the best solve and worst solve",
    },
    {
      label: "Single",
      key: "single",
      tooltip:
        "The single fastest solve (normally on a lucky scramble, but still worth bragging about)",
    },
  ];
  if (!xs)
    return (
      <Table className="m-0">
        <tr>
          {bestsToDisplay.map((b) => {
            return (
              <th>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 300, hide: 250 }}
                  overlay={(props) => renderTooltip(props, b.tooltip)}
                >
                  <span>{b.label}</span>
                </OverlayTrigger>
              </th>
            );
          })}
        </tr>
        <tr>
          {bestsToDisplay.map((b) => {
            const time = dispDur(bests[b.key]?.dur);
            return <td>{time}</td>;
          })}
        </tr>
        <tr>
          {bestsToDisplay.map((b) => {
            const dateTime = bests[b.key]?.dateTime;
            const date = getDate(dateTime);
            return (
              <td>
                <small className="text-muted">{date}</small>
              </td>
            );
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
              <td>
                <small className="text-muted">{date}</small>
              </td>
            </tr>
          );
        })}
      </Table>
    );
};
export default BestsTable;
