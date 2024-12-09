import { useState } from "react";
import "./EditModal.css";
import Button from "./Button";

const EditMenuItemModal = ({ onCancel, onEdit, menuItem }) => {
  const [itemName, setItemName] = useState(menuItem.item_name);
  const [itemPrice, setItemPrice] = useState(menuItem.item_price);
  const [itemCategory, setItemCategory] = useState(menuItem.item_category);

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

          <select
            className="input-edit"
            name="category"
            onChange={(e) => setItemCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Meal">Meal</option>
            <option value="Entree">Entree</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Side">Side</option>
            <option value="Drink">Drink</option>
            <option value="Refresher">Refresher</option>
            <option value="Bottle">Bottle</option>
            <option value="Sauces">Sauces</option>
          </select>
        </form>
        <div className="modal-actions-edit">
          <Button
            text="Save Changes"
            onClick={() => onEdit(itemName, itemPrice, itemCategory)}
          />
          <Button text="Cancel" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
