import "./Button.css";

const Button = ({ text, onClick, className = "", fontSize }) => {
  return (
    <button
      className={`custom-button ${className}`}
      onClick={onClick}
      style={{ fontSize }}
    >
      {text}
    </button>
  );
};

export default Button;
