import { useContext } from "react";
import { AccessibilityContext } from "../contexts/AccessibilityContext";
import Button from "./Button";
import "./AccessibilityModal.css";

/**
 * @module Components
 */

/**
 * AccessibilityModal component that provides sliders to adjust accessibility settings.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onClose - Function to close the modal.
 * @returns {JSX.Element} The accessibility modal component.
 */
const AccessibilityModal = ({ onClose }) => {
  const { settings, updateSettings } = useContext(AccessibilityContext);

  const handleSliderChange = (name, value) => {
    updateSettings({ [name]: value });
  };

  const createSlider = (label, value, name, min, max) => (
    <div className="slider-container">
      <label>{label}</label>
      <div className="slider-controls">
        <Button text="-" onClick={() => handleSliderChange(name, value - 5)} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleSliderChange(name, Number(e.target.value))}
        />
        <Button text="+" onClick={() => handleSliderChange(name, value + 5)} />
      </div>
      <span>{value}%</span>
    </div>
  );

  return (
    <div className="accessibility-modal">
      <h2>Accessibility Settings</h2>
      {createSlider("Button Size", settings.buttonSize, "buttonSize", 100, 300)}
      {createSlider("Text Size", settings.textSize, "textSize", 100, 300)}
      {createSlider("Brightness", settings.brightness, "brightness", 50, 150)}
      {createSlider("Contrast", settings.contrast, "contrast", 50, 150)}
      <div className="modal-actions">
        <Button text="Close" onClick={onClose} />
      </div>
    </div>
  );
};

export default AccessibilityModal;
