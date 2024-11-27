import { createContext, useContext, useState } from "react";

// Create a context with a default value
const TranslateContext = createContext();

// Create a provider component
export const TranslateProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  return (
    <TranslateContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslateContext.Provider>
  );
};

// Custom hook to use the TranslateContext
export const useTranslate = () => {
  return useContext(TranslateContext);
};
