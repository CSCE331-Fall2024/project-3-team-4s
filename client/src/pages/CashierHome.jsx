// CashierHome.js
import React, { useEffect, useState, useContext } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./styles/CashierHome.css";
import axios from "axios";
import "./Employees.css";
import { LanguageContext } from "./LanguageContext";
import { Route, Routes, useNavigate } from "react-router-dom";

const CashierHome = () => {
  //const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); //back to homepage
  const backendURL = "http://localhost:3000";

  const { language, setLanguage } = useContext(LanguageContext);
  const [translatedTexts, setTranslatedTexts] = useState({});

  const [activeTab, setActiveTab] = useState("Orders");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [numPadVisible, setNumPadVisible] = useState(false);
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

  // Added state for original items to preserve English data
  const [originalEntrees, setOriginalEntrees] = useState([]);
  const [originalSides, setOriginalSides] = useState([]);
  const [originalAppetizers, setOriginalAppetizers] = useState([]);
  const [originalDrinks, setOriginalDrinks] = useState([]);
  const [originalMealTypes, setOriginalMealTypes] = useState([]);
  const [originalSauces, setOriginalSauces] = useState([]);

  // State to track data fetching completion
  const [dataFetched, setDataFetched] = useState(false);
  //edge case with bottle and refresher
  const [refresherCost, setRefresherCost] = useState(0);
  const [bottleCost, setBottleCost] = useState(0);

  // Default text to translate
  const defaultTexts = {
    currentOrderTitle: "Current Order",
    checkout: "Checkout",
    enterItem: "Enter Custom Item",
    clearOrder: "Clear Order",
    confirmOrder: "Confirm Order",
    exitPage: "Return to Home",
    debug: "Debug",
    entreesTitle: "Entrees",
    sidesTitle: "Sides",
    appetizersTitle: "Appetizer",
    drinksTitle: "Drinks",
    saucesTitle: "Sauces",
    enterItemDetails: "Enter item details",
    correctNumberItems: "Please select the correct number of items",
  };

  // Translate text using the provided function
  const translateText = async (text, targetLanguage) => {
    try {
      if (targetLanguage === "en") {
        // If language is English, no translation needed
        return text;
      }
      const response = await axios.post(`${backendURL}/translate/translate`, {
        text,
        targetLanguage,
      });
      return response.data;
    } catch (error) {
      console.error("Error translating text:", error);
      return text; // Return original text if translation fails
    }
  };

  // Translate UI text and menu items when language changes
  useEffect(() => {
    const translateUI = async () => {
      if (!dataFetched) {
        // Data hasn't been fetched yet; wait before translating, this is so it finds the correct names
        return;
      }

      if (language === "en") {
        // If language is English, revert to default texts and original item names
        setTranslatedTexts(defaultTexts);
        setEntrees(originalEntrees);
        setSides(originalSides);
        setAppetizers(originalAppetizers);
        setDrinks(originalDrinks);
        setMealTypes(originalMealTypes); // Revert meal types to original
        setSauces(originalSauces);
        return;
      }

      // Translate static UI texts
      const translations = {};
      for (const [key, value] of Object.entries(defaultTexts)) {
        const translated = await translateText(value, language);
        translations[key] = translated;
      }
      setTranslatedTexts(translations);

      // Translate menu item names
      const translateMenuItems = async (items) => {
        if (!items || !Array.isArray(items) || items.length === 0) return [];
        const translatedItems = [];
        for (const item of items) {
          const translatedName = await translateText(item.item_name, language);
          translatedItems.push({ ...item, item_name: translatedName });
        }
        return translatedItems;
      };

      // Update each category with translated names
      const translatedEntrees = await translateMenuItems(originalEntrees);
      setEntrees(translatedEntrees);

      const translatedSides = await translateMenuItems(originalSides);
      setSides(translatedSides);

      const translatedAppetizers = await translateMenuItems(originalAppetizers);
      setAppetizers(translatedAppetizers);

      const translatedDrinks = await translateMenuItems(originalDrinks);
      setDrinks(translatedDrinks);

      // **Include Sauces**
      const translatedSauces = await translateMenuItems(originalSauces);
      setSauces(translatedSauces);

      // Translate meal types
      const translatedMealTypes = await translateMenuItems(originalMealTypes);
      setMealTypes(translatedMealTypes);
    };

    translateUI();
  }, [language, dataFetched]); // Added dataFetched to dependency array

  // Fetch weather data
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

  // Preloading all data
  useEffect(() => {
    const fetchFood = async () => {
      try {
        // Preload all data so requests are not needed repeatedly
        const res = await axios.get(`${backendURL}/kiosk/entrees`);
        setEntrees(res.data);
        setOriginalEntrees(res.data);

        const res2 = await axios.get(`${backendURL}/kiosk/sides`);
        setSides(res2.data);
        setOriginalSides(res2.data);

        const res3 = await axios.get(`${backendURL}/kiosk/appetizers`);
        setAppetizers(res3.data);
        setOriginalAppetizers(res3.data);

        const res4 = await axios.get(`${backendURL}/kiosk/drinks`);
        setDrinks(res4.data);
        setOriginalDrinks(res4.data);
        //console.log("Drinks" ,res4.data);
        const res6 = await axios.get(`${backendURL}/kiosk/sauces`);
        setSauces(res6.data);
        setOriginalSauces(res6.data);
        //console.log("Sauces" ,res6.data);

        const res5 = await axios.get(`${backendURL}/kiosk/meal-types`);

        // Extract "refresher" and "bottle" items
        const refresherItem = res5.data.find(
          (item) => item.item_name.toLowerCase() === "refresher"
        );
        const bottleItem = res5.data.find(
          (item) => item.item_name.toLowerCase() === "bottle"
        );

        // Save their costs to state variables
        if (refresherItem) {
          setRefresherCost(refresherItem.item_price);
        }
        if (bottleItem) {
          setBottleCost(bottleItem.item_price);
        }

        // Filter out "refresher" and "bottle" from meal types
        const filteredMealTypes = res5.data.filter(
          (item) =>
            item.item_name.toLowerCase() !== "refresher" &&
            item.item_name.toLowerCase() !== "bottle"
        );

        // Update the state with the filtered meal types
        setMealTypes(filteredMealTypes);
        setOriginalMealTypes(filteredMealTypes); // Store original meal types

        // Set dataFetched to true after all data is fetched
        setDataFetched(true);
      } catch (err) {
        console.error("Error fetching food data:", err);
      }
    };

    fetchFood();
    fetchWeather();
  }, []);

  // ADD CUSTOM ITEM FUNCTIONALITIES -------------------------------------------------------------------------------------------

  const toggleKeyboard = () => {
    reset();
    if (numPadVisible === true) {
      setNumPadVisible(false);
    }
    setCost("");
    setCurrentOrder([]);
    setCurrentOrderIDs([]);
    setCurrentOrderCost([]);
    setShowInput(!showInput);
    setKeyboardVisible(!keyboardVisible);
  };

  const handleKeyPress = (button) => {
    // For item name
    if (button === "{enter}") {
      console.log("Input value:", inputValue);
      if (inputValue === "") {
        console.log("Input value is empty");
      } else {
        currentOrder.push(inputValue);
      }
      setNumPadVisible(true); // Show the numpad after entering the item name
      setInputValue(""); // Clear the input field after adding the item to the order
      setShowInput(false); // Hide the input field after adding the item to the order
      setKeyboardVisible(false);

      setActiveTab("Orders");
      setNumAppetizers(1);
      setNumDrinks(1);
      setNumEntrees(1);
      setNumSauces(6);
      setNumSides(2);
    }
  };

  const handleNumPadChange = (input) => {
    setCost(input);
    console.log("Cost input changed:", input);
  };

  const handleNumPadKeyPress = (button) => {
    if (button === "{enter}") {
      try {
        if (cost === "") {
          console.log("Cost is empty");
          return;
        }

        Number(cost);
        console.log("Cost entered:", cost);
        setNumPadVisible(false); // Hide the numpad after entering the cost
        currentOrder.push(Number(cost).toFixed(2));
        currentOrderCost.push(Number(cost).toFixed(2));
        currentOrders.push(currentOrder);
        setCurrentOrders([...currentOrders]);
        console.log("Current Orders: ");
        console.log(currentOrders);
        setInputValue(""); // Clear the input field after adding the item to the order
        setCurrentOrder([]); // Clear the current order
        setCurrentOrderIDs([]);
        setCost("");

        // If an item is not selected, default to 999
        if (
          numAppetizers > 0 &&
          numDrinks > 0 &&
          numEntrees > 0 &&
          numSauces > 0 &&
          numSides > 1
        ) {
          currentOrdersIDs.push([999]);
        } else {
          currentOrdersIDs.push(currentOrderIDs);
        }
        reset();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const onChange = (input) => {
    setInputValue(input);
  };

  // END OF ADD CUSTOM ITEM FUNCTIONALITIES -------------------------------------------------------------------------------------------

  // GLOBALLY USED FUNCTIONS -------------------------------------------------------------------------------------------

  const reset = () => {
    setNumEntrees(0);
    setNumSides(0);
    setNumAppetizers(0);
    setNumDrinks(0);
    setHalfSides(0);
    setNumSauces(0);
    setCurrentOrderCost([]);
  };

  const resetAll = () => {
    reset();
    console.log("Resetting all orders");
    setActiveTab("Orders");
    setCurrentOrder([]);
    setCurrentOrderIDs([]);
    setCurrentOrderCost([]);
  };

  useEffect(() => {
    console.log("Current Order after reset:", currentOrder);
  }, [currentOrder]);

  // END OF GLOBALLY USED FUNCTIONS -------------------------------------------------------------------------------------------

  // TAB FUNCTIONALITIES --------------------------------------------------------------------------------------------

  const openTab = (e, tabName) => {
    // Handles tab clicks and sets the number of items
    console.log("Tab name:", tabName);
    // Reset the current order and cost then assign
    setCurrentOrder([]);
    setCurrentOrderIDs([]);
    setActiveTab(tabName.item_name);
    reset();

    if (tabName.item_name === "Bowl") {
      reset();
      setNumEntrees(1);
      setNumSides(2);
    } else if (tabName.item_name === "Plate") {
      reset();
      setNumEntrees(2);
      setNumSides(2);
    } else if (tabName.item_name === "Bigger Plate") {
      reset();
      setNumEntrees(3);
      setNumSides(2);
    } else if (tabName.item_name.includes("Entree")) {
      reset();
      setNumEntrees(1);
    } else if (tabName.item_name.includes("Side")) {
      reset();
      setNumSides(2);
    } else if (tabName.item_name === "Appetizer") {
      reset();
      setNumAppetizers(1);
    } else if (tabName.item_name.includes("Drink")) {
      reset();
      setNumDrinks(1);
    } else if (tabName.item_name.includes("Sauces")) {
      reset();
      setNumSauces(6);
    }

    handleOrderTypeClick(tabName);
  };

  // END OF TAB FUNCTIONALITIES --------------------------------------------------------------------------------------------

  // HANDLES CURRENT ORDERS AND NUMBER OF ITEMS -------------------------------------------------------------------------------------------

  const handleFoodClick = (item) => {
    console.log("handle food click", item.item_category, numSauces);
    // Decrement counts and add items to the current order
    if (item.item_category === "Entree" && numEntrees > 0) {
      setNumEntrees(numEntrees - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    } else if (item.item_category === "Side" && numSides > 0) {
      setNumSides(numSides - 1);
      if (numSides === 0) {
        setHalfSides(1);
      }
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    } else if (item.item_category === "Appetizer" && numAppetizers > 0) {
      setNumAppetizers(numAppetizers - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    } else if (
      (item.item_category === "Drink" ||
        item.item_category === "Refresher" ||
        item.item_category === "Bottle") &&
      numDrinks > 0
    ) {
      setNumDrinks(numDrinks - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      if (item.item_category === "Drink") {
        currentOrderCost.push(item.item_price);
      } else if (item.item_category === "Refresher") {
        currentOrderCost.push(refresherCost + item.item_price);
        currentOrderCost[0] = 0;
        console.log("dsafsdafsadfs", refresherCost + item.item_price);
      } else if (item.item_category === "Bottle") {
        currentOrderCost.push(bottleCost + item.item_price);
        currentOrderCost[0] = 0;
      }
    } else if (item.item_category === "Sauces" && numSauces > 0) {
      console.log("Sauces", item.item_name);
      setNumSauces(numSauces - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    }
  };
  const home_screen = () => {
    navigate("/");
  };

  const debug = async () => {
    console.log("Current Order", currentOrder);
    console.log("Translation:" + (await translateText("Hello", "es")));
    console.log("Weather:" + weatherData?.main?.temp);
    console.log("Weather:", JSON.stringify(weatherData, null, 2));
    console.log("Weather: ", weatherData?.weather[0]?.description);
    console.log(numAppetizers, numDrinks, numEntrees, numSides);
    console.log(
      numPadVisible === true &&
        numAppetizers > 0 &&
        numDrinks > 0 &&
        numEntrees > 0 &&
        numSides > 1
    );
    console.log("Current Order Cost:", currentOrders);
    console.log("Current Orders IDS:", currentOrdersIDs);

    console.log("Current Order Cost: ", currentOrderCost);
  };

  const handleOrderTypeClick = (id) => {
    // Adds the first item to the order (bowls, plates, etc.)
    setCurrentOrder((prevOrder) => [...prevOrder, id.item_name]);
    setCurrentOrderIDs((prevOrderIDs) => [...prevOrderIDs, id.menu_item_id]);
    setCurrentOrderCost((prevOrderCost) => [...prevOrderCost, id.item_price]);
  };

  const removeItem = (index) => {
    // Removes an item from the current orders
    setCurrentOrders(currentOrders.filter((_, i) => i !== index));
    setCurrentOrdersIDs(currentOrdersIDs.filter((_, i) => i !== index));
  };

  const orderEntered = () => {
    // Adds items to the list of orders
    if (
      numAppetizers === 0 &&
      numDrinks === 0 &&
      numEntrees === 0 &&
      numSauces === 0 &&
      (numSides === 0 || numSides === 1) &&
      currentOrder.length > 0
    ) {
      currentOrder.push(
        currentOrderCost.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2)
      );
      console.log("testing CurrentOrderCost", currentOrderCost);
      currentOrdersIDs.push(currentOrderIDs);
      currentOrders.push(currentOrder);
      setCurrentOrders([...currentOrders]);
      console.log("Current Orders: ");
      console.log(currentOrders);
      setInputValue(""); // Clear the input field after adding the item to the order
      setCurrentOrder([]); // Clear the current order
      setCurrentOrderIDs([]);
      setCurrentOrderCost([]);
      reset();
    } else {
      console.log(
        translatedTexts.correctNumberItems || defaultTexts.correctNumberItems
      );
    }
  };

  const checkout = async () => {
    console.log("Checkout clicked");
    if (currentOrders.length > 0) {
      console.log("Processing checkout...");
      const userConfirmed = window.confirm(
        "Are you sure you want to checkout?"
      );
      if (userConfirmed) {
        // Proceed with the checkout
        console.log("User confirmed. Proceeding with checkout...");
      } else {
        // User canceled the action
        console.log("User canceled checkout.");
      }
      try {
        // Step 1: Calculate Total Cost
        let totalCost = 0;
        currentOrders.forEach((order) => {
          // Assuming the cost is the last element in each order array
          const cost = parseFloat(order[order.length - 1]);
          totalCost += cost;
        });

        // Step 2: Create a New Transaction
        const transactionData = {
          total_cost: parseFloat(totalCost.toFixed(2)), // Ensure it's a number
          transaction_time: new Date()
            .toISOString()
            .split("T")[1]
            .split(".")[0], // "HH:MM:SS"
          transaction_date: new Date().toISOString().split("T")[0], // "YYYY-MM-DD"
          transaction_type: "Credit/Debit",
          customer_id: 1,
          employee_id: 1,
          week_number: 1,
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

        // Step 3: Process Each Order
        for (let i = 0; i < currentOrders.length; i++) {
          const order = currentOrders[i];
          const orderItemIDs = currentOrdersIDs[i];

          // Skip the last element if it's the total cost
          const itemsInOrder = order.slice(0, -1);
          const itemIDsInOrder = orderItemIDs;

          // Step 3a: Insert Items into menu_item_transaction
          for (let j = 0; j < itemIDsInOrder.length; j++) {
            const menuItemId = itemIDsInOrder[j];
            const itemQuantity = 1; // Assuming quantity is 1 for each item

            // Send a POST request to insert into menu_item_transaction
            await axios.post(`${backendURL}/cashier/post-transaction-menu`, {
              menu_item_id: menuItemId,
              transaction_id: transactionId,
              item_quantity: itemQuantity,
            });

            console.log(
              `Inserted into menu_item_transaction: menu_item_id=${menuItemId}, transaction_id=${transactionId}, item_quantity=${itemQuantity}`
            );

            // Step 3b: Update menu_item Table
            await axios.put(`${backendURL}/cashier/put-menu`, {
              menu_item_id: menuItemId,
            });

            console.log(`Updated menu_item: menu_item_id=${menuItemId}`);
          }
        }

        // Step 4: Clear Current Orders
        setCurrentOrders([]);
        setCurrentOrdersIDs([]);
        alert("Checkout successful!");
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Checkout failed. Please try again.");
      }
    } else {
      alert("No items in the current order.");
    }
  };

  const tabs = mealTypes;

  return (
    <div className="overall">
      {/* Language selection dropdown */}
      <div className="language-selector">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          {/* Add more language options here */}
        </select>
      </div>

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
                {translatedTexts.entreesTitle || defaultTexts.entreesTitle}
                <div className="menu-item-list">
                  {entrees && entrees.length > 0 ? (
                    entrees.map((entree) => (
                      <button
                        key={entree.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(entree)}
                        disabled={
                          numEntrees === 0 ||
                          (numPadVisible === true &&
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

              <div className="menu-section">
                {translatedTexts.sidesTitle || defaultTexts.sidesTitle}
                <div className="menu-item-list">
                  {sides && sides.length > 0 ? (
                    sides.map((side) => (
                      <button
                        key={side.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(side)}
                        disabled={
                          numSides === 0 ||
                          (numPadVisible === true &&
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

              <div className="menu-section">
                {translatedTexts.appetizersTitle ||
                  defaultTexts.appetizersTitle}
                <div className="menu-item-list">
                  {appetizers && appetizers.length > 0 ? (
                    appetizers.map((appetizer) => (
                      <button
                        key={appetizer.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(appetizer)}
                        disabled={
                          numAppetizers === 0 ||
                          (numPadVisible === true &&
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

              <div className="menu-section">
                {translatedTexts.drinksTitle || defaultTexts.drinksTitle}
                <div className="menu-item-list">
                  {drinks && drinks.length > 0 ? (
                    drinks.map((drink) => (
                      <button
                        key={drink.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(drink)}
                        disabled={
                          numDrinks === 0 ||
                          (numPadVisible === true &&
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
              <div className="menu-section">
                {translatedTexts.saucesTitle || defaultTexts.saucesTitle}
                <div className="menu-item-list">
                  {sauces && sauces.length > 0 ? (
                    sauces.map((sauce) => (
                      <button
                        key={sauce.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(sauce)}
                        disabled={
                          numSauces === 0 ||
                          (numPadVisible === true &&
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

        <div className="order">
          <div className="orderItems">
            <h2>
              {translatedTexts.currentOrderTitle ||
                defaultTexts.currentOrderTitle}
            </h2>
            currentOrder: {currentOrder.join(", ")}
          </div>
          <ul className="current-orders-list">
            {currentOrders.map((order, index) => (
              <li key={index} className="order-item">
                <span className="order-text">{order.join(", ")}</span>
                <button
                  className="remove-button"
                  onClick={() => removeItem(index)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className="orderButtons">
            <button className="checkoutCHECK" onClick={checkout}>
              {translatedTexts.checkout || defaultTexts.checkout}
            </button>
            <button className="enter_item" onClick={toggleKeyboard}>
              {translatedTexts.enterItem || defaultTexts.enterItem}
            </button>
            <button className="clear_order" onClick={resetAll}>
              {translatedTexts.clearOrder || defaultTexts.clearOrder}
            </button>
            <button className="Confirm" onClick={orderEntered}>
              {translatedTexts.confirmOrder || defaultTexts.confirmOrder}
            </button>
            <button className="debug" onClick={debug}>
              {translatedTexts.debug || defaultTexts.debug}
            </button>
          </div>
          <button className="back-button" onClick={home_screen}>
            {translatedTexts.exitPage || defaultTexts.exitPage}
          </button>

          {showInput && ( // Text box for custom item name
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
                translatedTexts.enterItemDetails ||
                defaultTexts.enterItemDetails
              }
            />
          )}
          {numPadVisible && ( // Text box for cost input
            <input
              type="text"
              value={cost}
              onChange={handleNumPadChange}
              placeholder={
                translatedTexts.enterItemDetails ||
                defaultTexts.enterItemDetails
              }
            />
          )}
        </div>
      </div>

      {keyboardVisible && (
        <div className="keyboard-container">
          <Keyboard
            onChange={onChange}
            onKeyPress={handleKeyPress} // Handles the Enter key press event
            inputName="inputValue"
            layoutName="default"
          />
        </div>
      )}
      {numPadVisible && (
        <div className="keyboard-container">
          <Keyboard
            onChange={handleNumPadChange}
            onKeyPress={handleNumPadKeyPress}
            inputName="cost"
            layout={{
              default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 . {enter}"],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CashierHome;
