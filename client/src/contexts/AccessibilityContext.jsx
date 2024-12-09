import React, { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    buttonSize: 100, 
    textSize: 100, 
    brightness: 100,
    contrast: 100,
  });

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      buttonSize: Math.min(Math.max(newSettings.buttonSize || prevSettings.buttonSize, 100), 300),
      textSize: Math.min(Math.max(newSettings.textSize || prevSettings.textSize, 100), 300),
      brightness: Math.min(Math.max(newSettings.brightness || prevSettings.brightness, 50), 150),
      contrast: Math.min(Math.max(newSettings.contrast || prevSettings.contrast, 50), 150),
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