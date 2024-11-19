import PropTypes from "prop-types";
import "./Button.css";
export default function Button({
  children,
  onClick,
  secondaryStyle = false,
  typeSubmit = false,
  disabled= false,
}) {
  return (
    <div className="button-wrapper">
      <button
        className={secondaryStyle ? "secondary-button" : "primary-button"}
        onClick={onClick}
        type={typeSubmit ? "submit" : "button"}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  secondaryStyle: PropTypes.bool,
  typeSubmit: PropTypes.bool,
  disabled: PropTypes.bool
};
