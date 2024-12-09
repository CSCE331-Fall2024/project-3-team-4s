import React, { useEffect, useState } from "react";
import { useTranslate } from "../contexts/TranslateContext"; // Import translation context
import { translate } from "../utils/translateUtil"; // Import translation function
import "../pages/CustomerHome.css";

const PopupNotification = ({ popupDetails }) => {
  if (!popupDetails) return null;

  const { language } = useTranslate(); // Get the current language
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const translated = await translate(
          `Added ${popupDetails.quantity} ${popupDetails.name} ${popupDetails.isBowl || ""} ${popupDetails.isPlate || ""} ${popupDetails.isBiggerPlate || ""} to the order.`,
          language
        );
        setTranslatedText(translated);
      } catch (error) {
        console.error("Error fetching translation:", error);
      }
    };

    fetchTranslation();
  }, [popupDetails, language]);

  return (
    <div className="popup-notification">
      <p>{translatedText || "Loading..."}</p>
    </div>
  );
};

export default PopupNotification;
