import axios from "axios";
import { useState, useEffect } from "react";
import "./Restock.css";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import Button from "../components/Button";

const Restock = () => {
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:3000";
  const [minStockInventory, setMinStockInventory] = useState([]);
  const [order, setOrder] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderTotal, setOrderTotal] = useState(0);

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

  // Handle quantity input change
  const handleQuantityChange = (id, quantity) => {
    setQuantities((quantities) => ({ ...quantities, [id]: quantity }));
  };

  // Add item to order cart
  const addToOrder = (id, name, price) => {
    const quantity = quantities[id];

    // Validate quantity
    if (!quantity || quantity <= 0 || quantity.toLowerCase() === "e") {
      alert("Please enter a valid quantity.");
      return;
    }

    const item = {
      ingredient_id: id,
      ingredient_name: name,
      quantity: quantity,
      total_price: price * quantity,
    };

    // Check if item is already in order
    if (order.some((orderItem) => orderItem.ingredient_id === id)) {
      alert("Item is already added to your order.");
      return;
    }

    setOrder((order) => [...order, item]);
    setOrderTotal(orderTotal + item.total_price);
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
                <th>Quantity</th>
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
                  <td>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantities[item.ingredient_id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(item.ingredient_id, e.target.value)
                      }
                    />
                  </td>
                  <td className="icons-container">
                    <Icon
                      src="/add-cart-icon.svg"
                      alt="add to cart icon"
                      onClick={() =>
                        addToOrder(
                          item.ingredient_id,
                          item.ingredient_name,
                          item.price
                        )
                      }
                    />
                  </td>
                </tr>
              ))}

              <td colSpan="6">
                <div className="order-details">
                  <Button text="Add Stocked Item"></Button>
                </div>
              </td>
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-outer-container">
        <div className="table-inner-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Inventory Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No items in order
                  </td>
                </tr>
              ) : (
                order.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ingredient_id}</td>
                    <td>{item.ingredient_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.total_price.toFixed(2)}</td>
                  </tr>
                ))
              )}

              <td colSpan="4">
                <div className="order-details">
                  Order Total: ${orderTotal.toFixed(2)}
                  <Button text="Submit Order"></Button>
                </div>
              </td>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Restock;
