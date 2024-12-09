// CashierHome.jsx
import React, { useEffect, useState } from "react";
import "./CashierHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CashierHome = () => {
  const navigate = useNavigate(); // Navigate to homepage
  // const backendURL = "http://localhost:3000";
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // State Variables
  const [activeTab, setActiveTab] = useState("Orders");
  const [inputValue, setInputValue] = useState("");
  const [currentOrder, setCurrentOrder] = useState([]);
  const [entrees, setEntrees] = useState([]);
  const [sides, setSides] = useState([]);
  const [appetizers, setAppetizers] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [numEntrees, setNumEntrees] = useState(0);
  const [numSides, setNumSides] = useState(0);
  const [numAppetizers, setNumAppetizers] = useState(0);
  const [numDrinks, setNumDrinks] = useState(0);
  const [numSauces, setNumSauces] = useState(0);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [currentOrderCost, setCurrentOrderCost] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [currentOrderIDs, setCurrentOrderIDs] = useState([]);
  const [currentOrdersIDs, setCurrentOrdersIDs] = useState([]);
  const [halfSides, setHalfSides] = useState(0);
  const [paymentType, setPaymentType] = useState("");

  // State for special items
  const [refresherCost, setRefresherCost] = useState(0);
  const [bottleCost, setBottleCost] = useState(0);

  // Customer addition
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  // Customer sign in
  const [customerID, setCustomerID] = useState("");
  const [showSelectCustomerModal, setShowSelectCustomerModal] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [signedInCustomerFirst, setSignedInCustomerFirst] = useState(null);
  const [signedInCustomerLast, setSignedInCustomerLast] = useState(null);

  // New State Variables for Custom Item Modal
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");

  /*Helpers and Loaders */
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const [
          entreesRes,
          sidesRes,
          appetizersRes,
          drinksRes,
          saucesRes,
          mealTypesRes,
        ] = await Promise.all([
          axios.get(`${backendURL}/kiosk/entrees`),
          axios.get(`${backendURL}/kiosk/sides`),
          axios.get(`${backendURL}/kiosk/appetizers`),
          axios.get(`${backendURL}/kiosk/drinks`),
          axios.get(`${backendURL}/kiosk/sauces`),
          axios.get(`${backendURL}/kiosk/meal-types`),
        ]);

        setEntrees(entreesRes.data);
        setSides(sidesRes.data);
        setAppetizers(appetizersRes.data);
        setDrinks(drinksRes.data);
        setSauces(saucesRes.data);

        // Set dynamic prices
        const refresherItem = mealTypesRes.data.find(
          (item) => item.item_name.toLowerCase() === "refresher"
        );

        const bottleItem = mealTypesRes.data.find(
          (item) => item.item_name.toLowerCase() === "bottle"
        );

        if (refresherItem) {
          setRefresherCost(refresherItem.item_price);
        }
        if (bottleItem) {
          setBottleCost(bottleItem.item_price);
        }

        // Filter out certain meal types
        const filteredMealTypes = mealTypesRes.data.filter(
          (item) =>
            item.item_name.toLowerCase() !== "refresher" &&
            item.item_name.toLowerCase() !== "bottle"
        );

        setMealTypes(filteredMealTypes);
      } catch (err) {
        console.error("Error fetching food data:", err);
      }
    };

    fetchFood();
  }, [backendURL]);

  // Reset Item Counts
  const reset = () => {
    setNumEntrees(0);
    setNumSides(0);
    setNumAppetizers(0);
    setNumDrinks(0);
    setHalfSides(0);
    setNumSauces(0);
    setCurrentOrderCost([]);
  };

  // Reset All Orders
  const resetAll = () => {
    reset();
    console.log("Resetting all orders");
    setActiveTab("Orders");
    setCurrentOrder([]);
    setCurrentOrderIDs([]);
    setCurrentOrderCost([]);
    setCurrentOrders([]);
    setCurrentOrdersIDs([]);
  };

  // Different options e.g Bowl, Plate, etc.
  const openTab = (e, tabName) => {
    setCurrentOrder([]);
    setCurrentOrderIDs([]);
    setActiveTab(tabName.item_name);
    reset();

    switch (tabName.item_name) {
      case "Bowl":
        setNumEntrees(1);
        setNumSides(2);
        break;
      case "Plate":
        setNumEntrees(2);
        setNumSides(2);
        break;
      case "Bigger Plate":
        setNumEntrees(3);
        setNumSides(2);
        break;
      case "Entree":
        setNumEntrees(1);
        break;
      case "Side":
        setNumSides(2);
        break;
      case "Appetizer":
        setNumAppetizers(1);
        break;
      case "Drink":
        setNumDrinks(1);
        break;
      case "Sauces":
        setNumSauces(6);
        break;
      default:
        if (tabName.item_name.includes("Entree")) {
          setNumEntrees(1);
        } else if (tabName.item_name.includes("Side")) {
          setNumSides(2);
        }
        break;
    }

    // Store the full tabName as an item object if possible
    const initialItem = {
      item_name: tabName.item_name,
      item_price: tabName.item_price,
      menu_item_id: tabName.menu_item_id,
      item_category: tabName.item_category || "MealType", // fallback if no category
    };

    setCurrentOrder([initialItem]);
    setCurrentOrderIDs([tabName.menu_item_id]);
    setCurrentOrderCost([tabName.item_price]);
  };

  // Handle Food Item Click
  const handleFoodClick = (item) => {
    if (item.item_category === "Entree" && numEntrees > 0) {
      setNumEntrees(numEntrees - 1);
      setCurrentOrder([...currentOrder, item]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    } else if (item.item_category === "Side" && numSides > 0) {
      setNumSides(numSides - 1);
      if (numSides === 0) {
        setHalfSides(1);
      }
      setCurrentOrder([...currentOrder, item]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    } else if (item.item_category === "Appetizer" && numAppetizers > 0) {
      setNumAppetizers(numAppetizers - 1);
      setCurrentOrder([...currentOrder, item]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    } else if (
      (item.item_category === "Drink" ||
        item.item_category === "Refresher" ||
        item.item_category === "Bottle") &&
      numDrinks > 0
    ) {
      setNumDrinks(numDrinks - 1);
      // For drinks with dynamic pricing
      let priceToAdd = item.item_price;
      if (item.item_category === "Refresher") {
        priceToAdd = (
          parseFloat(refresherCost) + parseFloat(item.item_price)
        ).toFixed(2);
      } else if (item.item_category === "Bottle") {
        priceToAdd = (
          parseFloat(bottleCost) + parseFloat(item.item_price)
        ).toFixed(2);
      }
      const newItem = { ...item, item_price: priceToAdd };
      setCurrentOrder([...currentOrder, newItem]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, priceToAdd]);
    } else if (item.item_category === "Sauces" && numSauces > 0) {
      setNumSauces(numSauces - 1);
      setCurrentOrder([...currentOrder, item]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    }
  };

  // Handle Adding Custom Item
  const handleAddCustomItem = () => {
    const trimmedName = customItemName.trim();
    const trimmedPrice = customItemPrice.trim();

    if (!trimmedName) {
      alert("Please enter a valid item name.");
      return;
    }

    if (!trimmedPrice || isNaN(trimmedPrice)) {
      alert("Please enter a valid item price.");
      return;
    }

    const customMenuItemId = 999;
    const newCustomItem = {
      item_name: trimmedName,
      item_price: Number(trimmedPrice).toFixed(2),
      menu_item_id: customMenuItemId,
      item_category: "Custom",
    };

    setCurrentOrder([...currentOrder, newCustomItem]);
    setCurrentOrderIDs([...currentOrderIDs, newCustomItem.menu_item_id]);
    setCurrentOrderCost([...currentOrderCost, newCustomItem.item_price]);

    setCustomItemName("");
    setCustomItemPrice("");
    setShowCustomItemModal(false);

    alert("Custom item added successfully!");
    console.log("Custom item added:", newCustomItem);
  };

  // Calculate week_number based on first week starting 1/1/2024
  const getWeekNumber = () => {
    const baselineDate = new Date(2024, 0, 1); // Jan 1, 2024
    const currentDate = new Date();
    const diffInMs = currentDate - baselineDate;
    const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));
    const weekNumber = Math.floor(diffInDays / 7) + 1;
    return weekNumber;
  };

  // Checkout Functionality
  const checkout = async () => {
    console.log("Checkout clicked");
    console.log("Current Orders:", currentOrders);

    if (!paymentType) {
      alert("Please select a transaction type before checking out.");
      return;
    }

    if (currentOrders.length > 0) {
      const userConfirmed = window.confirm(
        "Are you sure you want to checkout?"
      );
      if (!userConfirmed) {
        console.log("User canceled checkout.");
        return;
      }

      try {
        let totalCost = currentOrders
          .reduce((sum, order) => {
            return sum + parseFloat(order.totalCost);
          }, 0)
          .toFixed(2);

        console.log("Total Cost Calculated:", totalCost);

        const weekNumber = getWeekNumber();
        console.log("Calculated week_number:", weekNumber);

        const transactionData = {
          total_cost: parseFloat(totalCost),
          transaction_time: new Date()
            .toISOString()
            .split("T")[1]
            .split(".")[0],
          transaction_date: new Date().toISOString().split("T")[0],
          transaction_type: paymentType,
          customer_id: customerID || "", // Get customer ID if signed in
          employee_id: localStorage.getItem("employeeID"), // Get employee ID from local storage
          week_number: weekNumber,
        };
        if (totalCost <= 0) {
          alert("Invalid Item Cost");
          return;
        }

        console.log("Transaction Data:", transactionData);

        const transactionResponse = await axios.post(
          `${backendURL}/cashier/post-transaction`,
          transactionData
        );

        const transactionId =
          transactionResponse.data.transaction.transaction_id;
        console.log("Transaction created with ID:", transactionId);

        // Step 3: Aggregate Items Across Orders using their quantities
        const itemQuantityMap = new Map();

        currentOrders.forEach((order, i) => {
          const orderItemIDs = currentOrdersIDs[i];
          const itemsInOrder = order.items;

          if (itemsInOrder.length !== orderItemIDs.length) {
            console.error(
              `Mismatch in items and IDs for order ${i + 1}:`,
              itemsInOrder,
              orderItemIDs
            );
            throw new Error(`Mismatch in items and IDs for order ${i + 1}`);
          }

          itemsInOrder.forEach((item, j) => {
            const menuItemId = orderItemIDs[j];
            if (!menuItemId) {
              console.error(`menuItemId is undefined for item "${item.name}"`);
              alert(
                `Error processing item "${item.name}": Menu item ID is undefined.`
              );
              throw new Error(
                `Checkout aborted due to error with item "${item.name}"`
              );
            }

            // Add item quantity
            itemQuantityMap.set(
              menuItemId,
              (itemQuantityMap.get(menuItemId) || 0) + item.quantity
            );
            console.log(
              `Added item to map: menu_item_id=${menuItemId}, quantity=${item.quantity}`
            );
          });
        });

        // Step 4: Insert Aggregated Items into Database
        for (const [menuItemId, itemQuantity] of itemQuantityMap.entries()) {
          try {
            await axios.post(`${backendURL}/cashier/post-transaction-menu`, {
              menu_item_id: menuItemId,
              transaction_id: transactionId,
              item_quantity: itemQuantity,
            });
            console.log(
              `Inserted into menu_item_transaction: menu_item_id=${menuItemId}, transaction_id=${transactionId}, item_quantity=${itemQuantity}`
            );

            await axios.put(`${backendURL}/cashier/put-menu`, {
              menu_item_id: menuItemId,
              item_quantity: itemQuantity,
            });
            console.log(`Updated menu_item: menu_item_id=${menuItemId}`);
          } catch (error) {
            console.error(
              `Error processing item with menu_item_id ${menuItemId}:`,
              error.response?.data?.message || error.message
            );
            alert(
              `Error processing item with menu_item_id "${menuItemId}": ${
                error.response?.data?.message || error.message
              }`
            );
            throw new Error(
              `Checkout aborted due to error with menu_item_id "${menuItemId}"`
            );
          }
        }

        // Add points if customer is logged in
        if (customerID) {
          console.log(
            "Adding points to customer:",
            customerID,
            totalCost * 100
          );
          const pointsResponse = await axios.put(
            `${backendURL}/cashier/update-customer-points`,
            {
              customer_id: customerID,
              reward_points: parseFloat((totalCost * 100).toFixed(2)),
            }
          );
          console.log("Points added to customer:", pointsResponse.data);
        }

        // Clear after successful checkout
        setCurrentOrders([]);
        setCurrentOrdersIDs([]);
        setCurrentOrderCost([]);
        reset();
        setCustomerID("");
        clearCustomer();
        setPaymentType("");
        alert("Checkout successful!");
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Checkout failed. Please try again.");
      }
    } else {
      alert("No items in the current order.");
    }
  };

  // Debug Function
  const debug = () => {
    console.log("Current Order:", currentOrder);
    console.log(
      "Appetizers:",
      numAppetizers,
      "Drinks:",
      numDrinks,
      "Entrees:",
      numEntrees,
      "Sides:",
      numSides
    );
    console.log("Current Orders:", currentOrders);
    console.log("Current Orders IDs:", currentOrdersIDs);
    console.log("Current Order Cost:", currentOrderCost);
  };

  // Remove Item from Orders
  const removeItem = (index) => {
    setCurrentOrders(currentOrders.filter((_, i) => i !== index));
    setCurrentOrdersIDs(currentOrdersIDs.filter((_, i) => i !== index));
  };

  // Confirm Order Entry
  const orderEntered = () => {
    if (
      numAppetizers === 0 &&
      numDrinks === 0 &&
      numEntrees === 0 &&
      (numSides === 0 || numSides === 1) &&
      currentOrder.length > 0
    ) {
      const totalCost = currentOrderCost
        .reduce((a, b) => Number(a) + Number(b), 0)
        .toFixed(2);

      // Count how many sides are in the current order
      const sidesCount = currentOrder.filter(
        (item) => item.item_category === "Side"
      ).length;
      console.log("Sides Count:", sidesCount);
      // Transform items with quantity
      const transformedItems = currentOrder.map((item) => {
        let quantity = 1;
        if (item.item_category === "Side" && sidesCount === 2) {
          quantity = 0.5;
          console.log("Half Side Detected:", item);
        }
        return {
          id: item.menu_item_id,
          name: item.item_name,
          category: item.item_category,
          price: item.item_price,
          quantity: quantity,
        };
      });

      const newOrder = {
        items: transformedItems,
        totalCost: totalCost,
      };

      setCurrentOrders([...currentOrders, newOrder]);
      setCurrentOrdersIDs([...currentOrdersIDs, currentOrderIDs]);
      setInputValue("");
      setCurrentOrder([]);
      setCurrentOrderIDs([]);
      setCurrentOrderCost([]);
      reset();
    } else {
      console.log("Please select the correct number of items");
      alert("Please select the correct number of items");
    }
  };

  // Navigate to Home
  const home_screen = () => {
    const userConfirmed = window.confirm("Are you sure you want to log out?");
    if (!userConfirmed) {
      console.log("User canceled");
      return;
    }
    localStorage.clear();
    navigate("/");
  };

  // Add Customer
  const handleAddCustomer = async () => {
    if (
      !customerFirstName ||
      !customerLastName ||
      !customerEmail ||
      !customerPhone
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(customerPhone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/cashier/add-customer`, {
        first_name: customerFirstName,
        last_name: customerLastName,
        email: customerEmail,
        phone: customerPhone,
      });

      if (response.data.success) {
        alert("Customer added successfully!");
        setCustomerFirstName("");
        setCustomerLastName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setShowCustomerModal(false);
      } else {
        alert("Failed to add customer.");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while adding the customer."
      );
    }
  };

  // Select Customer
  const handleSelectCustomer = async () => {
    if (!searchPhone) {
      alert("Please enter a phone number.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(searchPhone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await axios.get(
        `${backendURL}/cashier/get-customer-by-phone`,
        {
          params: { phone: searchPhone },
        }
      );

      if (response.data.success && response.data.customer) {
        const { customer_id, first_name, last_name } = response.data.customer;
        setCustomerID(customer_id);
        setSignedInCustomerFirst(first_name);
        setSignedInCustomerLast(last_name);
        alert(
          `Customer Selected: ${first_name} ${last_name} (ID: ${customer_id})`
        );
        setShowSelectCustomerModal(false);
        setSearchPhone("");
      } else {
        alert("No customer found with the provided phone number.");
      }
    } catch (error) {
      console.error("Error selecting customer:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while selecting the customer."
      );
    }
  };

  const clearCustomer = () => {
    setCustomerID("");
    setSignedInCustomerFirst(null);
    setSignedInCustomerLast(null);
    alert("Customer cleared.");
  };

  const restockServings = async () => {
    try {
      const response = await axios.put(
        `${backendURL}/cashier/restock-servings`
      );

      alert(response.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const tabs = mealTypes;

  return (
    <div className="overall">
      <div className="cashierbackground">
        <div className="menu">
          <div className="tabs">
            <div className="tab">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className="tablinks"
                  onClick={(e) => openTab(e, tab)}
                >
                  {tab.item_name}
                </button>
              ))}
            </div>
            <div className="menuItems">
              <div className="menu-section">
                <h3>Entrees</h3>
                <div className="menu-item-list">
                  {entrees.length > 0 ? (
                    entrees.map((entree) => (
                      <button
                        key={entree.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(entree)}
                        disabled={numEntrees === 0}
                      >
                        {entree.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading entrees...</p>
                  )}
                </div>
              </div>

              <div className="menu-section">
                <h3>Sides</h3>
                <div className="menu-item-list">
                  {sides.length > 0 ? (
                    sides.map((side) => (
                      <button
                        key={side.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(side)}
                        disabled={numSides === 0}
                      >
                        {side.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading sides...</p>
                  )}
                </div>
              </div>

              <div className="menu-section">
                <h3>Appetizers</h3>
                <div className="menu-item-list">
                  {appetizers.length > 0 ? (
                    appetizers.map((appetizer) => (
                      <button
                        key={appetizer.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(appetizer)}
                        disabled={numAppetizers === 0}
                      >
                        {appetizer.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading appetizers...</p>
                  )}
                </div>
              </div>

              <div className="menu-section">
                <h3>Drinks</h3>
                <div className="menu-item-list">
                  {drinks.length > 0 ? (
                    drinks.map((drink) => (
                      <button
                        key={drink.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(drink)}
                        disabled={numDrinks === 0}
                      >
                        {drink.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading drinks...</p>
                  )}
                </div>
              </div>

              <div className="menu-section">
                <h3>Sauces</h3>
                <div className="menu-item-list">
                  {sauces.length > 0 ? (
                    sauces.map((sauce) => (
                      <button
                        key={sauce.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(sauce)}
                        disabled={numSauces === 0}
                      >
                        {sauce.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading sauces...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order">
          <div className="orderItems">
            <p>
              Current Customer: {signedInCustomerFirst} {signedInCustomerLast}
            </p>
            <p>
              Current Order: {currentOrder.map((i) => i.item_name).join(", ")}
            </p>
          </div>
          <ul className="current-orders-list">
            {currentOrders.map((order, index) => (
              <li key={index} className="order-item">
                <span className="order-text">
                  {order.items.map((itm) => itm.name).join(", ")} : $
                  {order.totalCost}
                </span>
                <button
                  className="remove-button"
                  onClick={() => removeItem(index)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className="orderCost">
            <h3>
              Total Cost: $
              {currentOrders
                .reduce((sum, order) => sum + parseFloat(order.totalCost), 0)
                .toFixed(2)}
            </h3>
          </div>

          {/* Payment Type Selection */}
          <div className="paymentType">
            <h3>
              Transaction Type <span style={{ color: "red" }}>*</span>
            </h3>
            <div className="transaction-options">
              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="Credit/Debit"
                  checked={paymentType === "Credit/Debit"}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                Credit/Debit
              </label>
              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="Gift Card"
                  checked={paymentType === "Gift Card"}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                Gift Card
              </label>
            </div>
          </div>

          <div className="orderButtons">
            <button className="Confirm" onClick={orderEntered}>
              Add to Order
            </button>
            <button
              className="enter_item"
              onClick={() => setShowCustomItemModal(!showCustomItemModal)}
            >
              Enter Custom Item/Discount
            </button>
            <button className="clear_order" onClick={resetAll}>
              Clear Current Order
            </button>
            <button
              className="checkoutCHECK"
              onClick={checkout}
              title={
                !paymentType
                  ? "Select a transaction type to proceed"
                  : "Checkout"
              }
            >
              Checkout
            </button>
            <button onClick={restockServings}>Restock Servings</button>
          </div>

          <div className="bottom-buttons">
            <button onClick={() => setShowCustomerModal(!showCustomerModal)}>
              Add Customer
            </button>
            <button
              onClick={() =>
                setShowSelectCustomerModal(!showSelectCustomerModal)
              }
            >
              Select Customer
            </button>
            <button onClick={clearCustomer}>Clear Customer</button>
            <button onClick={home_screen}>Return to Home</button>
          </div>
        </div>
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCustomerModal(false)}>
              &times;
            </span>
            <h2>Add New Customer</h2>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                placeholder="Enter first name"
                maxLength="50"
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                placeholder="Enter last name"
                maxLength="50"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter email"
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
              />
            </div>
            <button className="confirm-button" onClick={handleAddCustomer}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {showSelectCustomerModal && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setShowSelectCustomerModal(false);
                setSearchPhone("");
              }}
            >
              &times;
            </span>
            <h2>Select Customer by Phone Number</h2>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
              />
            </div>
            <button className="confirm-button" onClick={handleSelectCustomer}>
              Select
            </button>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      {showCustomItemModal && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setShowCustomItemModal(false);
                setCustomItemName("");
                setCustomItemPrice("");
              }}
            >
              &times;
            </span>
            <h2>Add Custom Item</h2>
            <div className="form-group">
              <label>Item Name:</label>
              <input
                type="text"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="Enter item name"
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <label>Item Price ($):</label>
              <input
                type="number"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                placeholder="Enter item price(or negative for discount)"
                step="0.01"
                className="wide-input"
              />
            </div>

            <button className="confirm-button" onClick={handleAddCustomItem}>
              Add Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierHome;
