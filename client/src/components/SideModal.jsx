import React, { useState, useEffect } from 'react';
import { useOrder } from '../pages/OrderContext';
import { useTranslate } from "../contexts/TranslateContext"; // Import your translation context
import { translate } from "../utils/translateUtil"; // Import your translation function
import Button from '../components/Button'; // Import your custom Button component
import '../pages/CustomerHome.css';

const SideModal = ({ side, onClose, resetSelections }) => {
  if (!side) return null;

  const [quantity, setQuantity] = useState(1);
  const { addToOrder } = useOrder();
  const [translatedName, setTranslatedName] = useState("");
  const [addToOrderLabel, setAddToOrderLabel] = useState("Add to Order");
  const { language } = useTranslate(); // Get the current language

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const name = await translate(side.name, language);
        const addToOrderText = await translate("Add to Order", language);

        setTranslatedName(name);
        setAddToOrderLabel(addToOrderText);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [side.name, language]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToOrder = () => {
    addToOrder(side.name, quantity);
    onClose(); // Close the modal after adding to the order
    resetSelections(); // Reset the selections in the parent component
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
        <br /><br /><br />
        <div className="modal-name">
          <h2>{translatedName || side.name}</h2>
        </div>
        <img src={side.image} alt={side.name} className="modal-image" />

        <div className="modal-name">
          <h2 className="appetizer-price">${side.price.toFixed(2)}</h2>
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

export default SideModal;
