import React, { useMemo, useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGroupBy,
  useExpanded,
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import MOCK_DATA from "../data/MOCK_DATA.json";
import { CaseImage } from "./common/cubing/cubeImage";
import { Checkbox } from "./common/checkbox";
import ReactTable from "./common/reactTable";
import { useAuthState, db } from "../fire";
import { displayDur } from "../utils/formatTime";
import useDarkMode from "../hooks/useDarkMode";

export default function CaseSetTable(props) {
  const { caseSet } = props;
  // const data = useMemo(() => caseSet.cases, []);
  const [data, setData] = useState(caseSet.cases);
  const user = useAuthState();
  const [darkMode] = useDarkMode();
  // const data = useMemo(() => MOCK_DATA, []);

  useEffect(() => {
    let unsubscribe = () => {};
    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("caseSets")
        .doc(caseSet.details.id)
        .onSnapshot((caseSetDoc) => {
          const caseStatData = caseSetDoc.data().cases;
          const combined = data.map((c) => {
            if (_.find(caseStatData, ["id", c.id])) {
              var caseStats = _.find(caseStatData, ["id", c.id]).caseStats;
            }
            return { ...c, ...caseStats };
          });
          setData(combined);
        });
    }
    return unsubscribe;
  }, [user]);

  const defaultColumn = useMemo(() => ({ disableGroupBy: true }), []);

  const getPropLearned = (prop, val) => {
    const map = {
      hRate: { symbol: "<", value: 0.5 },
      mmRate: { symbol: "<", value: 0.5 },
      cmRate: { symbol: "<", value: 0.5 },
      avgTPS: { symbol: ">", value: 2 },
      numSolves: { symbol: ">", value: 2 },
    };
    if (typeof map[prop] === "undefined") return null;
    if (map[prop].symbol === ">") {
      return val > map[prop].value;
    } else if (map[prop].symbol === "<") {
      return val < map[prop].value;
    } else throw new Error("symbol not recognized");
  };

  const getStatus = ({ hRate, mmRate, cmRate, avgTPS, numSolves }) => {
    const allLearned =
      getPropLearned("hRate", hRate) &&
      getPropLearned("cmRate", cmRate) &&
      getPropLearned("mmRate", mmRate) &&
      getPropLearned("avgTPS", avgTPS) &&
      getPropLearned("numSolves", numSolves);
    if (allLearned) return 2;
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
      0: ["text-secondary", "not started"],
      1: ["text-warning", "learning"],
      2: ["text-success", "learned"],
    };
    const color = map[status][0];
    return (
      <span>
        <FontAwesomeIcon icon="circle" size="lg" className={color} />
      </span>
    );
  };

  const renderCaseImage = ({ value }) => {
    return (
      <CaseImage case={value} caseSetDetails={caseSet.details} size="65" />
    );
  };

  const hasUniqueGroups = _.uniqBy(caseSet.cases, "group").length > 1;

  const displayRate = ({ value }) => {
    return typeof value === "undefined" ? "-" : _.round(value, 2);
  };

  const definedAverage = (values) => {
    const definedValues = values.filter((v) => typeof v !== "undefined");
    if (definedValues.length > 0) return _.mean(definedValues);
    else return undefined;
  };

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
        Header: <FontAwesomeIcon icon="spinner" />,
        accessor: "hRate",
        aggregate: definedAverage,
        Cell: displayRate,
        sortType: "number",
      },
      {
        Header: <FontAwesomeIcon icon="check" />,
        accessor: "nmRate",
        aggregate: definedAverage,
        Cell: displayRate,
        sortType: "number",
      },
      {
        Header: <FontAwesomeIcon icon="minus" />,
        accessor: "mmRate",
        aggregate: definedAverage,
        Cell: displayRate,
        sortType: "number",
      },
      {
        Header: <FontAwesomeIcon icon="times" />,
        accessor: "cmRate",
        aggregate: definedAverage,
        Cell: displayRate,
        sortType: "number",
      },
      {
        Header: <span style={{ textDecoration: "overline" }}>time</span>,
        accessor: "avgTime",
        aggregate: definedAverage,
        Cell: ({ value }) =>
          typeof value === "undefined" ? "-" : displayDur(value),
        sortType: "number",
      },
      {
        Header: <span style={{ textDecoration: "overline" }}>TPS</span>,
        accessor: "avgTPS",
        aggregate: definedAverage,
        Cell: ({ value }) =>
          typeof value === "undefined" ? "-" : _.round(value, 2),
        sortType: "number",
      },
      {
        Header: "# Solves",
        accessor: "numSolves",
        aggregate: "sum",
        Cell: ({ value }) => (typeof value === "undefined" ? 0 : value),
        sortType: "number",
      },
      // {
      //   Header: "Alg Len",
      //   accessor: "algs[0]",
      //   Cell: ({ value }) => {
      //     let ret = null;
      //     try {
      //       ret = getSTM(value);
      //     } catch {
      //       ret = 0;
      //     }
      //     return ret;
      //   },
      //   aggregate: "average",
      //   Aggregated: ({ value }) => value,
      //   sortType: "number",
      // },
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

  const getCellProps = (cell) => {
    const statusCells = ["hRate", "cmRate", "mmRate", "avgTPS", "numSolves"];
    if (statusCells.includes(cell.column.id)) {
      const propLearned = getPropLearned(cell.column.id, cell.value);
      if (typeof cell.value !== "number") return {};
      if (cell.isAggregated) return {};
      if (propLearned) return {};
      return {
        style: {
          fontWeight: "700",
          color: darkMode ? "#ffc107" : "#f09b0a",
        },
      };
    } else return {};
  };

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

  return (
    <ReactTable table={tableInstance} getCellProps={getCellProps} size="sm" />
  );
}
