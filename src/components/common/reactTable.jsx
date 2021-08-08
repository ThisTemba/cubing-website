import React from "react";
import Table from "react-bootstrap/Table";
import useDarkMode from "../../hooks/useDarkMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Source: https://react-table.tanstack.com/docs/examples/data-driven-classes-and-styles
const defaultPropGetter = () => ({});

export default function ReactTable({
  table,
  getCellProps = defaultPropGetter,
  ...rest
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;
  const [darkMode] = useDarkMode();
  // Use the state and functions returned from useTable to build your UI

  // Render the UI for your table
  const getCellClassname = ({ isAggregated, isGrouped }) => {
    let className = "align-middle";
    const groupedColor = darkMode ? "dark" : "light";
    const borderColor = darkMode ? "border-secondary" : "";
    const border = `border-bottom ${borderColor}`;
    className +=
      isAggregated || isGrouped ? ` bg-${groupedColor} ${border}` : "";
    className += isGrouped ? " text-left" : "";
    return className;
  };

  const renderExpandArrows = (isExpanded) => {
    return <FontAwesomeIcon icon={`angle-${isExpanded ? "down" : "right"}`} />;
  };

  const renderSortIcon = (col) => {
    const icon = `sort-${col.isSortedDesc ? "down" : "up"}`;
    return <span>{col.isSorted ? <FontAwesomeIcon icon={icon} /> : ""}</span>;
  };

  const renderCell = (cell, row) => {
    return cell.isGrouped ? (
      <>
        <span className="p-3 m-2">{renderExpandArrows(row.isExpanded)}</span>{" "}
        {cell.render("Cell")} ({row.subRows.length})
      </>
    ) : cell.isAggregated ? (
      cell.render("Aggregated")
    ) : cell.isPlaceholder ? null : (
      cell.render("Cell")
    );
  };

  const renderHeader = (column) => {
    return (
      <div>
        {column.render("Header")} {renderSortIcon(column)}
      </div>
    );
  };

  return (
    <Table {...getTableProps()} responsive className="text-center" {...rest}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(
                  column.getSortByToggleProps
                    ? column.getSortByToggleProps()
                    : {}
                )}
                className="align-middle"
              >
                {renderHeader(column)}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps([
                    {
                      className: cell.column.className,
                      style: cell.column.style,
                    },
                    getCellProps(cell),
                    cell.isGrouped ? row.getToggleRowExpandedProps() : {},
                  ])}
                  className={getCellClassname(cell)}
                  // style={getCellStyle(cell)}
                >
                  {renderCell(cell, row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
