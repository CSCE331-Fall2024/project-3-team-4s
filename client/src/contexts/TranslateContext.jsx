import { createContext, useContext, useState } from "react";

// Create a context with a default value
const TranslateContext = createContext();

/**
 * @module Contexts
 */

/**
 * TranslateProvider that provides translation context to its children components.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
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
