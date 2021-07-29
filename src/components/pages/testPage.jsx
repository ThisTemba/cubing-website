import React, { useMemo } from "react";
import ReactTable from "../common/reactTable";
import { Container } from "react-bootstrap";
import { useTable, useSortBy, useGroupBy, useExpanded } from "react-table";

export default function TestPage() {
  const data = useMemo(
    () => [
      {
        name: "Tim",
        age: "About 50",
      },
      {
        name: "Art",
        age: "About 25",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Age",
        accessor: "age",
      },
    ],
    []
  );

  // const table = useTable({ columns, data });
  const table = useTable({ columns, data }, useGroupBy, useSortBy, useExpanded);

  return (
    <Container>
      <h1>Test Page</h1>
      <ReactTable table={table} />
    </Container>
  );
}
