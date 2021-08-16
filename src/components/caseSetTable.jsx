import React, { useMemo, useEffect, useState, useContext } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGroupBy,
  useExpanded,
} from "react-table";
import _ from "lodash";
import CaseImage from "./common/cubing/cubeImage";
import Checkbox from "./common/checkbox";
import ReactTable from "./common/reactTable";
import MultiProgressBar from "./common/multiProgressBar";
import { UserContext } from "../fire";
import useDarkMode from "../hooks/useDarkMode";
import useCaseModal from "../hooks/useCaseModal";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { dispDecimal, dispDur, dispOverline } from "../utils/displayValue";
import { getCaseSetDocRef } from "../utils/writeCases";
import { getStatLearned, getStatus, sortStatus } from "../utils/learnedStatus";
import { FaIcon } from "../fontAwesome";

export default function CaseSetTable(props) {
  const { caseSet, initData } = props;

  const [tableData, setTableData] = useState(initData);
  const [caseModalId, setCaseModalId] = useState(null);
  const defaultCaseLearnedCriteria = {
    hRate: { threshold: 0.4, symbol: "<=" },
    mmRate: { threshold: 0.4, symbol: "<=" },
    cmRate: { threshold: 0.1, symbol: "<=" },
    numSolves: { threshold: 5, symbol: ">=" },
    avgTPS: { threshold: 3, symbol: ">=" },
  };

  const [CaseModal, showCaseModal, setCaseModalContent, showing] =
    useCaseModal();
  const { width } = useWindowDimensions();
  const [darkMode] = useDarkMode();
  const { user, userDoc } = useContext(UserContext);
  const criteria =
    userDoc?.settings?.trainSettings?.caseLearnedCriteria ||
    defaultCaseLearnedCriteria;

  useEffect(() => {
    setCaseModalContent();
    const cas = _.find(tableData, ["id", caseModalId]);
    setCaseModalContent(cas, caseSet.details);
  }, [showing, _.find(tableData, ["id", caseModalId])]);

  useEffect(() => {
    let unsubscribe1 = () => {};
    if (user) {
      unsubscribe1 = getCaseSetDocRef(user, caseSet.details).onSnapshot(
        (caseSetDoc) => {
          if (caseSetDoc.data()) {
            const userCases = caseSetDoc.data().cases;
            const combined = tableData.map((c) => {
              const userCase = _.find(userCases, ["id", c.id]);
              const caseStats = userCase?.caseStats;
              const alg = userCase?.alg || c.alg;
              const combinedCase = { ...c, ...caseStats, alg };
              return combinedCase;
            });
            setTableData(combined);
          }
        }
      );
    }
    return () => {
      unsubscribe1();
    };
  }, [user]);

  const renderAggregatedStatus = (counts) => {
    const values = [2, 1, 0].map((n) => counts[n]);
    const variants = ["success", "warning", "secondary"];
    return <MultiProgressBar values={values} variants={variants} />;
  };

  const renderStatus = (status) => {
    const textStyles = ["text-secondary", "text-warning", "text-success"];
    return <FaIcon icon="circle" size="lg" className={textStyles[status]} />;
  };

  const definedAverage = (values) => {
    const definedValues = values.filter((v) => typeof v !== "undefined");
    if (definedValues.length > 0) return _.mean(definedValues);
    else return undefined;
  };

  const hasUniqueGroups = _.uniqBy(caseSet.cases, "group").length > 1;
  const isWide = width >= 576;
  const csDetails = caseSet.details;

  const defaultColumn = useMemo(
    () => ({
      disableGroupBy: true,
      Cell: ({ value }) => dispDecimal(value),
      aggregate: definedAverage,
      sortType: "number",
    }),
    [dispDecimal, definedAverage]
  );
  const columns = useMemo(
    () => [
      {
        Header: "Group",
        accessor: "group",
        Cell: ({ value }) => String(value),
        aggregate: null,
        disableGroupBy: false,
        show: hasUniqueGroups,
      },
      {
        Header: "Case",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <CaseImage alg={value.alg} caseSetDetails={csDetails} size="65" />
        ),
        aggregate: (values) => _(values).sample(),
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (value ? String(value) : ""),
        show: isWide,
        aggregate: null,
      },
      { Header: <FaIcon icon="spinner" />, accessor: "hRate", show: isWide },
      { Header: <FaIcon icon="check" />, accessor: "nmRate", show: isWide },
      { Header: <FaIcon icon="minus" />, accessor: "mmRate", show: isWide },
      { Header: <FaIcon icon="times" />, accessor: "cmRate", show: isWide },
      {
        Header: dispOverline("time"),
        accessor: "avgTime",
        Cell: ({ value }) => dispDur(value),
        show: isWide,
      },
      { Header: dispOverline("TPS"), accessor: "avgTPS", show: isWide },
      {
        Header: "# Solves",
        accessor: "numSolves",
        aggregate: "sum",
        Cell: ({ value }) => dispDecimal(value, 0),
        show: isWide,
      },
      {
        Header: "Status",
        id: "status",
        accessor: (row) => getStatus(row, criteria),
        Cell: ({ value }) => renderStatus(value),
        aggregate: (values) => _.countBy(values),
        Aggregated: ({ value }) => renderAggregatedStatus(value),
        sortType: (rowA, rowB) =>
          sortStatus(rowA.values.status, rowB.values.status),
      },
    ],
    [isWide, criteria]
  );

  const getStatNotLearnedProps = ({ column, row, isAggregated, value }) => {
    const statObj = { [column.id]: value };
    const statLearned = getStatLearned(statObj, criteria);
    if (statLearned === null) return;
    const hasSolves = row.original?.numSolves;
    const color = darkMode ? "#ffc107" : "#f09b0a";
    const styleMe = hasSolves && !isAggregated && !statLearned;
    if (styleMe) return { style: { fontWeight: "700", color } };
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
    return _.merge(getStatNotLearnedProps(cell), getClickForModalProps(cell));
  };

  const addCheckboxes = (hooks) => {
    const selectCol = {
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      ),
      Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
    };
    hooks.visibleColumns.push((columns) => [...columns, selectCol]);
  };

  const initialState = {
    groupBy: hasUniqueGroups ? ["group"] : [],
    sortBy: [{ id: "status", desc: true }],
    hiddenColumns: columns.map((column) => {
      if (column.show === false) return column.accessor || column.id;
    }),
  };

  const data = useMemo(() => tableData, [tableData]);
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
    const selectedCases = tableData.filter((unused, i) => selectedRowIds[i]);
    props.setSelectedCases(selectedCases);
  }, [table.state.selectedRowIds]);

  return (
    <>
      <ReactTable table={table} getCellProps={getCellProps} size="sm" hover />
      <CaseModal />
    </>
  );
}
