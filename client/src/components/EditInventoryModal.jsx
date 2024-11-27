import { useState } from "react";
import "./EditModal.css";
import Button from "./Button";

const EditInventoryModal = ({ onCancel, onEdit, inventoryItem }) => {
  console.log(inventoryItem);
  const [itemName, setItemName] = useState(inventoryItem.ingredient_name);
  const [price, setPrice] = useState(inventoryItem.price);
  const [unit, setUnit] = useState(inventoryItem.unit);
  const [minStock, setMinStock] = useState(inventoryItem.min_stock);

  return (
    <div className="modal-edit">
      <div className="modal-content-edit">
        <h2>Edit Inventory</h2>
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
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select
            className="input-edit"
            id="unit"
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
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
            className="input-edit"
            type="number"
            placeholder="Minimum Stock"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
          />
        </form>

        <div className="modal-actions-edit">
          <Button text={"Cancel"} onClick={onCancel} />
          <Button
            text={"Update"}
            onClick={() => onEdit(itemName, price, unit, minStock)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal;
