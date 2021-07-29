import React from "react";
import Table from "react-bootstrap/Table";

export default function ReactTable({ table }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;
  // Use the state and functions returned from useTable to build your UI

  // Render the UI for your table
  const getCellClassname = (cell) => {
    return cell.isGrouped ? "text-left align-middle" : "align-middle";
  };

  const getCellStyle = (cell) => {
    return {
      background: cell.isGrouped || cell.isAggregated ? "#F5F5F5" : null,
    };
  };

  const renderExpandArrows = (isExpanded) => {
    return (
      <i
        className={`fa fa-angle-${isExpanded ? "down" : "right"} fa-lg`}
        aria-hidden="true"
      ></i>
    );
  };

  const renderSortIcon = (col) => {
    return (
      <span>
        {col.isSorted ? (
          <i className={`fa fa-sort-${col.isSortedDesc ? "desc" : "asc"}`} />
        ) : (
          ""
        )}
      </span>
    );
  };

  const renderCell = (cell, row) => {
    return cell.isGrouped ? (
      <>
        <span {...row.getToggleRowExpandedProps()} className="m-4">
          {renderExpandArrows(row.isExpanded)}
        </span>{" "}
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
        {column.canGroupBy ? (
          <span {...column.getGroupByToggleProps()}>
            {column.isGrouped ? (
              <i className="fa fa-expand fa-lg" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-compress fa-lg" aria-hidden="true"></i>
            )}
          </span>
        ) : null}{" "}
        {column.render("Header")} {renderSortIcon(column)}
      </div>
    );
  };

  return (
    <Table {...getTableProps()}>
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
                  {...cell.getCellProps()}
                  className={getCellClassname(cell)}
                  style={getCellStyle(cell)}
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
