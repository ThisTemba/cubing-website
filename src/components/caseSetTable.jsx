import React, { useMemo, useEffect } from "react";
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
import { ProgressBar } from "react-bootstrap";

export default function CaseSetTable({ caseSet, setSelectedCases }) {
  //   const data = useMemo(() => caseSet.cases, []);
  const data = useMemo(() => MOCK_DATA, []);

  const defaultColumn = useMemo(() => {
    return {
      disableGroupBy: true,
    };
  }, []);

  const aggregateStatus = (statuses) => {
    const s0 = statuses.filter((s) => s === 0).length;
    const s1 = statuses.filter((s) => s === 1).length;
    const s2 = statuses.filter((s) => s === 2).length;
    const total = statuses.length;
    return (
      <ProgressBar>
        <ProgressBar variant="success" now={(s2 * 100) / total} key={1} />
        <ProgressBar variant="warning" now={(s1 * 100) / total} key={2} />
        <ProgressBar variant="secondary" now={(s0 * 100) / total} key={3} />
      </ProgressBar>
    );
  };

  const renderStatus = (status, end = null) => {
    const map = {
      0: ["gray", "not started"],
      1: ["orange", "learning"],
      2: ["green", "learned"],
    };
    return (
      <span style={{ color: map[status][0] }}>
        <i className={`fa fa-circle `} aria-hidden="true"></i>

        {end}
      </span>
    );
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

  const renderExpandArrows = (isExpanded) => {
    return (
      <i
        className={`fa fa-angle-${isExpanded ? "down" : "right"} fa-lg`}
        aria-hidden="true"
      ></i>
    );
  };

  const columns = useMemo(
    () => [
      { Header: "Group", accessor: "group", disableGroupBy: false },
      {
        Header: "Case",
        accessor: "alg",
        Cell: ({ value: alg }) => renderCubeImage(alg, caseSet),
        aggregate: (values) => _(values).sample(),
        Aggregated: ({ value: alg }) => renderCubeImage(alg, caseSet),
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
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
            style={{ color: "green" }}
            className="fa fa-check"
            aria-hidden="true"
          ></i>
        ),
        accessor: "pRate",
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
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          return renderStatus(value);
        },
        aggregate: aggregateStatus,
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
        ...columns,
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
        },
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
    state: { selectedRowIds },
  } = tableInstance;

  const getSelectedCases = (selectedRowIds) => {
    return data.filter((unused, i) => selectedRowIds[i]);
  };

  useEffect(() => {
    setSelectedCases(getSelectedCases(selectedRowIds));
  }, [selectedRowIds]);

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
      <Table {...getTableProps()} size="sm">
        <thead>
          {headerGroups.map((hGroup) => (
            <tr {...hGroup.getHeaderGroupProps()}>
              {hGroup.headers.map((col) => (
                <th
                  {...col.getHeaderProps(col.getSortByToggleProps())}
                  className="align-middle"
                >
                  {col.canGroupBy ? (
                    <span {...col.getGroupByToggleProps()}>
                      {col.isGrouped ? (
                        <i
                          className="fa fa-expand fa-lg"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <i
                          className="fa fa-compress fa-lg"
                          aria-hidden="true"
                        ></i>
                      )}
                    </span>
                  ) : null}{" "}
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
                  return (
                    <td
                      className={
                        c.isGrouped ? "text-left align-middle" : "align-middle"
                      }
                      {...c.getCellProps()}
                      style={{
                        background:
                          c.isGrouped || c.isAggregated ? "#F5F5F5" : null,
                      }}
                    >
                      {c.isGrouped ? (
                        <>
                          <span
                            {...row.getToggleRowExpandedProps()}
                            className="m-4"
                          >
                            {renderExpandArrows(row.isExpanded)}
                          </span>{" "}
                          {c.render("Cell")} ({row.subRows.length})
                        </>
                      ) : c.isAggregated ? (
                        c.render("Aggregated")
                      ) : c.isPlaceholder ? null : (
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
