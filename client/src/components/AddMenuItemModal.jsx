import { useState } from "react";
import "./AddModal.css";
import Button from "./Button";

/**
 * @module Components
 */

/**
 * AddMenuItemModal component that provides a form to add a new menu item.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onCancel - Function to cancel the modal.
 * @param {Function} props.onAdd - Function to add the menu item.
 * @returns {JSX.Element} The add menu item modal component.
 */
const AddMenuItemModal = ({ onCancel, onAdd }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");

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
            placeholder="Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />

          <select
            className="input-add"
            name="category"
            onChange={(e) => setItemCategory(e.target.value)}
            defaultValue=""
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
        <div className="modal-actions-add">
          <Button text="Cancel" onClick={onCancel} />
          <Button
            text="Add"
            onClick={() => onAdd(itemName, itemPrice, itemCategory)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
