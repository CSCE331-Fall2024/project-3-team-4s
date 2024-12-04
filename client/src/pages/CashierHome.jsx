// CashierHome.jsx
import React, { useEffect, useState } from "react";
import "./styles/CashierHome.css";
import axios from "axios";
import "./Employees.css";
import { useNavigate } from "react-router-dom";

const CashierHome = () => {
  const navigate = useNavigate(); // Navigate to homepage
  const backendURL = "http://localhost:3000";

  // State Variables
  const [activeTab, setActiveTab] = useState("Orders");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // Removed keyboardVisible and numPadVisible
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
  const [cost, setCost] = useState("");
  const [currentOrderCost, setCurrentOrderCost] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [currentOrderIDs, setCurrentOrderIDs] = useState([]);
  const [currentOrdersIDs, setCurrentOrdersIDs] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
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

  // Fetch Weather Data
  const fetchWeather = async () => {
    try {
      const response = await axios.get(`${backendURL}/weather/weather`, {
        params: { city: "College Station", units: "imperial" },
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Preload All Food Data
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const [entreesRes, sidesRes, appetizersRes, drinksRes, saucesRes, mealTypesRes] = await Promise.all([
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

        // Extract "refresher" and "bottle" items
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

        // Filter out "refresher" and "bottle" from meal types
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
    fetchWeather();
  }, [backendURL]);

  // Handle Number Pad Change
  const handleNumPadChange = (event) => {
    setCost(event.target.value);
    console.log("Cost input changed:", event.target.value);
  };

  // Handle Custom Item Input Change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

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

  useEffect(() => {
    console.log("Current Order after reset:", currentOrder);
  }, [currentOrder]);

  // Open and Handle Tab Clicks
  const openTab = (e, tabName) => {
    console.log("Tab name:", tabName);
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
      default:
        if (tabName.item_name.includes("Entree")) {
          setNumEntrees(1);
        } else if (tabName.item_name.includes("Side")) {
          setNumSides(2);
        } else if (tabName.item_name === "Appetizer") {
          setNumAppetizers(1);
        } else if (tabName.item_name.includes("Drink")) {
          setNumDrinks(1);
        } else if (tabName.item_name.includes("Sauces")) {
          setNumSauces(6);
        }
        break;
    }

    handleOrderTypeClick(tabName);
  };

  // Handle Order Type Click
  const handleOrderTypeClick = (item) => {
    setCurrentOrder([...currentOrder, item.item_name]);
    setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
    setCurrentOrderCost([...currentOrderCost, item.item_price]);
  };

  // Handle Food Item Click
  const handleFoodClick = (item) => {
    console.log("handle food click", item.item_category, numSauces);
    if (item.item_category === "Entree" && numEntrees > 0) {
      setNumEntrees(numEntrees - 1);
      setCurrentOrder([...currentOrder, item.item_name]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    } else if (item.item_category === "Side" && numSides > 0) {
      setNumSides(numSides - 1);
      if (numSides === 0) {
        setHalfSides(1);
      }
      setCurrentOrder([...currentOrder, item.item_name]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    } else if (item.item_category === "Appetizer" && numAppetizers > 0) {
      setNumAppetizers(numAppetizers - 1);
      setCurrentOrder([...currentOrder, item.item_name]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    } else if (
      (item.item_category === "Drink" ||
        item.item_category === "Refresher" ||
        item.item_category === "Bottle") &&
      numDrinks > 0
    ) {
      setNumDrinks(numDrinks - 1);
      setCurrentOrder([...currentOrder, item.item_name]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);

      if (item.item_category === "Drink") {
        setCurrentOrderCost([...currentOrderCost, item.item_price]);
      } else if (item.item_category === "Refresher") {
        const totalRefresherCost = refresherCost + item.item_price;
        setCurrentOrderCost([
          ...currentOrderCost,
          totalRefresherCost.toFixed(2),
        ]);
        console.log("Refresher cost:", totalRefresherCost);
      } else if (item.item_category === "Bottle") {
        const totalBottleCost = bottleCost + item.item_price;
        setCurrentOrderCost([
          ...currentOrderCost,
          totalBottleCost.toFixed(2),
        ]);
      }
    } else if (item.item_category === "Sauces" && numSauces > 0) {
      console.log("Sauces", item.item_name);
      setNumSauces(numSauces - 1);
      setCurrentOrder([...currentOrder, item.item_name]);
      setCurrentOrderIDs([...currentOrderIDs, item.menu_item_id]);
      setCurrentOrderCost([...currentOrderCost, item.item_price]);
    }
  };

  // Navigate to Home Screen
  const home_screen = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to log out?"
    );
    if (!userConfirmed) {
      console.log("User canceled");
      return; // Exit if user cancels
    }
    navigate("/");
  };

  // Debug Function
  const debug = () => {
    console.log("Current Order:", currentOrder);
    console.log("Weather Data:", weatherData);
    console.log(
      "Number of Items - Appetizers:",
      numAppetizers,
      "Drinks:",
      numDrinks,
      "Entrees:",
      numEntrees,
      "Sides:",
      numSides
    );
    console.log(
      "NumPad Visible & Required Items Selected:",
      false && // numPadVisible is removed
        numAppetizers > 0 &&
        numDrinks > 0 &&
        numEntrees > 0 &&
        numSauces > 0 &&
        numSides > 1
    );
    console.log("Current Orders:", currentOrders);
    console.log("Current Orders IDs:", currentOrdersIDs);
    console.log("Current Order Cost:", currentOrderCost);
  };

  // Remove Item from Orders
  const removeItem = (index) => {
    setCurrentOrders(currentOrders.filter((_, i) => i !== index));
    setCurrentOrdersIDs(currentOrdersIDs.filter((_, i) => i !== index));
    // Removed: setCurrentOrderCost(currentOrderCost.filter((_, i) => i !== index));
    // currentOrderCost pertains to the current order being built, not all orders
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
      // Calculate the total cost
      const totalCost = currentOrderCost
        .reduce((a, b) => Number(a) + Number(b), 0)
        .toFixed(2);

      // Create a new order object
      const newOrder = {
        items: [...currentOrder],
        totalCost: totalCost
      };

      // Update the current orders with the new order
      setCurrentOrders([...currentOrders, newOrder]);

      // Update the current order IDs
      setCurrentOrdersIDs([...currentOrdersIDs, currentOrderIDs]);

      // Log for debugging
      console.log("Current Order Cost:", currentOrderCost);
      console.log("Current Orders:", [...currentOrders, newOrder]);

      // Clear the input fields and current order states
      setInputValue(""); // Clear input field
      setCurrentOrder([]); // Clear current order
      setCurrentOrderIDs([]);
      setCurrentOrderCost([]);
      reset();
    } else {
      console.log("Please select the correct number of items");
      alert("Please select the correct number of items"); // Optionally alert the user
    }
  };

  // Customer Functionality
  const handleAddCustomer = async () => {
    // Basic validation to ensure all fields are filled
    if (!customerFirstName || !customerLastName || !customerEmail || !customerPhone) {
      alert("Please fill in all fields.");
      return;
    }

    // Optional: Validate phone number format (e.g., 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(customerPhone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      console.log("getting here");
      console.log(customerFirstName, customerLastName, customerEmail, customerPhone);
      const response = await axios.post(`${backendURL}/cashier/add-customer`, {
        first_name: customerFirstName,
        last_name: customerLastName,
        email: customerEmail,
        phone: customerPhone, 
      });

      if (response.data.success) {
        alert("Customer added successfully!");
        // Reset the form fields
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

  // Handle Select Customer by Phone
  const handleSelectCustomer = async () => {
    // Basic validation to ensure the phone number is entered
    if (!searchPhone) {
      alert("Please enter a phone number.");
      return;
    }
  
    // Validate phone number format (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(searchPhone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
  
    try {
      console.log("Searching for customer with phone:", searchPhone);
  
      // Send a GET request to the backend to find the customer by phone
      const response = await axios.get(`${backendURL}/cashier/get-customer-by-phone`, {
        params: { phone: searchPhone },
      });
  
      if (response.data.success && response.data.customer) {
        const { customer_id, first_name, last_name, email, phone } = response.data.customer;
        setCustomerID(customer_id);
        setSignedInCustomerFirst(first_name);
        setSignedInCustomerLast(last_name);
        alert(`Customer Selected: ${first_name} ${last_name} (ID: ${customer_id})`);
        console.log("Customer selected:", response.data.customer);
  
        // Close the modal and reset the search input
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

  // Handle Adding Custom Item
  const handleAddCustomItem = () => {
    // Trim inputs to remove unnecessary whitespace
    const trimmedName = customItemName.trim();
    const trimmedPrice = customItemPrice.trim();

    // Validate inputs
    if (!trimmedName) {
      alert("Please enter a valid item name.");
      return;
    }

    if (!trimmedPrice || isNaN(trimmedPrice) || Number(trimmedPrice) < 0) {
      alert("Please enter a valid item price.");
      return;
    }

    // Create a unique ID for the custom item (you can adjust this as needed)
    const customMenuItemId = 999; 

    // Create the custom item object
    const newCustomItem = {
      item_name: trimmedName,
      item_price: Number(trimmedPrice).toFixed(2),
      menu_item_id: customMenuItemId,
      item_category: "Custom",
    };

    // Add the custom item to the current order
    setCurrentOrder([...currentOrder, newCustomItem.item_name]);
    setCurrentOrderIDs([...currentOrderIDs, newCustomItem.menu_item_id]);
    setCurrentOrderCost([...currentOrderCost, newCustomItem.item_price]);

    // Reset and close the modal
    setCustomItemName("");
    setCustomItemPrice("");
    setShowCustomItemModal(false);

    // Notify the user
    alert("Custom item added successfully!");
    console.log("Custom item added:", newCustomItem);
  };

  // Checkout Functionality
  const checkout = async () => {
    console.log("Checkout clicked");
    console.log("Current Orders:", currentOrders);

    // Validate that a payment type is selected
    if (!paymentType) {
      alert("Please select a transaction type before checking out.");
      return;
    }

    if (currentOrders.length > 0) {
      console.log("Processing checkout...");

      const userConfirmed = window.confirm(
        "Are you sure you want to checkout?"
      );
      if (!userConfirmed) {
        console.log("User canceled checkout.");
        return; // Exit if user cancels
      }

      try {
        // Step 1: Calculate Total Cost
        let totalCost = currentOrders.reduce((sum, order) => {
          return sum + parseFloat(order.totalCost);
        }, 0).toFixed(2);

        console.log("Total Cost Calculated:", totalCost);

        // Step 2: Create a New Transaction
        const transactionData = {
          total_cost: parseFloat(totalCost),
          transaction_time: new Date()
            .toISOString()
            .split("T")[1]
            .split(".")[0],
          transaction_date: new Date().toISOString().split("T")[0],
          transaction_type: paymentType, // Use the selected payment type
          customer_id: customerID || null,
          employee_id: 1, // Hardcoded for now
          week_number: null,
        };

        console.log("Transaction Data:", transactionData);

        const transactionResponse = await axios.post(
          `${backendURL}/cashier/post-transaction`,
          transactionData
        );

        // Extract the generated transaction_id
        const transactionId =
          transactionResponse.data.transaction.transaction_id;
        console.log("Transaction created with ID:", transactionId);

        // Step 3: Aggregate Items Across Orders
        const itemQuantityMap = new Map();

        currentOrders.forEach((order, i) => {
          const orderItemIDs = currentOrdersIDs[i];
          const itemsInOrder = order.items; // Array of item names
          const itemIDsInOrder = orderItemIDs; // Array of item IDs

          if (itemsInOrder.length !== itemIDsInOrder.length) {
            console.error(
              `Mismatch in items and IDs for order ${i + 1}:`,
              itemsInOrder,
              itemIDsInOrder
            );
            throw new Error(
              `Mismatch in items and IDs for order ${i + 1}`
            );
          }

          itemsInOrder.forEach((itemName, j) => {
            const menuItemId = itemIDsInOrder[j];
            if (!menuItemId) {
              console.error(
                `menuItemId is undefined for item "${itemName}"`
              );
              alert(
                `Error processing item "${itemName}": Menu item ID is undefined.`
              );
              throw new Error(
                `Checkout aborted due to error with item "${itemName}"`
              );
            }

            itemQuantityMap.set(
              menuItemId,
              (itemQuantityMap.get(menuItemId) || 0) + 1
            );
          });
        });

        // Step 4: Insert Aggregated Items into Database
        for (const [menuItemId, itemQuantity] of itemQuantityMap.entries()) {
          try {
            // Step 4a: Insert into menu_item_transaction
            await axios.post(`${backendURL}/cashier/post-transaction-menu`, {
              menu_item_id: menuItemId,
              transaction_id: transactionId,
              item_quantity: itemQuantity,
            });

            console.log(
              `Inserted into menu_item_transaction: menu_item_id=${menuItemId}, transaction_id=${transactionId}, item_quantity=${itemQuantity}`
            );

            // Step 4b: Update menu_item Table
            await axios.put(`${backendURL}/cashier/put-menu`, {
              menu_item_id: menuItemId,
              item_quantity: itemQuantity, // Ensure backend handles this correctly
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
          console.log("Adding points to customer:", customerID, totalCost * 100);
          const pointsResponse = await axios.put(`${backendURL}/cashier/update-customer-points`, {
            customer_id: customerID,
            reward_points: parseFloat((totalCost * 100).toFixed(2)),
          });
          console.log("Points added to customer:", pointsResponse.data);
        }

        // Step 5: Clear Current Orders and Reset Payment Type
        setCurrentOrders([]);
        setCurrentOrdersIDs([]);
        setCurrentOrderCost([]);
        reset();
        setCustomerID(""); // Reset customer ID
        clearCustomer(); // Clear signed-in customer
        setPaymentType(""); // Reset payment type

        alert("Checkout successful!");

      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Checkout failed. Please try again.");
      }
    } else {
      alert("No items in the current order.");
    }
  };

  // Define Tabs
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
              {/* Entrees Section */}
              <div className="menu-section">
                <h3>{"Entrees"}</h3>
                <div className="menu-item-list">
                  {entrees.length > 0 ? (
                    entrees.map((entree) => (
                      <button
                        key={entree.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(entree)}
                        disabled={
                          numEntrees === 0 ||
                          (false && // numPadVisible is removed
                            !(
                              numAppetizers > 0 &&
                              numDrinks > 0 &&
                              numEntrees > 0 &&
                              numSauces > 0 &&
                              numSides > 1
                            ))
                        }
                      >
                        {entree.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading entrees...</p>
                  )}
                </div>
              </div>

              {/* Sides Section */}
              <div className="menu-section">
                <h3>{"Sides"}</h3>
                <div className="menu-item-list">
                  {sides.length > 0 ? (
                    sides.map((side) => (
                      <button
                        key={side.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(side)}
                        disabled={
                          numSides === 0 ||
                          (false && // numPadVisible is removed
                            !(
                              numAppetizers > 0 &&
                              numDrinks > 0 &&
                              numEntrees > 0 &&
                              numSauces > 0 &&
                              numSides > 1
                            ))
                        }
                      >
                        {side.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading sides...</p>
                  )}
                </div>
              </div>

              {/* Appetizers Section */}
              <div className="menu-section">
                <h3>{"Appetizers"}</h3>
                <div className="menu-item-list">
                  {appetizers.length > 0 ? (
                    appetizers.map((appetizer) => (
                      <button
                        key={appetizer.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(appetizer)}
                        disabled={
                          numAppetizers === 0 ||
                          (false && // numPadVisible is removed
                            !(
                              numAppetizers > 0 &&
                              numDrinks > 0 &&
                              numEntrees > 0 &&
                              numSauces > 0 &&
                              numSides > 1
                            ))
                        }
                      >
                        {appetizer.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading appetizers...</p>
                  )}
                </div>
              </div>

              {/* Drinks Section */}
              <div className="menu-section">
                <h3>{"Drinks"}</h3>
                <div className="menu-item-list">
                  {drinks.length > 0 ? (
                    drinks.map((drink) => (
                      <button
                        key={drink.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(drink)}
                        disabled={
                          numDrinks === 0 ||
                          (false && // numPadVisible is removed
                            !(
                              numAppetizers > 0 &&
                              numDrinks > 0 &&
                              numEntrees > 0 &&
                              numSauces > 0 &&
                              numSides > 1
                            ))
                        }
                      >
                        {drink.item_name}
                      </button>
                    ))
                  ) : (
                    <p>Loading drinks...</p>
                  )}
                </div>
              </div>

              {/* Sauces Section */}
              <div className="menu-section">
                <h3>{"Sauces"}</h3>
                <div className="menu-item-list">
                  {sauces.length > 0 ? (
                    sauces.map((sauce) => (
                      <button
                        key={sauce.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(sauce)}
                        disabled={
                          numSauces === 0 ||
                          (false && // numPadVisible is removed
                            !(
                              numAppetizers > 0 &&
                              numDrinks > 0 &&
                              numEntrees > 0 &&
                              numSauces > 0 &&
                              numSides > 1
                            ))
                        }
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
            <p>Current Customer: {signedInCustomerFirst} {signedInCustomerLast}</p> 
            <h2>{"Current Order"}</h2>
            <p>Current Order: {currentOrder.join(", ")}</p>
          </div>
          <ul className="current-orders-list">
            {currentOrders.map((order, index) => (
              <li key={index} className="order-item">
                <span className="order-text">
                  {order.items.join(", ")} - ${order.totalCost}
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

          {/* Payment Type Selection */}
          <div className="paymentType">
            <h3>Transaction Type <span style={{ color: 'red' }}>*</span></h3>
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
            <button
              className="checkoutCHECK"
              onClick={checkout}
              disabled={!paymentType}
              title={!paymentType ? "Select a transaction type to proceed" : "Checkout"}
            >
              {"Checkout"}
            </button>
            <button
              className="enter_item"
              onClick={() => setShowCustomItemModal(!showCustomItemModal)} // Toggle custom item modal
            >
              {"Enter Custom Item"}
            </button>
            <button className="clear_order" onClick={resetAll}>
              {"Clear Current Order"}
            </button>
            <button className="Confirm" onClick={orderEntered}>
              {"Add to Order"}
            </button>
            <button className="debug" onClick={debug}>
              {"Debug"}
            </button>
          </div>

          <div className="bottom-buttons">
            <button className="back-button" onClick={home_screen}>Return to Home</button>
            <button className="add-customer" onClick={() => setShowCustomerModal(!showCustomerModal)}>Add Customer</button>
            <button className="select-customer" onClick={() => setShowSelectCustomerModal(!showSelectCustomerModal)}>Select Customer</button>
          </div>

          {/* Custom Item Input */}
          {showInput && (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={"Enter Custom Item"}
            />
          )}

          {/* Cost Input */}
          {/* Removed numPadVisible and related on-screen keyboard */}
          {false && (
            <input
              type="text"
              value={cost}
              onChange={handleNumPadChange}
              placeholder={"Enter Cost"}
            />
          )}
        </div>
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setShowCustomerModal(false)}
            >
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

      {/* Select Customer Modal */}
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
                placeholder="Enter item price"
                min="0"
                step="0.01"
              />
            </div>
            <button className="confirm-button" onClick={handleAddCustomItem}>
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* Removed On-Screen Keyboard JSX Elements */}
      {/* If you want to keep standard input fields, they are already included above */}
    </div>
  );
};

export default CashierHome;
