import { useEffect, useState } from "react";
import { useTranslate } from "../contexts/TranslateContext"; // Import translation context
import { translate } from "../utils/translateUtil"; // Import translation function
import Button from "../components/Button"; // Import your custom Button component
import "../pages/CustomerHome.css";

/**
 * @module Components
 */

/**
 * BottomBar component that displays selected items and provides an option to add them to the order.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.selectedItem - The selected item object.
 * @param {Array} props.selectedSides - The array of selected sides.
 * @param {Array} props.selectedEntrees - The array of selected entrees.
 * @param {Function} props.addToOrder - Function to add items to the order.
 * @param {Function} props.resetSelections - Function to reset selections.
 * @returns {JSX.Element} The bottom bar component.
 */
const BottomBar = ({
  selectedItem,
  selectedSides,
  selectedEntrees,
  addToOrder,
  resetSelections,
}) => {
  const { language } = useTranslate(); // Get the current language
  const [translatedSelected, setTranslatedSelected] = useState("Selected:");
  const [translatedAddToOrder, setTranslatedAddToOrder] =
    useState("Add to Order");
  const [translatedAlertSide, setTranslatedAlertSide] = useState(
    "Please select at least one side."
  );
  const [translatedAlertEntree, setTranslatedAlertEntree] = useState("");
  const [translatedSides, setTranslatedSides] = useState([]);
  const [translatedEntrees, setTranslatedEntrees] = useState([]);
  const [sidetext, setSide] = useState("Side");
  const [entreetext, setEntree] = useState("Entree");

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const selectedText = await translate("Selected:", language);
        const addToOrderText = await translate("Add to Order", language);
        const alertSideText = await translate(
          "Please select at least one side.",
          language
        );
        const alertEntreeText = await translate(
          "Please select at least {requiredEntrees} entree(s).",
          language
        );
        const sideTranslations = await translate("Side", language);
        const entreeTranslations = await translate("Entree", language);

        const sidesTranslations = await Promise.all(
          selectedSides.map(async (side) => ({
            ...side,
            translatedName: await translate(side.item_name, language),
          }))
        );

        const entreesTranslations = await Promise.all(
          selectedEntrees.map(async (entree) => ({
            ...entree,
            translatedName: await translate(entree.item.item_name, language),
          }))
        );

        setTranslatedSelected(selectedText);
        setTranslatedAddToOrder(addToOrderText);
        setTranslatedAlertSide(alertSideText);
        setTranslatedAlertEntree(alertEntreeText);
        setTranslatedSides(sidesTranslations);
        setTranslatedEntrees(entreesTranslations);
        setEntree(entreeTranslations);
        setSide(sideTranslations);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [language, selectedSides, selectedEntrees]);

  const validateSelections = () => {
    const requiredEntrees =
      selectedItem.item_name === "Bowl"
        ? 1
        : selectedItem.item_name === "Plate"
        ? 2
        : selectedItem.item_name === "Bigger Plate"
        ? 3
        : 0;

    if (selectedSides.length < 1) {
      alert(translatedAlertSide);
      return false;
    }

    const totalEntreesSelected = selectedEntrees.reduce(
      (sum, entree) => sum + entree.count,
      0
    );
    if (totalEntreesSelected < requiredEntrees) {
      alert(
        translatedAlertEntree.replace("{requiredEntrees}", requiredEntrees)
      );
      return false;
    }

    return true;
  };

  const handleAddToOrder = () => {
    if (!validateSelections()) return;

    addToOrder(selectedItem.item_name, 1);

    const items = [
      ...selectedSides.map((side) => ({ name: side.item_name, quantity: 1 })),
      ...selectedEntrees.map((entree) => ({
        name: entree.item.item_name,
        quantity: entree.count,
      })),
    ];
    items.forEach((item) => addToOrder(item.name, item.quantity));

    resetSelections();
  };

  return (
    <div className="bottom-bar">
      <div className="selected-items">
        <h3>
          {translatedSelected} {selectedItem.item_name}
        </h3>
        <ul>
          {translatedSides.map((side, index) => (
            <li key={index}>
              <strong>{sidetext}</strong>{" "}
              {side.translatedName || side.item_name}
            </li>
          ))}
          {translatedEntrees.map((entree, index) => (
            <li key={index}>
              <strong>{entreetext}</strong>{" "}
              {entree.translatedName || entree.item.item_name} x {entree.count}
            </li>
          ))}
        </ul>
      </div>
      <Button
        className="add-to-order-button-bottom"
        onClick={handleAddToOrder}
        text={translatedAddToOrder}
        fontSize="16px"
      />
    </div>
  );
};

export default BottomBar;
