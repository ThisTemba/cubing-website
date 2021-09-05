import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function CustomTooltip(props) {
  const { showTime, hideTime, message, instant, placement } = props;
  const renderTooltip = (props, message) => (
    <Tooltip content id="button-tooltip" {...props}>
      <span>{message}</span>
    </Tooltip>
  );

  const show = message ? (instant ? 0 : showTime) : Infinity;
  const hide = instant ? 0 : hideTime;

  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show, hide }}
      overlay={(tooltipProps) => renderTooltip(tooltipProps, message)}
    >
      {props.children}
    </OverlayTrigger>
  );
}

CustomTooltip.defaultProps = {
  showTime: 300,
  hideTime: 400,
  placement: "top",
};
