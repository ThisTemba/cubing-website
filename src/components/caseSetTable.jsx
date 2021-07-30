import React, { useMemo, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import _ from "lodash";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGroupBy,
  useExpanded,
} from "react-table";
import MOCK_DATA from "../data/MOCK_DATA.json";
import { CaseImage } from "./common/cubing/cubeImage";
import { Checkbox } from "./common/checkbox";
import ReactTable from "./common/reactTable";

export default function CaseSetTable({ caseSet, setSelectedCases }) {
  //   const data = useMemo(() => caseSet.cases, []);
  const data = useMemo(() => MOCK_DATA, []);

  const defaultColumn = useMemo(() => {
    return {
      disableGroupBy: true,
    };
  }, []);

  const aggregateStatus = (statuses) => {
    const statusEnum = [0, 1, 2];
    const percents = statusEnum.map((status) => {
      const count = statuses.filter((s) => s === status).length;
      const percentage = (count * 100) / statuses.length;
      return percentage;
    });
    return renderAggregatedStatus(percents);
  };

  const renderAggregatedStatus = (percents) => {
    return (
      <ProgressBar style={{ height: "8px" }}>
        <ProgressBar variant="success" now={percents[2]} key={2} />
        <ProgressBar variant="warning" now={percents[1]} key={1} />
        <ProgressBar variant="secondary" now={percents[0]} key={0} />
      </ProgressBar>
    );
  };

  const renderStatus = (status) => {
    const map = {
      0: ["gray", "not started"],
      1: ["orange", "learning"],
      2: ["green", "learned"],
    };
    return (
      <span style={{ color: map[status][0] }}>
        <i className={`fa fa-circle fa-lg`} aria-hidden="true"></i>
      </span>
    );
  };

  const renderCaseImage = ({ value: alg }) => {
    return <CaseImage alg={alg} caseSetDetails={caseSet.details} />;
  };

  const columns = useMemo(
    () => [
      { Header: "Group", accessor: "group", disableGroupBy: false },
      {
        Header: "Case",
        accessor: "alg",
        Cell: renderCaseImage,
        aggregate: (values) => _(values).sample(),
        Aggregated: renderCaseImage,
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
        sortType: "number",
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
        sortType: "number",
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
        sortType: "number",
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
        sortType: "number",
      },
      {
        Header: <span style={{ textDecoration: "overline" }}>time</span>,
        accessor: "avgTime",
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
        sortType: "number",
      },
      {
        Header: "TPS",
        accessor: "tps",
        aggregate: "average",
        Aggregated: ({ value }) => _.round(value, 2),
        sortType: "number",
      },
      {
        Header: "# Solves",
        accessor: "numSolves",
        aggregate: "sum",
        Aggregated: ({ value }) => value,
        sortType: "number",
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
    { columns, data, defaultColumn, initialState: { groupBy: ["group"] } },
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
  const { selectedRowIds } = tableInstance.state;

  const getSelectedCases = (selectedRowIds) => {
    return data.filter((unused, i) => selectedRowIds[i]);
  };

  useEffect(() => {
    setSelectedCases(getSelectedCases(selectedRowIds));
  }, [selectedRowIds]);

  return <ReactTable table={tableInstance} />;
}
