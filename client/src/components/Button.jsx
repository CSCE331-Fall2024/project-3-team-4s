import React, { useContext } from "react";
import { AccessibilityContext } from "../contexts/AccessibilityContext";
import "./Button.css";

const Button = ({ text, onClick, className = "", fontSize, scale }) => {
  return (
    <button
      className={`custom-button ${className}`}
      onClick={onClick}
      style={{
        fontSize: fontSize || `${className.includes("big-custom-button") ? 2 : 1}rem`,
        transform: `scale(${scale || 1})`,
      }}
    >
      {text}
    </button>
  );
};

export default Button;
