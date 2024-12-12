import "./Button.css";

/**
 * @module Components
 */

/**
 * Button component that renders a customizable button.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to display on the button.
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @param {string} [props.className] - Additional class names for the button.
 * @returns {JSX.Element} The button component.
 */
const Button = ({ text, onClick, className = "" }) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
