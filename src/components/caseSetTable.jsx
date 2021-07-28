import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
import { useTable, useSortBy } from "react-table";
import CubeImage from "./common/cubing/cubeImage";

export default function CaseSetTable({ caseSet }) {
  const data = useMemo(() => caseSet.cases, []);
  const columns = useMemo(
    () => [
      {
        Header: "Case",
        accessor: "algs[0]",
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
      {
        Header: "Algorithm",
        id: "primary",
        accessor: "algs[0]",
        disableSortBy: true,
      },
      {
        Header: "Num Algs",
        accessor: "algs",
        Cell: ({ value }) => value.length,
        disableSortBy: true,
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

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
