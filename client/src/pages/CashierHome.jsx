import React, { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./CashierHome.css";
import axios from "axios";
import "./Employees.css";

const CashierHome = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // const backendURL = "http://localhost:3000";

  const [activeTab, setActiveTab] = useState("Orders");
  const [showInput, setShowInput] = useState(false); // State to manage input field visibility
  const [inputValue, setInputValue] = useState(""); // State to manage input value
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to manage keyboard visibility
  const [numPadVisible, setNumPadVisible] = useState(false); // State to manage num pad visibility
  const [currentOrder, setCurrentOrder] = useState([]); // Initialize currentOrder state
  const [entrees, setEntrees] = useState([]); // Initialize entrees state
  const [sides, setSides] = useState([]); // Initialize sides state
  const [appetizers, setAppetizers] = useState([]); // Initialize appetizers state
  const [drinks, setDrinks] = useState([]); // Initialize drinks state
  const [numEntrees, setNumEntrees] = useState(0); // Initialize numEntrees state
  const [numSides, setNumSides] = useState(0); // Initialize numSides state
  const [numAppetizers, setNumAppetizers] = useState(0); // Initialize numAppetizers state
  const [numDrinks, setNumDrinks] = useState(0); // Initialize numDrinks state
  const [currentOrders, setCurrentOrders] = useState([]); // Initialize currentOrders state
  const [cost, setCost] = useState(""); // Initialize cost state
  const [currentOrderCost, setCurrentOrderCost] = useState([]); // Initialize currentOrderCost state
  const [mealTypes, setMealTypes] = useState([]); // Initialize mealTypes state
  const [currentOrderIDs, setCurrentOrderIDs] = useState([]); // Initialize currentOrderIDs state
  const [currentOrdersIDs, setCurrentOrdersIDs] = useState([]); // Initialize currentOrdersIDs state
  const [weatherData, setWeatherData] = useState(null);

  // Added state for original items to preserve English data
  const [originalEntrees, setOriginalEntrees] = useState([]);
  const [originalSides, setOriginalSides] = useState([]);
  const [originalAppetizers, setOriginalAppetizers] = useState([]);
  const [originalDrinks, setOriginalDrinks] = useState([]);

  // Language selection and translated texts
  const [language, setLanguage] = useState("en");
  const [translatedTexts, setTranslatedTexts] = useState({});

  // Default text to translate
  const defaultTexts = {
    currentOrderTitle: "Current Order",
    checkout: "Checkout",
    enterItem: "Enter Item",
    clearOrder: "Clear Order",
    confirmOrder: "Confirm Order",
    debug: "Debug",
    entreesTitle: "Entrees",
    sidesTitle: "Sides",
    appetizersTitle: "Appetizer",
    drinksTitle: "Drinks",
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
      if (language === "en") {
        // If language is English, revert to default texts and original item names
        setTranslatedTexts(defaultTexts);
        setEntrees(originalEntrees);
        setSides(originalSides);
        setAppetizers(originalAppetizers);
        setDrinks(originalDrinks);
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
        if (!items || !Array.isArray(items)) return items;
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
    };
    translateUI();
  }, [language]);

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

        const res5 = await axios.get(`${backendURL}/kiosk/meal-types`);
        setMealTypes(res5.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFood();
    fetchWeather();
  }, []);

  // ADD CUSTOM ITEM FUNCTIONALITIES -------------------------------------------------------------------------------------------

  const toggleKeyboard = () => {
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
      currentOrder.push(inputValue);
      setNumPadVisible(true); // Show the numpad after entering the item name
      setInputValue(""); // Clear the input field after adding the item to the order
      setShowInput(false); // Hide the input field after adding the item to the order
      setKeyboardVisible(false);

      setActiveTab("Orders");
      setNumAppetizers(1);
      setNumDrinks(1);
      setNumEntrees(1);
      setNumSides(1);
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
          numSides > 0
        ) {
          currentOrdersIDs.push([999]);
        } else {
          currentOrdersIDs.push(currentOrderIDs);
        }
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
      setNumSides(1);
    } else if (tabName.item_name === "Plate") {
      reset();
      setNumEntrees(2);
      setNumSides(1);
    } else if (tabName.item_name === "Bigger Plate") {
      reset();
      setNumEntrees(3);
      setNumSides(1);
    } else if (tabName.item_name.includes("Entree")) {
      reset();
      setNumEntrees(1);
    } else if (tabName.item_name.includes("Side")) {
      reset();
      setNumSides(1);
    } else if (tabName.item_name === "Appetizer") {
      reset();
      setNumAppetizers(1);
    } else if (tabName.item_name.includes("Drink")) {
      reset();
      setNumDrinks(1);
    }

    handleOrderTypeClick(tabName);
  };

  // END OF TAB FUNCTIONALITIES --------------------------------------------------------------------------------------------

  // HANDLES CURRENT ORDERS AND NUMBER OF ITEMS -------------------------------------------------------------------------------------------

  const handleFoodClick = (item) => {
    // Decrement counts and add items to the current order
    if (item.item_category === "Entree" && numEntrees > 0) {
      setNumEntrees(numEntrees - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    } else if (item.item_category === "Side" && numSides > 0) {
      setNumSides(numSides - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    } else if (item.item_category === "Appetizer" && numAppetizers > 0) {
      setNumAppetizers(numAppetizers - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    } else if (item.item_category === "Drink" && numDrinks > 0) {
      setNumDrinks(numDrinks - 1);
      currentOrder.push(item.item_name);
      currentOrderIDs.push(item.menu_item_id);
      currentOrderCost.push(item.item_price);
    }
  };

  const debug = async () => {
    console.log("Translation:" + (await translateText("Hello", "es")));
    console.log("Weather:" + weatherData.main.temp);
    console.log("Weather:", JSON.stringify(weatherData, null, 2));
    console.log("Weather: ", weatherData.weather[0].description);
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
      numSides === 0 &&
      currentOrder.length > 0
    ) {
      currentOrder.push(
        currentOrderCost.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2)
      );
      currentOrdersIDs.push(currentOrderIDs);
      currentOrders.push(currentOrder);
      setCurrentOrders([...currentOrders]);
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
      console.log("Checkout successful");

      // Iterate over each sublist in currentOrders
      for (const order of currentOrders) {
        // Iterate over each item in the sublist
        for (const item of order) {
          try {
            // Make an Axios PUT request for each item
            await axios.put(`${backendURL}/cashier/get-menu`, {
              item_name: item,
            });
            console.log(`Updated item: ${item}`);
          } catch (error) {
            console.error(`Error updating item: ${item}`, error);
          }
        }
      }

      // Clear currentOrders after processing
      setCurrentOrders([]);
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
              <h3>
                {translatedTexts.entreesTitle || defaultTexts.entreesTitle}
              </h3>
              <div className="menu-item-list">
                {entrees.map((entree) => (
                  <button
                    key={entree.menu_item_id}
                    className="menu-item-button"
                    onClick={() => handleFoodClick(entree)}
                    disabled={numEntrees === 0}
                  >
                    {entree.item_name}
                  </button>
                ))}
              </div>

              <h3>{translatedTexts.sidesTitle || defaultTexts.sidesTitle}</h3>
              <div className="menu-item-list">
                {sides.map((side) => (
                  <button
                    key={side.menu_item_id}
                    className="menu-item-button"
                    onClick={() => handleFoodClick(side)}
                    disabled={numSides === 0}
                  >
                    {side.item_name}
                  </button>
                ))}
              </div>

              <h3>
                {translatedTexts.appetizersTitle ||
                  defaultTexts.appetizersTitle}
              </h3>
              <div className="menu-item-list">
                {appetizers.map((appetizer) => (
                  <button
                    key={appetizer.menu_item_id}
                    className="menu-item-button"
                    onClick={() => handleFoodClick(appetizer)}
                    disabled={numAppetizers === 0}
                  >
                    {appetizer.item_name}
                  </button>
                ))}
              </div>

              <h3>{translatedTexts.drinksTitle || defaultTexts.drinksTitle}</h3>
              <div className="menu-item-list">
                {drinks.map((drink) => (
                  <button
                    key={drink.menu_item_id}
                    className="menu-item-button"
                    onClick={() => handleFoodClick(drink)}
                    disabled={numDrinks === 0}
                  >
                    {drink.item_name}
                  </button>
                ))}
              </div>

              <div className="current-order">
                {translatedTexts.currentOrderTitle ||
                  defaultTexts.currentOrderTitle}
                : {currentOrder.join(", ")}
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
            <ul>
              {currentOrders.map((order, index) => (
                <li key={index}>
                  <button onClick={() => removeItem(index)}>X </button>
                  {order.join(", ")}
                </li>
              ))}
            </ul>
          </div>

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
        <Keyboard
          onChange={onChange}
          onKeyPress={handleKeyPress} // Handles the Enter key press event
          inputName="inputValue"
          layoutName="default"
        />
      )}
      {numPadVisible && (
        <Keyboard
          onChange={handleNumPadChange}
          onKeyPress={handleNumPadKeyPress}
          inputName="cost"
          layout={{
            default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 . {enter}"],
          }}
        />
      )}
    </div>
  );
};

export default CashierHome;
