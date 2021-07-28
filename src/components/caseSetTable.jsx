import React, { useMemo } from "react";
import { Table } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGroupBy,
  useExpanded,
} from "react-table";
import CubeImage from "./common/cubing/cubeImage";
import { Checkbox } from "./common/checkbox";
import MOCK_DATA from "../data/MOCK_DATA.json";
import _ from "lodash";

export default function CaseSetTable({ caseSet }) {
  //   const data = useMemo(() => caseSet.cases, []);
  const data = useMemo(() => MOCK_DATA, []);
  console.log(MOCK_DATA);

  const defaultColumn = useMemo(() => {
    return {
      disableGroupBy: true,
    };
  }, []);

  const getBoolFraction = (bools) => {
    let trueCount = bools.filter((b) => b === true).length;
    let totalCount = bools.length;
    return trueCount + "/" + totalCount;
  };
  const renderCubeImage = (alg, caseSet) => {
    return (
      <CubeImage
        case={alg}
        view={caseSet.details.view}
        mask={caseSet.details.mask}
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Case",
        accessor: "alg",
        Cell: ({ value: alg }) => renderCubeImage(alg, caseSet),
        aggregate: (values) => _(values).sample(),
        Aggregated: ({ value: alg }) => renderCubeImage(alg, caseSet),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      { Header: "Group", accessor: "group", disableGroupBy: false },
      {
        Header: "P",
        accessor: "pRate",
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <i className="fa fa-spinner" aria-hidden="true"></i>,
        accessor: "hRate",
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
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
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
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
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <span style={{ textDecoration: "overline" }}>time</span>,
        accessor: "avgTime",
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: "TPS",
        accessor: "tps",
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: "# Solves",
        accessor: "numSolves",
        aggregate: "sum",
        Aggregated: ({ value }) => value,
      },
      {
        Header: "Learned",
        accessor: "learned",
        Cell: ({ value }) => {
          return `${value}`;
        },
        aggregate: getBoolFraction,
        Aggregated: ({ value }) => value,
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data, defaultColumn },
    useGroupBy,
    useSortBy,
    useExpanded,
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
                  {col.canGroupBy ? (
                    // If the col can be grouped, let's add a toggle
                    <span {...col.getGroupByToggleProps()}>
                      {col.isGrouped ? "🛑 " : "👊 "}
                    </span>
                  ) : null}
                  {col.render("Header")} {renderSortIcon(col)}
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
                {row.cells.map((c) => {
                  const getClass = (c) => {
                    const extra =
                      c.isGrouped || c.isAggregated ? "table-success" : "";
                    // c.isGrouped || c.isAggregated ? "table-dark" : "";
                    // const extra = "";
                    return "align-middle " + extra;
                  };
                  return (
                    <td
                      className={getClass(c)}
                      // For educational purposes, let's color the
                      // cell depending on what type it is given
                      // from the useGroupBy hook
                      {...c.getCellProps()}
                      //   style={{
                      //     background: c.isPlaceholder ? "#ff000042" : "white",
                      //   }}
                    >
                      {c.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? (
                              <i
                                class="fa fa-angle-down fa-lg"
                                aria-hidden="true"
                              ></i>
                            ) : (
                              <i
                                class="fa fa-angle-right fa-lg"
                                aria-hidden="true"
                              ></i>
                            )}
                          </span>{" "}
                          {c.render("Cell")} ({row.subRows.length})
                        </>
                      ) : c.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        c.render("Aggregated")
                      ) : c.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        c.render("Cell")
                      )}
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
