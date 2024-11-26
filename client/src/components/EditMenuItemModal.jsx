import { useState } from "react";
import "./EditModal.css"; 
import Button from "./Button";

const EditMenuItemModal = ({ onCancel, onEdit, menuItem }) => {
  const [itemName, setItemName] = useState(menuItem.item_name);
  const [itemPrice, setItemPrice] = useState(menuItem.item_price);
  const [itemCategory, setItemCategory] = useState(menuItem.item_category);
  const [currentServings, setCurrentServings] = useState(menuItem.current_servings);

  const handleEdit = () => {
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

    // Call the parent function to edit the item
    onEdit(itemName, priceValue, itemCategory, servingsValue);
  };

  return (
    <div className="modal-edit">
      <div className="modal-content-edit">
        <h2>Edit Menu Item</h2>
        <form className="modal-form-edit">
          <input
            className="input-edit"
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className="input-edit"
            type="number"
            placeholder="Item Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <input
            className="input-edit"
            type="text"
            placeholder="Item Category"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
          />
          <input
            className="input-edit"
            type="number"
            placeholder="Current Servings (optional)"
            value={currentServings}
            onChange={(e) => setCurrentServings(e.target.value)}
          />
        </form>
        <div className="modal-actions-edit">
          <Button text="Save Changes" onClick={handleEdit} />
          <Button text="Cancel" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemModal;