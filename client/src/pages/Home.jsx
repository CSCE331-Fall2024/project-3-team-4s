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
  const navigate = useNavigate();
  const { language } = useTranslate();
  const [text, setText] = useState({
    translate: "Translate",
    accessiblity: "Accessibility Options",
    order: "Place Order",
    manager: "Manager",
    cashier: "Cashier",
    heading: "Panda Express",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const translatedText = {
          translate: he.decode(await translate("Translate", language)),
          accessiblity: he.decode(
            await translate("Accessibility Options", language)
          ),
          order: he.decode(await translate("Place Order", language)),
          manager: he.decode(await translate("Manager", language)),
          cashier: he.decode(await translate("Cashier", language)),
          heading: he.decode(await translate("Panda Express", language)),
        };

        setText(translatedText);

        console.log("Current Weather in CSTAT:", `${await currentWeather()}°F`);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

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
          text={text.manager}
          onClick={() =>
            (window.location.href = "http://localhost:3000/auth/google")
          }
          className="med-custom-button"
        />
        <Button
          text={text.cashier}
          onClick={() => navigate("/cashier")}
          className="med-custom-button"
        />
      </div>

      {showTranslateModal && <TranslateModal onSave={closeTranslateModal} />}
    </div>
  );
};

export default Home;
