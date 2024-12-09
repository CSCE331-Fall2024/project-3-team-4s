import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AccessibilityProvider } from "./contexts/AccessibilityContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AccessibilityProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AccessibilityProvider>
  </StrictMode>
);


// File: src/main.jsx


