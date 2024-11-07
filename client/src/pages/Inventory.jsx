import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Inventory.css";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import Button from "../components/Button";

const Inventory = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);

  // Fetch all inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${backendURL}/inventory/get-inventory`);

        console.log(res.data);
        setInventory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInventory();
  }, []);

  // Button handlers
  const addInventoryItem = async () => {};

  const editInventoryItem = async () => {};

  const deleteInventoryItem = async () => {};

  return (
    <div className="inventory-container">
      <PageHeader pageTitle="Inventory" />

      <div className="table-outer-container">
        <div className="table-inner-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Inventory Item</th>
                <th>Current Stock</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Minimum Stock</th>
                <th>Options</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingredient_id}</td>
                  <td>{item.ingredient_name}</td>
                  <td>{item.current_stock}</td>
                  <td>{item.price}</td>
                  <td>{item.unit}</td>
                  <td>{item.min_stock}</td>
                  <td className="icons-container">
                    <Icon src="src/assets/edit-icon.svg" alt="edit icon" />
                    <Icon src="src/assets/delete-icon.svg" alt="delete icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="inventory-buttons-container">
        <Button text={"+"} />
        <Button text={"Restock"} onClick={() => navigate("/restock")} />
      </div>
    </div>
  );
};

export default Inventory;
