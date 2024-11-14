import axios from "axios";
import { useState, useEffect } from "react";
import "./Restock.css";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";

const Restock = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // const backendURL = "http://localhost:3000";
  const [minStockInventory, setMinStockInventory] = useState([]);
  const [order, setOrder] = useState([]);

  // Fetch all min stock inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${backendURL}/inventory/get-min-stock`);
        setMinStockInventory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInventory();
  }, []);

  // Add item to order cart
  const addToOrder = (item) => {
    setOrder((order) => [...order, item]);
  };

  return (
    <div className="restock-container">
      <PageHeader pageTitle="Restock Inventory" />

      <div className="table-outer-container">
        <div className="table-inner-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Inventory Item</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {minStockInventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingredient_id}</td>
                  <td>{item.ingredient_name}</td>
                  <td>{item.current_stock}</td>
                  <td>{item.min_stock}</td>
                  <td className="icons-container">
                    <Icon src="/add-cart-icon.svg" alt="add to cart icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Restock;
