import React, { useContext, useState } from "react";
import "./AccessibilityModal.css";
import { AccessibilityContext } from "../contexts/AccessibilityContext";
import Button from "./Button";

const AccessibilityModal = ({ onClose }) => {
  const { settings, updateSettings } = useContext(AccessibilityContext);

  const [buttonSize, setButtonSize] = useState(settings.buttonSize);
  const [textSize, setTextSize] = useState(settings.textSize);
  const [brightness, setBrightness] = useState(settings.brightness);
  const [contrast, setContrast] = useState(settings.contrast);

  const handleSliderChange = (name, value) => {
    const clampedValue = Math.min(Math.max(value, 50), 200);
    updateSettings({ [name]: clampedValue });

    switch (name) {
      case "buttonSize":
        setButtonSize(clampedValue);
        break;
      case "textSize":
        setTextSize(clampedValue);
        break;
      case "brightness":
        setBrightness(clampedValue);
        break;
      case "contrast":
        setContrast(clampedValue);
        break;
      default:
        break;
    }
  };

  const createSlider = (label, value, onChange, name) => (
    <div className="slider-container">
      <label>{label}</label>
      <div className="slider-controls">
        <Button text="-" onClick={() => onChange(name, value - 5)} />
        <input
          type="range"
          min="50"
          max="200"
          value={value}
          onChange={(e) => onChange(name, Number(e.target.value))}
        />
        <Button text="+" onClick={() => onChange(name, value + 5)} />
      </div>
      <span>{value}%</span>
    </div>
  );

  return (
    <div className="accessibility-modal">
      <h2>Accessibility Settings</h2>
      {createSlider("Button Size", buttonSize, handleSliderChange, "buttonSize")}
      {createSlider("Text Size", textSize, handleSliderChange, "textSize")}
      {createSlider("Brightness", brightness, handleSliderChange, "brightness")}
      {createSlider("Contrast", contrast, handleSliderChange, "contrast")}
      <div className="modal-actions">
        <Button text="Close" onClick={onClose} />
      </div>
    </div>
  );
};

export default AccessibilityModal;