import React, { createContext, useState, useEffect } from "react";

/**
 * @module Contexts
 */

export const AccessibilityContext = createContext();

/**
 * AccessibilityProvider component that provides accessibility settings context to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the accessibility context.
 * @returns {JSX.Element} The provider component that wraps its children with accessibility context.
 */
export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    buttonSize: 100,
    textSize: 100,
    brightness: 100,
    contrast: 100,
  });

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      buttonSize: Math.min(
        Math.max(newSettings.buttonSize || prevSettings.buttonSize, 100),
        300
      ),
      textSize: Math.min(
        Math.max(newSettings.textSize || prevSettings.textSize, 100),
        300
      ),
      brightness: Math.min(
        Math.max(newSettings.brightness || prevSettings.brightness, 50),
        150
      ),
      contrast: Math.min(
        Math.max(newSettings.contrast || prevSettings.contrast, 50),
        150
      ),
    }));
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--button-scale",
      settings.buttonSize / 100
    );
    document.documentElement.style.setProperty(
      "--text-scale",
      settings.textSize / 100
    );
    document.documentElement.style.setProperty(
      "--brightness",
      settings.brightness / 100
    );
    document.documentElement.style.setProperty(
      "--contrast",
      settings.contrast / 100
    );
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
