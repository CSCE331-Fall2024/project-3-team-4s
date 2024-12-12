import { useState } from "react";
import "./AddModal.css";
import Button from "./Button";

/**
 * @module Components
 */

/**
 * AddInventoryModal component that provides a form to add a new inventory item.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onCancel - Function to cancel the modal.
 * @param {Function} props.onAdd - Function to add the inventory item.
 * @returns {JSX.Element} The add inventory modal component.
 */
const AddInventoryModal = ({ onCancel, onAdd }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [minStock, setMinStock] = useState("");

  return (
    <div className="modal-add">
      <div className="modal-content-add">
        <h2>Add Inventory</h2>
        <form className="modal-form-add">
          <input
            className="input-add"
            type="text"
            placeholder="Item Name"
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className="input-add"
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <select
            className="input-add"
            id="unit"
            name="unit"
            onChange={(e) => setUnit(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select Unit
            </option>
            <option value="Tsp">Tsp</option>
            <option value="Tbsp">Tbsp</option>
            <option value="Oz">Oz</option>
            <option value="Lbs">Lbs</option>
            <option value="Cups">Cups</option>
            <option value="Pcs">Pcs</option>
          </select>
          <input
            className="input-add"
            type="number"
            placeholder="Minimum Stock"
            onChange={(e) => setMinStock(e.target.value)}
          />
        </form>

        <div className="modal-actions-add">
          <Button text={"Cancel"} onClick={onCancel} />
          <Button
            text={"Add"}
            onClick={() => onAdd(itemName, price, unit, minStock)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddInventoryModal;
