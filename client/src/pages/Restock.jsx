import axios from "axios";
import { useState, useEffect } from "react";
import "./Restock.css";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import Button from "../components/Button";

const Restock = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // const backendURL = "http://localhost:3000";
  
  const [minStockInventory, setMinStockInventory] = useState([]);
  const [nonMinStockInventory, setNonMinStockInventory] = useState([]);
  const [order, setOrder] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderTotal, setOrderTotal] = useState(0);
  const [selectedItemID, setSelectedItemID] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Fetch all min stock and non min stock inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${backendURL}/inventory/get-min-stock`);
        const res2 = await axios.get(
          `${backendURL}/inventory/get-non-min-stock`
        );

        setMinStockInventory(res.data);
        setNonMinStockInventory(res2.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInventory();
  }, []);

  // Handle quantity input change
  const handleQuantityChange = (id, quantity) => {
    setQuantities((quantities) => ({ ...quantities, [id]: quantity }));
    console.log(quantities);
  };

  // Add item to order cart
  const addToOrder = (id, name, price) => {
    if (!id || !name || !price) {
      alert("Please select an item to add to your order.");
      return;
    }

    const quantity = quantities[id];

    // Validate quantity
    if (!quantity || quantity <= 0 || quantity === "e" || quantity === "E") {
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

    // Reset quantity for the item
    setQuantities((quantities) => ({ ...quantities, [id]: "" }));
  };

  const clearOrder = () => {
    setOrder([]);
    setOrderTotal(0);
    setQuantities({});
  };

  const submitOrder = async () => {
    if (order.length === 0) {
      alert("Please add items to your order.");
      return;
    }

    try {
      const res = await axios.put(
        `${backendURL}/inventory/restock-inventory`,
        order
      );

      // Display response message
      alert(res.data.message);

      clearOrder();

      // Refetch inventory
      const res2 = await axios.get(`${backendURL}/inventory/get-min-stock`);
      const res3 = await axios.get(`${backendURL}/inventory/get-non-min-stock`);

      setMinStockInventory(res2.data);
      setNonMinStockInventory(res3.data);
    } catch (err) {
      console.error(err);
    }
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

              <tr>
                <td colSpan="6">
                  <div className="order-details">
                    <h3>Add Stocked Item</h3>

                    <select
                      defaultValue=""
                      id="item"
                      name="item"
                      onChange={(e) => {
                        // Get selected item details
                        const selectedID = e.target.value;
                        const selectedItem = nonMinStockInventory.find(
                          (item) => item.ingredient_id === Number(selectedID)
                        );

                        // Set selected item details
                        setSelectedItemID(selectedID);
                        setSelectedItem(selectedItem.ingredient_name);
                        setSelectedPrice(selectedItem.price);
                      }}
                    >
                      <option value="" disabled>
                        Select Item
                      </option>
                      {nonMinStockInventory.map((item) => (
                        <option
                          key={item.ingredient_id}
                          value={item.ingredient_id}
                        >
                          {item.ingredient_name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantities[selectedItemID] || ""}
                      onChange={(e) =>
                        handleQuantityChange(
                          selectedItemID,
                          Number(e.target.value)
                        )
                      }
                    />

                    <p>
                      Price: $
                      {isNaN(selectedPrice * quantities[selectedItemID])
                        ? "0.00"
                        : (selectedPrice * quantities[selectedItemID]).toFixed(
                            2
                          )}
                    </p>

                    <Button
                      text="Add to Order"
                      onClick={() =>
                        addToOrder(selectedItemID, selectedItem, selectedPrice)
                      }
                    ></Button>
                  </div>
                </td>
              </tr>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {order.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
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
                    <td>
                      <Icon
                        src="/delete-icon.svg"
                        alt="delete icon"
                        onClick={() => {
                          // Remove item from order
                          setOrderTotal(orderTotal - item.total_price);
                          setOrder(
                            order.filter((orderItem) => orderItem !== item)
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}

              <tr>
                <td colSpan="5">
                  <div className="order-details">
                    Order Total: ${orderTotal.toFixed(2)}
                    <div className="restock-buttons">
                      <Button
                        text="Submit Order"
                        onClick={submitOrder}
                      ></Button>
                      <Button text="Clear Order" onClick={clearOrder}></Button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Restock;
