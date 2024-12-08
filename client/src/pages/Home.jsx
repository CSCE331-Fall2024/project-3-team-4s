import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";
import Button from "../components/Button";
import TranslateModal from "../components/TranslateModal";
import { translate } from "../utils/translateUtil";
import { currentWeather } from "../utils/weatherUtil";
import { useTranslate } from "../contexts/TranslateContext";
import he from "he";

const Home = () => {
  const backendURL = "http://localhost:3000";
  const navigate = useNavigate();
  const { language } = useTranslate();
  const [isRendered, setIsRendered] = useState(false);
  const [text, setText] = useState({
    translate: "Translate",
    accessiblity: "Accessibility Options",
    order: "Place Order",
    employee: "Employee",
    heading: "Panda Express",
  });

  // Fetch translations and current weather
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const translatedText = {
          translate: he.decode(await translate("Translate", language)),
          accessiblity: he.decode(
            await translate("Accessibility Options", language)
          ),
          order: he.decode(await translate("Place Order", language)),
          employee: he.decode(await translate("Employee", language)),
          heading: he.decode(await translate("Panda Express", language)),
        };

        setText(translatedText);

        console.log("Current Weather in CSTAT:", `${await currentWeather()}°F`);

        setIsRendered(true);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  // Check for unauthorized access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const unauthorized = params.get("unauthorized");

    if (unauthorized && isRendered) {
      if (window.confirm("Unauthorized access")) {
        window.location.replace(window.location.origin); // Navigate to the home page without query params
      }
    }
  }, [isRendered]);

  const [showTranslateModal, setShowTranslateModal] = useState(false);

  const openTranslateModal = () => {
    setShowTranslateModal(true);
  };

  const closeTranslateModal = () => {
    setShowTranslateModal(false);
  };

  return (
    <div className="home-container">
      <div className="home-left">
        <Button
          text={text.translate}
          className="med-custom-button"
          onClick={openTranslateModal}
        />
        <Button text={text.accessiblity} className="med-custom-button" />
      </div>

      <div className="home-center">
        <h1 className="home-heading">{text.heading}</h1>

        <img className="panda-logo" src="/panda.png" alt="Panda Logo" />

        <Button
          text={text.order}
          onClick={() => navigate("/customer")}
          className="big-custom-button"
        />
      </div>

      <div className="home-right">
        <Button
          text={text.employee}
          onClick={() => (window.location.href = `${backendURL}/auth/google`)}
          className="med-custom-button"
        />
      </div>

      {showTranslateModal && <TranslateModal onSave={closeTranslateModal} />}
    </div>
  );
};

export default Home;
