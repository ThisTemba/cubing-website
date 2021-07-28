import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
import { useTable, useSortBy, useRowSelect } from "react-table";
import CubeImage from "./common/cubing/cubeImage";
import { Checkbox } from "./common/checkbox";
import MOCK_DATA from "../data/MOCK_DATA.json";

export default function CaseSetTable({ caseSet }) {
  //   const data = useMemo(() => caseSet.cases, []);
  const data = useMemo(() => MOCK_DATA, []);
  console.log(MOCK_DATA);
  const columns = useMemo(
    () => [
      {
        Header: "Case",
        accessor: "alg",
        Cell: ({ value: alg }) => (
          <CubeImage
            case={alg}
            view={caseSet.details.view}
            mask={caseSet.details.mask}
          />
        ),
        disableSortBy: true,
      },
      { Header: "Name", accessor: "name" },
      { Header: "Group", accessor: "group" },
      { Header: "P", accessor: "pRate" },
      {
        Header: <i className="fa fa-spinner" aria-hidden="true"></i>,
        accessor: "hRate",
      },
      {
        Header: (
          <i
            style={{ color: "orange" }}
            className="fa fa-minus"
            aria-hidden="true"
          ></i>
        ),
        accessor: "mmRate",
      },
      {
        Header: (
          <i
            style={{ color: "red" }}
            className="fa fa-times"
            aria-hidden="true"
          ></i>
        ),
        accessor: "cmRate",
      },
      {
        Header: <span style={{ textDecoration: "overline" }}>time</span>,
        accessor: "avgTime",
      },
      { Header: "TPS", accessor: "tps" },
      { Header: "# Solves", accessor: "numSolves" },
      {
        Header: "Learned",
        accessor: "learned",
        Cell: ({ value }) => {
          return `${value}`;
        },
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <Checkbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = tableInstance;

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

  return (
    <div>
      <Table {...getTableProps()} bordered size="sm">
        <thead>
          {headerGroups.map((hGroup) => (
            <tr {...hGroup.getHeaderGroupProps()}>
              {hGroup.headers.map((col) => (
                <th
                  {...col.getHeaderProps(col.getSortByToggleProps())}
                  className="align-middle"
                >
                  {col.render("Header")} {renderSortIcon(col)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((r) => {
            prepareRow(r);
            return (
              <tr {...r.getRowProps()}>
                {r.cells.map((c) => {
                  return (
                    <td {...c.getCellProps} className="align-middle">
                      {c.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
