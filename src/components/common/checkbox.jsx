//Source: https://react-table.tanstack.com/docs/examples/row-selection
import React from "react";

export const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={resolvedRef}
      className={"m-2"}
      {...rest}
      style={{ width: "25px", height: "25px" }}
    />
  );
});
