import React, { useMemo, useEffect, useState, useContext } from "react";
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
import { UserContext } from "../services/firebase";
import { dispDur, dispDecimal, dispOverline } from "../utils/displayValue";
import DarkModeContext from "../hooks/useDarkMode";
import useCaseModal from "../hooks/useCaseModal";
import useWindowDimensions from "../hooks/useWindowDimensions";
import {
  getPropLearned,
  getStatus,
  aggregateStatus,
} from "../utils/learnedStatus";

export default function CaseSetTable(props) {
  const { caseSet, setSelectedCases } = props;
  const [data, setData] = useState(caseSet.cases || {});
  const { userDoc } = useContext(UserContext);
  const { darkMode } = useContext(DarkModeContext);
  const [CaseModal, showCaseModal, , setCaseModalContent, showing] =
    useCaseModal();
  const [caseModalId, setCaseModalId] = useState(null);
  const { width } = useWindowDimensions();

  const userTrainSettings = useMemo(
    () => userDoc?.data()?.settings?.trainSettings,
    [userDoc]
  );
  const currentCase = _.find(data, ["id", caseModalId]);

  useEffect(() => {
    setCaseModalContent();
    setCaseModalContent(currentCase, caseSet.details);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showing, currentCase, caseSet.details]);

  useEffect(() => {
    setData(caseSet.cases);
  }, [caseSet]);

  const sortStatus = (rowA, rowB) => {
    let [sA, sB] = [rowA.values.status, rowB.values.status];
    const [sAtot, sBtot] = [_.sum(_.values(sA)), _.sum(_.values(sB))];
    sA = _.mapValues(sA, (n) => n / sAtot);
    sB = _.mapValues(sB, (n) => n / sBtot);
    const isAggregated = typeof sA === "object";
    let AisBigger;
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

  const defaultColumn = useMemo(
    () => ({
      disableGroupBy: true,
      Cell: ({ value }) => dispDecimal(value),
      aggregate: definedAverage,
      sortType: "number",
    }),
    []
  );

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
        tooltip: "Hesitation Rate",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="check" />,
        accessor: "nmRate",
        tooltip: "No Mistake Rate",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="minus" />,
        accessor: "mmRate",
        tooltip: "Minor Mistake Rate",
        show: windowIsWide,
      },
      {
        Header: <FaIcon icon="times" />,
        accessor: "cmRate",
        tooltip: "Critical Mistake Rate",
        show: windowIsWide,
      },
      {
        Header: dispOverline("time"),
        accessor: "avgTime",
        tooltip: "Average Solve Time",
        Cell: ({ value }) => dispDur(value),
        show: windowIsWide,
      },
      {
        Header: dispOverline("TPS"),
        accessor: "avgTPS",
        tooltip: "Average Turns Per Second",
        show: windowIsWide,
      },
      {
        Header: "# Solves",
        accessor: "numSolves",
        tooltip: "Total Number of Solves",
        aggregate: "sum",
        Cell: ({ value }) => dispDecimal(value, 0),
        show: windowIsWide,
      },
      {
        Header: "Status",
        tooltip: "Learned Status",
        id: "status",
        accessor: (cas) => getStatus(cas, userTrainSettings),
        Cell: ({ value }) => renderStatus(value),
        aggregate: aggregateStatus,
        Aggregated: ({ value }) => renderAggregatedStatus(value),
        sortType: sortStatus,
      },
    ],
    [windowIsWide, caseSet.details, hasUniqueGroups, userTrainSettings]
  );

  const getPropNotLearnedProps = ({ column, row, isAggregated, value }) => {
    const propLearned = getPropLearned(column.id, value, userTrainSettings);
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
    setSelectedCases(selectedCases);
  }, [table.state.selectedRowIds, setSelectedCases, data]);

  return (
    <>
      <ReactTable table={table} getCellProps={getCellProps} size="sm" hover />
      <CaseModal />
    </>
  );
}
