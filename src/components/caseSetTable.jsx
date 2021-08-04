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
import { getSTM } from "../utils/algTools";

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
          const caseStatData = doc.docs.map((d) => ({
            caseId: d.id,
            caseStats: d.data().caseStats,
          }));
          const combined = data.map((c) => {
            if (_.find(caseStatData, ["caseId", c.id])) {
              var caseStats = _.find(caseStatData, ["caseId", c.id]).caseStats;
            }
            return { ...c, ...caseStats };
          });
          setData(combined);
        });
    }
    return unsubscribe;
  }, [user]);

  const defaultColumn = useMemo(() => ({ disableGroupBy: true }), []);

  const getStatus = ({ hRate, mmRate, cmRate, avgTPS, numSolves }) => {
    const goodRates = hRate < 0.5 && mmRate < 0.5 && cmRate < 0.5;
    if (numSolves >= 3 && avgTPS >= 3 && goodRates) return 2;
    if (numSolves > 0) return 1;
    return 0;
  };

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
    let AisBigger = null;
    if (Array.isArray(sA)) {
      // 2 is learned, 1 is learning
      AisBigger = sA[2] !== sB[2] ? sA[2] > sB[2] : sA[1] > sB[1];
    } else AisBigger = sA > sB;

    return AisBigger ? 1 : -1;
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

  const hasUniqueGroups = _.uniqBy(caseSet.cases, "group").length > 1;

  const columns = useMemo(
    () => [
      {
        Header: "Group",
        accessor: "group",
        disableGroupBy: false,
        show: hasUniqueGroups,
      },
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
      {
        Header: "Alg Len",
        accessor: "algs[0]",
        Cell: ({ value }) => {
          let ret = null;
          try {
            ret = getSTM(value);
          } catch {
            ret = 0;
          }
          return ret;
        },
        aggregate: "average",
        Aggregated: ({ value }) => value,
        sortType: "number",
      },
      {
        Header: "Status",
        id: "status",
        accessor: getStatus,
        Cell: ({ value }) => {
          return renderStatus(value);
        },
        aggregate: aggregateStatus,
        Aggregated: ({ value }) => renderAggregatedStatus(value),
        sortType: sortStatus,
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        groupBy: hasUniqueGroups ? ["group"] : [],
        sortBy: [{ id: "status", desc: true }],
        hiddenColumns: columns.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
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
