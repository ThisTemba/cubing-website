import React, { useMemo, useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGroupBy,
  useExpanded,
} from "react-table";
import { FaIcon } from "../fontAwesome";
import _ from "lodash";
import CaseImage from "./common/cubing/cubeImage";
import Checkbox from "./common/checkbox";
import ReactTable from "./common/reactTable";
import MultiProgressBar from "./common/multiProgressBar";
import { useAuthState, db } from "../fire";
import { dispDur, dispDecimal, dispOverline } from "../utils/displayValue";
import { getCaseSetDocRef } from "../utils/writeCases";
import useDarkMode from "../hooks/useDarkMode";
import useCaseModal from "../hooks/useCaseModal";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function CaseSetTable(props) {
  const { caseSet } = props;
  // const data = useMemo(() => caseSet.cases, []);
  const initData = caseSet.cases.map((c) => ({ ...c, alg: c.algs[0] }));
  const [data, setData] = useState(initData);
  const user = useAuthState();
  const [darkMode] = useDarkMode();
  const [CaseModal, showCaseModal, , setCaseModalContent, showing] =
    useCaseModal();
  const [caseModalId, setCaseModalId] = useState(null);
  const { width } = useWindowDimensions();
  const defaultTrainSettings = {
    hRate: 0.4,
    mmRate: 0.4,
    cmRate: 0.1,
    avgTPS: 2,
    numSolves: 2,
  };
  const [trainSettings, setTrainSettings] = useState(defaultTrainSettings);

  useEffect(() => {
    setCaseModalContent();
    const cas = _.find(data, ["id", caseModalId]);
    setCaseModalContent(cas, caseSet.details);
  }, [showing, _.find(data, ["id", caseModalId])]);

  useEffect(() => {
    let unsubscribe1 = () => {};
    let unsubscribe2 = () => {};
    if (user) {
      unsubscribe1 = getCaseSetDocRef(user, caseSet.details).onSnapshot(
        (caseSetDoc) => {
          if (caseSetDoc.data()) {
            const userCases = caseSetDoc.data().cases;
            const combined = data.map((c) => {
              const userCase = _.find(userCases, ["id", c.id]);
              const caseStats = userCase?.caseStats;
              const alg = userCase?.alg || c.alg;
              const combinedCase = { ...c, ...caseStats, alg };
              // Source: https://stackoverflow.com/q/46957194/3593621
              // TL;DR can spread undefined into objects but not arrays
              return combinedCase;
            });
            setData(combined);
          }
        }
      );
      unsubscribe2 = db
        .collection("users")
        .doc(user.uid)
        .onSnapshot((userDoc) => {
          if (userDoc.data()?.settings?.trainSettings) {
            setTrainSettings(userDoc.data().settings.trainSettings);
          }
        });
    }
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [user]);

  const getPropLearned = (prop, val) => {
    const settingsValue = trainSettings[prop];
    const map = {
      hRate: { symbol: "<" },
      mmRate: { symbol: "<" },
      cmRate: { symbol: "<" },
      avgTPS: { symbol: ">" },
      numSolves: { symbol: ">" },
    };
    if (typeof map[prop] === "undefined") return null;
    if (map[prop].symbol === ">") {
      return val >= settingsValue;
    } else if (map[prop].symbol === "<") {
      return val <= settingsValue;
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

  const sortStatus = (rowA, rowB) => {
    const [sA, sB] = [rowA.values.status, rowB.values.status];
    const isAggregated = typeof sA === "object";
    let AisBigger = null;
    if (isAggregated) {
      AisBigger = sA[2] !== sB[2] ? sA[2] > sB[2] : sA[1] > sB[1];
    } else {
      AisBigger = sA > sB;
    }
    return AisBigger ? 1 : -1;
  };

  const renderAggregatedStatus = (counts) => {
    const values = [2, 1, 0].map((n) => counts[n]);
    const variants = ["success", "warning", "secondary"];
    return <MultiProgressBar values={values} variants={variants} />;
  };

  const renderStatus = (status) => {
    const textStyles = ["text-secondary", "text-warning", "text-success"];
    return <FaIcon icon="circle" size="lg" className={textStyles[status]} />;
  };

  const hasUniqueGroups = _.uniqBy(caseSet.cases, "group").length > 1;

  const definedAverage = (values) => {
    const definedValues = values.filter((v) => typeof v !== "undefined");
    if (definedValues.length > 0) return _.mean(definedValues);
    else return undefined;
  };

  const windowIsWide = width >= 576;

  const defaultColumn = {
    disableGroupBy: true,
    Cell: ({ value }) => dispDecimal(value),
    aggregate: definedAverage,
    sortType: "number",
  };

  const columns = useMemo(
    () => [
      {
        Header: "Group",
        accessor: "group",
        Cell: ({ value }) => String(value),
        aggregate: null,
        sortType: "alphanumeric",
        disableGroupBy: false,
        show: hasUniqueGroups,
      },
      {
        Header: "Case",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <CaseImage
            alg={value.alg}
            caseSetDetails={caseSet.details}
            size="65"
          />
        ),
        aggregate: (values) => _(values).sample(),
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (value ? String(value) : ""),
        aggregate: null,
        sortType: "alphanumeric",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="spinner" />,
        accessor: "hRate",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="check" />,
        accessor: "nmRate",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="minus" />,
        accessor: "mmRate",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="times" />,
        accessor: "cmRate",
        show: windowIsWide,
      },
      {
        Header: dispOverline("time"),
        accessor: "avgTime",
        Cell: ({ value }) => dispDur(value),
        show: windowIsWide,
      },
      {
        Header: dispOverline("TPS"),
        accessor: "avgTPS",
        show: windowIsWide,
      },
      {
        Header: "# Solves",
        accessor: "numSolves",
        aggregate: "sum",
        Cell: ({ value }) => dispDecimal(value, 0),
        show: windowIsWide,
      },
      {
        Header: "Status",
        id: "status",
        accessor: getStatus,
        Cell: ({ value }) => renderStatus(value),
        aggregate: (values) => _.countBy(values),
        Aggregated: ({ value }) => renderAggregatedStatus(value),
        sortType: sortStatus,
      },
    ],
    [windowIsWide, trainSettings]
  );

  const getPropNotLearnedProps = ({ column, row, isAggregated, value }) => {
    const propLearned = getPropLearned(column.id, value);
    if (propLearned === null) return;
    const hasSolves = row.original?.numSolves;
    if (hasSolves && !isAggregated && !propLearned) {
      const color = darkMode ? "#ffc107" : "#f09b0a";
      return { style: { fontWeight: "700", color } };
    }
  };

  const getClickForModalProps = ({ column, row, isAggregated, isGrouped }) => {
    if (!isGrouped && !isAggregated && !(column.id === "selection")) {
      return {
        onClick: () => {
          const cas = row.original;
          setCaseModalId(cas.id);
          showCaseModal(cas, caseSet.details);
        },
        style: { cursor: "pointer" },
      };
    }
  };

  const getCellProps = (cell) => {
    return _.merge(getPropNotLearnedProps(cell), getClickForModalProps(cell));
  };

  const addCheckboxes = (hooks) => {
    const selectColumn = {
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      ),
      Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
    };
    hooks.visibleColumns.push((columns) => [...columns, selectColumn]);
  };

  const initialState = {
    groupBy: hasUniqueGroups ? ["group"] : [],
    sortBy: [{ id: "status", desc: true }],
    hiddenColumns: columns.map((column) => {
      if (column.show === false) return column.accessor || column.id;
    }),
  };

  const table = useTable(
    { columns, data, defaultColumn, initialState },
    useGroupBy,
    useSortBy,
    useExpanded,
    useRowSelect,
    addCheckboxes
  );

  useEffect(() => {
    const selectedRowIds = table.state.selectedRowIds;
    const selectedCases = data.filter((unused, i) => selectedRowIds[i]);
    props.setSelectedCases(selectedCases);
  }, [table.state.selectedRowIds]);

  return (
    <>
      <ReactTable table={table} getCellProps={getCellProps} size="sm" hover />
      <CaseModal />
    </>
  );
}
