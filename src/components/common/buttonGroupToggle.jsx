import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";

const ButtonGroupToggle = ({ buttons, color, activeId, onSelect, ...rest }) => {
  const getButtonVariant = (activeButtonId, button) => {
    color = button.color || color;
    return activeButtonId === button.id ? `${color}` : `outline-${color}`;
  };

  const renderTooltip = (props, message) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );

  return (
    <div className="btn-group  m-1" role="group">
      {buttons.map((button) => {
        return (
          <OverlayTrigger
            placement="top"
            delay={{ show: button.tooltip ? 700 : Infinity, hide: 300 }}
            overlay={(props) => renderTooltip(props, button.tooltip)}
          >
            <Button
              variant={getButtonVariant(activeId, button)}
              onClick={() => onSelect(button.id)}
              key={button.id}
              {...rest}
            >
              {button.content}
            </Button>
          </OverlayTrigger>
        );
      })}
    </div>
  );
};

ButtonGroupToggle.defaultProps = {
  color: "dark",
  buttons: [
    {
      content: "Button 1",
      id: 1,
    },
    {
      content: "Button 2",
      id: 2,
    },
  ],
  onSelect: (id) => {
    console.log("Default onSelect method: Button " + id + " selected");
  },
  activeId: 1,
};

export default ButtonGroupToggle;
