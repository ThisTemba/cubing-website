import React, { useMemo, useEffect, useState } from "react";
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
import { useAuthState, db } from "../fire";
import { displayDur } from "../utils/formatTime";

export default function CaseSetTable(props) {
  const { caseSet } = props;
  // const data = useMemo(() => caseSet.cases, []);
  const [data, setData] = useState(caseSet.cases);
  const user = useAuthState();
  // const data = useMemo(() => MOCK_DATA, []);

  useEffect(() => {
    let unsubscribe = () => {};
    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("caseSets")
        .doc(caseSet.details.id)
        .collection("cases")
        .onSnapshot((doc) => {
          const caseStatData = doc.docs.map((d) => {
            return { caseId: d.id, caseStats: d.data().caseStats };
          });
          console.table(caseStatData);
          console.table(data);
          const combined = data.map((c) => {
            if (_.find(caseStatData, ["caseId", c.id])) {
              var caseStats = _.find(caseStatData, ["caseId", c.id]).caseStats;
            }
            return { ...c, ...caseStats };
          });
          console.table(combined);
          setData(combined);
        });
    }
    return unsubscribe;
  }, [user]);

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
    return percents;
  };

  const sortStatus = (rowA, rowB) => {
    // docs say this function should be memoized
    const [sA, sB] = [rowA.values.status, rowB.values.status];
    // if aggregated, sorting percents array
    const learnedA = Array.isArray(sA) ? sA[2] : sA;
    const learnedB = Array.isArray(sB) ? sB[2] : sB;
    return learnedA > learnedB ? 1 : -1;
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

  const renderCaseImage = ({ value }) => {
    return (
      <CaseImage case={value} caseSetDetails={caseSet.details} size="65" />
    );
  };

  const columns = useMemo(
    () => [
      { Header: "Group", accessor: "group", disableGroupBy: false },
      {
        Header: "Case",
        accessor: (row) => row,
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
        Cell: ({ value }) => _.round(value, 2),
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
        Cell: ({ value }) => _.round(value, 2),
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
        Cell: ({ value }) => _.round(value, 2),
        Aggregated: ({ value }) => _.round(value, 2),
        sortType: "number",
      },
      {
        Header: <span style={{ textDecoration: "overline" }}>time</span>,
        accessor: "avgTime",
        aggregate: "average",
        Cell: ({ value }) => displayDur(value),
        Aggregated: ({ value }) => displayDur(value),
        sortType: "number",
      },
      {
        Header: "TPS",
        accessor: "avgTPS",
        aggregate: "average",
        Cell: ({ value }) => _.round(value, 2),
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
      // {
      //   Header: "Status",
      //   accessor: "status",
      //   Cell: ({ value }) => {
      //     return renderStatus(value);
      //   },
      //   aggregate: aggregateStatus,
      //   Aggregated: ({ value }) => renderAggregatedStatus(value),
      //   sortType: sortStatus,
      // },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        groupBy: _.uniqBy(caseSet.cases, "group").length > 1 ? ["group"] : [],
        sortBy: [{ id: "status", desc: true }],
      },
    },
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

  useEffect(() => {
    const selectedRowIds = tableInstance.state.selectedRowIds;
    const selectedCases = data.filter((unused, i) => selectedRowIds[i]);
    props.setSelectedCases(selectedCases);
  }, [tableInstance.state.selectedRowIds]);

  return <ReactTable table={tableInstance} />;
}
