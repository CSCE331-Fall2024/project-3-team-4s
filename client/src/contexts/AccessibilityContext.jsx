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
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
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