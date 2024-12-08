import { useState } from "react";
import "./AddModal.css";
import Button from "./Button";

const AddMenuItemModal = ({ onCancel, onAdd }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [currentServings, setCurrentServings] = useState("");

  const handleAdd = () => {
    if (!itemName || !itemPrice || !itemCategory) {
      alert("Please fill in all the required fields (name, price, category).");
      return;
    }

    const priceValue = parseFloat(itemPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const servingsValue = parseInt(currentServings, 10) || 0; // Default to 0 if empty

    // Call the parent function to add the item
    onAdd(itemName, priceValue, itemCategory, servingsValue);
  };

  return (
    <div className="modal-add">
      <div className="modal-content-add">
        <h2>Add Menu Item</h2>
        <form className="modal-form-add">
          <input
            className="input-add"
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className="input-add"
            type="number"
            placeholder="Item Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <input
            className="input-add"
            type="text"
            placeholder="Item Category"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
          />
          <input
            className="input-add"
            type="number"
            placeholder="Current Servings (optional)"
            value={currentServings}
            onChange={(e) => setCurrentServings(e.target.value)}
          />
        </form>
        <div className="modal-actions-add">
          <Button text="Cancel" onClick={onCancel} />
          <Button text="Add" onClick={handleAdd} />
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemModal;