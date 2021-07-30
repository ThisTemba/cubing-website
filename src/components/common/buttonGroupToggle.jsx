import React from "react";

const ButtonGroupToggle = ({
  buttons,
  color,
  activeId,
  onSelect,
  size,
  disabled,
}) => {
  const getButtonColor = (activeButtonId, button) => {
    color = button.color || color;
    return activeButtonId === button.id
      ? `btn-${color}`
      : `btn-outline-${color}`;
  };
  size = size === "small" ? "btn-sm" : "";
  return (
    <div className="btn-group  m-1" role="group">
      {buttons.map((button) => {
        return (
          <button
            className={`btn ${getButtonColor(activeId, button)} ${size}`}
            onClick={() => onSelect(button.id)}
            key={button.id}
            disabled={disabled || false}
          >
            {button.content}
          </button>
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
