import { useState, useEffect } from "react";
import { useOrder } from "../contexts/OrderContext";
import { useTranslate } from "../contexts/TranslateContext"; // Import your translation context
import { translate } from "../utils/translateUtil"; // Import your translation function
import Button from "../components/Button"; // Import your custom Button component
import "../pages/CustomerHome.css";

/**
 * @module Components
 */

/**
 * EntreeModal component that provides a modal to add an entree to the order.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.entree - The entree object.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.resetSelections - Function to reset selections.
 * @returns {JSX.Element|null} The entree modal component.
 */
const EntreeModal = ({ entree, onClose, resetSelections }) => {
  if (!entree) return null;

  const [quantity, setQuantity] = useState(1);
  const { addToOrder } = useOrder();
  const [translatedName, setTranslatedName] = useState("");
  const [addToOrderLabel, setAddToOrderLabel] = useState("Add to Order");
  const { language } = useTranslate(); // Get the current language

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const name = await translate(entree.name, language);
        const addToOrderText = await translate("Add to Order", language);

        setTranslatedName(name);
        setAddToOrderLabel(addToOrderText);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [entree.name, language]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToOrder = () => {
    resetSelections(); // Reset the selections in the parent component
    addToOrder(entree.name, quantity);
    onClose(); // Close the modal after adding to the order
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span>
          <Button
            className="close-button"
            onClick={onClose}
            text="X"
            fontSize="36px"
          />
        </span>
        <br />
        <br />
        <br />
        <div className="modal-name">
          <h2>{translatedName || entree.name}</h2>
        </div>
        <img src={entree.image} alt={entree.name} className="modal-image" />

        <div className="modal-name">
          <h2 className="appetizer-price">${entree.price.toFixed(2)}</h2>
        </div>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <Button
            onClick={decrementQuantity}
            text="-"
            className="quantity-button"
            fontSize="20px"
          />
          <span>{quantity}</span>
          <Button
            onClick={incrementQuantity}
            text="+"
            className="quantity-button"
            fontSize="20px"
          />
        </div>

        <Button
          className="add-to-order-button"
          onClick={handleAddToOrder}
          text={addToOrderLabel}
          fontSize="16px"
        />
      </div>
    </div>
  );
};

export default EntreeModal;
