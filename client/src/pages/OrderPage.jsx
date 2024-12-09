import React, { useEffect, useState } from "react";
import "./OrderPage.css";
import { useOrder } from "./OrderContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "../contexts/TranslateContext";
import he from "he";
import { translate } from "../utils/translateUtil";
import { currentWeather } from "../utils/weatherUtil";

const OrderPage = () => {
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:3000"; // Replace with actual backend URL

  const [text, setText] = useState({
    currentOrder: "Your Current Order",
    addMore: "Add More Items",
    removeAll: "Remove All Items",
    remove: "Remove",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    paymentMethod: "Payment Method",
    checkout: "Checkout",
    utensils: "Utensils",
    napkins: "Napkins",
    additionalRequests: "Additional Requests?",
    creditDebit: "Credit Card/Debit Card",
    giftCard: "Gift Card",
    loading: "Loading...",
    clickToAdd: "Click to Add",
    doYouWantToDelete: "Do you really want to delete this item?",
    noItems: "No items in your order. Add some items to your order before checking out.",
    addItem: "Do you want to add this item to your order?",
    deleteItems: "Do you really want to delete all the items in the order?",
    deleteItem: "Do you really want to delete this item?",
    pleaseadditems: "Please add items to your order before checking out.",
    selectPayment: "Please select a payment method.",
    proceedToCheckout: "Are you sure you want to proceed to checkout?",
    confirmation: "Order confirmed! Thank you for your purchase.",
    recommendation: "Recommendation",
    based: "Based",
    on: "on",
    Today: "Today's",
    Weather: "Weather",
  });

  const { language } = useTranslate();

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const translatedText = {
          currentOrder: he.decode(await translate("Your Current Order", language)),
          remove : he.decode(await translate("Remove", language)),
          noItems: he.decode(await translate("No items in your order. Add some items to your order before checking out.", language)),
          addMore: he.decode(await translate("Add More Items", language)),
          removeAll: he.decode(await translate("Remove All Items", language)),
          subtotal: he.decode(await translate("Subtotal", language)),
          tax: he.decode(await translate("Tax", language)),
          total: he.decode(await translate("Total", language)),
          paymentMethod: he.decode(await translate("Payment Method", language)),
          checkout: he.decode(await translate("Checkout", language)),
          utensils: he.decode(await translate("Utensils", language)),
          napkins: he.decode(await translate("Napkins", language)),
          additionalRequests: he.decode(await translate("Additional Requests?", language)),
          creditDebit: he.decode(await translate("Credit Card/Debit Card", language)),
          giftCard: he.decode(await translate("Gift Card", language)),
          loading: he.decode(await translate("Loading...", language)),
          clickToAdd: he.decode(await translate("Click to Add", language)),
          doYouWantToDelete: he.decode(await translate("Do you really want to delete this item?", language)),
          addItem: he.decode(await translate("Do you want to add this item to your order?", language)),
          deleteItems: he.decode(await translate("Do you really want to delete all the items in the order?", language)),
          deleteItem: he.decode(await translate("Do you really want to delete this item?", language)),
          confirmation: he.decode(await translate("Order confirmed! Thank you for your purchase.", language)),
          pleaseadditems: he.decode(await translate("Please add items to your order before checking out.", language)),
          selectPayment: he.decode(await translate("Please select a payment method.", language)),
          proceedToCheckout: he.decode(await translate("Are you sure you want to proceed to checkout?", language)),
          recommendation: he.decode(await translate("Recommendation", language)),
          based: he.decode(await translate("Based", language)),
          on: he.decode(await translate("on", language)),
          Today: he.decode(await translate("Today's", language)),
          Weather: he.decode(await translate("Weather", language)),
        };
        setText(translatedText);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

    

  const [recommendedItems, setRecommendedItems] = useState([]);
  const [weather, setWeather] = useState(0);
  const [temperatureColor, setTemperatureColor] = useState("black");
  const [weatherIcon, setWeatherIcon] = useState("");

  const addRecommendedItemToOrder = (itemName) => {
    const confirm = window.confirm(text.addItem); // Display a confirmation message
    if(!confirm) return;
    // Check if the item already exists in the orderList
    const existingItemIndex = orderList.findIndex((item) => item.name === itemName);

    if (existingItemIndex !== -1) {
      // If the item exists, increment its quantity
      const updatedOrderList = [...orderList];
      updatedOrderList[existingItemIndex].quantity += 1;
      setOrderList(updatedOrderList);
    } else {
      // If the item does not exist, add it with a quantity of 1
      const newItem = {
        name: itemName,
        quantity: 1,
      };
      setOrderList([...orderList, newItem]);
    }
  };

  useEffect(() => {
    const fetchWeatherAndItems = async () => {
      try {
        const weather = await currentWeather();
        let recommended = [];

        if (weather < 32) {
          setTemperatureColor("#001f3f"); // Dark blue for freezing weather
          setWeatherIcon("❄️"); // Snowflake for cold weather
        } else if (weather < 60) {
          setTemperatureColor("#0074D9"); // Light blue for cold weather
          setWeatherIcon("❄️"); // Snowflake for cold weather
        } else if (weather > 60) {
          if (weather <= 100) {
            setTemperatureColor("#FF851B"); // Orange for hot weather
            setWeatherIcon("☀️"); // Sun for hot weather
          } else {
            setTemperatureColor("#FF4136"); // Darker orange/red for very hot weather
            setWeatherIcon("☀️"); // Sun for hot weather
          }
        } else {
          setTemperatureColor("black"); // Neutral weather
        }

        if (weather < 60) {
          recommended = [
            "Sweet Fire Chicken Breast",
            "Hot Ones Blazing Bourbon Chicken",
            "Chili Sauce",
            "Chicken Egg Roll",
          ];
        } else if (weather >= 60) {
          recommended = [
            "Peach Lychee Flavored Refresher",
            "Minute Maid Lemonade",
            "Fuze Raspberry Iced Tea",
            "Watermelon Mango Flavored Refresher",
            "Apple Pie Roll",
          ];
        } else {
          recommended = [
            "The Original Orange Chicken",
            "Beijing Beef",
            "Mushroom Chicken",
            "String Bean Chicken Breast",
          ];
        }

        // Fetch prices for recommended items
        const priceResponses = await Promise.all(
          recommended.map((item) =>
            axios.get(`${backendURL}/kiosk/prices`, { params: { itemName: item } })
          )
        );

        const itemPrices = priceResponses.reduce((acc, response, index) => {
          acc[recommended[index]] = response.data.price;
          return acc;
        }, {});

        setPrices((prev) => ({ ...prev, ...itemPrices }));
        setRecommendedItems(recommended);
        setWeather(weather);
      } catch (error) {
        console.error("Error fetching weather or recommended items:", error);
      }
    };

    fetchWeatherAndItems();
  }, []);


  const { orderList, setOrderList } = useOrder();
  const [prices, setPrices] = useState({}); // Cache for fetched prices
  const [itemData, setItemData] = useState([]); // Cache for fetched item data

  const incrementQuantity = (index) => {
    const updatedOrderList = [...orderList];
    if (updatedOrderList[index]) {
      updatedOrderList[index].quantity += 1;
      setOrderList(updatedOrderList);
    }
  };

  const decrementQuantity = (index) => {
    const updatedOrderList = [...orderList];
    if (updatedOrderList[index] && updatedOrderList[index].quantity > 1) {
      updatedOrderList[index].quantity -= 1;
      setOrderList(updatedOrderList);
    }
  };

  const hexToRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
  
    // Handle shorthand hex colors (e.g., #FFF)
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      // Handle full hex colors (e.g., #FFFFFF)
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };  

  // Fetch all item data initially
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await axios.get(`${backendURL}/kiosk/items`);
        setItemData(response.data); // Assuming response.data is an array of item objects
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchAllItems();
  }, []);

  // Populate prices cache
  useEffect(() => {
    const cachePrices = () => {
      const newPrices = {};
      itemData.forEach((item) => {
        if (item.item_name) {
          newPrices[item.item_name] = item.item_price || 0;
        }
      });
      setPrices(newPrices);
    };
    if (itemData.length > 0) {
      cachePrices();
    }
  }, [itemData]);

  // Fetch item or category price
  const fetchPrice = async (name, category = null) => {
    if (!prices[name]) {
      try {
        const response = await axios.get(`${backendURL}/kiosk/prices`, {
          params: { itemName: name },
        });
        console.log(`Fetched price for ${name}:`, response.data.price);
        setPrices((prev) => ({ ...prev, [name]: response.data.price }));

        return response.data.price;
      } catch (error) {
        console.error(
          "Error fetching price:",
          error.response || error.message || error
        );
        return 0;
      }
    }
    return prices[name];
  };

  console.log(orderList);
  const clearOrder = () => {
    const confirmed = window.confirm(
      text.deleteItems
    );
    if (confirmed) {
      setOrderList([]);
      sessionStorage.removeItem("orderList");
    }
  };

  const clearOrderCheckout = () => {
      setOrderList([]);
      sessionStorage.removeItem("orderList");
  };

  // Fetch all prices initially for items in the order list
  useEffect(() => {
    const fetchAllPrices = async () => {
      const newPrices = {};
      for (const item of orderList) {
        // Fetch individual item price
        const itemPrice = await fetchPrice(item.name, item.category);
        newPrices[item.name] = itemPrice;

        // Fetch category price (if category exists in the database as an item)
        if (item.category) {
          const categoryPrice = await fetchPrice(item.category);
          newPrices[item.category] = categoryPrice;
        }
      }
      setPrices((prev) => ({ ...prev, ...newPrices }));
    };
    fetchAllPrices();
  }, [orderList]);

  const getItemTotalPrice = (item, index) => {
    const itemPrice = prices[item.name] || 0;

    // Fetch the category of the item
    let categoryName = itemData.find(
      (data) => data.item_name === item.name
    )?.item_category;

    // Adjust category names for sides/entrees
    if (categoryName === "Side") {
      categoryName = "A La Carte Side";
    } else if (categoryName === "Entree") {
      categoryName = "A La Carte Entree";
    }

    const categoryPrice = categoryName ? prices[categoryName] || 0 : 0;

    // Special handling for Bowls, Plates, and Bigger Plates
    if (
      item.name === "Bowl" ||
      item.name === "Plate" ||
      item.name === "Bigger Plate"
    ) {
      const sideCount = 1; // All combos have one side
      const entreeCount =
        item.name === "Bowl" ? 1 : item.name === "Plate" ? 2 : 3;

      // Gather sides and entrees associated with this combo
      const sidesAndEntrees = orderList.slice(
        index + 1,
        index + 1 + sideCount + entreeCount
      );

      // Calculate the total price of sides and entrees
      const sidesAndEntreesPrice = sidesAndEntrees.reduce((sum, subItem) => {
        const subItemPrice = prices[subItem.name] || 0;

        // let subCategoryName = itemData.find(
        //   (data) => data.item_name === subItem.name
        // )?.item_category;     

        // const subCategoryPrice = subCategoryName
        //   ? prices[subCategoryName] || 0
        //   : 0;

        return sum + subItemPrice;
      }, 0);

      // Return the total price for the combo, including sides and entrees
      return (itemPrice + categoryPrice + sidesAndEntreesPrice) * item.quantity;
    }

    // For regular items, calculate price normally
    return (itemPrice + categoryPrice) * item.quantity;
  };

  const imageMap = {
    Bowl: "/bowl.avif",
    Plate: "/plate.avif",
    "Bigger Plate": "/Bigger_Plate.avif",
    "Chow Mein": "/Chow_Mein.png",
    "Super Greens": "/Super_Greens.png",
    "White Rice": "/White_Rice.png",
    "Fried Rice": "/Fried_Rice.png",
    "Beijing Beef": "/Beijing_Beef.png",
    "The Original Orange Chicken": "/The_Original_Orange_Chicken.png",
    "Broccoli Beef": "/Broccoli_Beef.png",
    "Mushroom Chicken": "/Mushroom_Chicken.png",
    "Grilled Teriyaki Chicken": "/Grilled_Teriyaki_Chicken.png",
    "Beyond Original Orange Chicken": "/Beyond_Original_Orange_Chicken.png",
    "Black Pepper Sirloin Steak": "/Black_Pepper_Sirloin_Steak.png",
    "Honey Sesame Chicken Breast": "/Honey_Sesame_Chicken_Breast.png",
    "Honey Walnut Shrimp": "/Honey_Walnut_Shrimp.png",
    "Hot Ones Blazing Bourbon Chicken": "/Hot_Ones_Blazing_Bourbon_Chicken.png",
    "Kung Pao Chicken": "/Kung_Pao_Chicken.png",
    "String Bean Chicken Breast": "/String_Bean_Chicken_Breast.png",
    "Sweet Fire Chicken Breast": "/Sweet_Fire_Chicken_Breast.png",
    "Chicken Egg Roll": "/Chicken_Egg_Roll.avif",
    "Veggie Spring Roll": "/Veggie_Spring_Roll.avif",
    "Cream Cheese Rangoon": "/Cream_Cheese_Rangoon.avif",
    "Apple Pie Roll": "/Apple_Pie_Roll.avif",
    "Dr Pepper": "/Dr_Pepper.avif",
    "Coca Cola": "/Coca_Cola.avif",
    "Diet Coke": "/Diet_Coke.avif",
    "Mango Guava Flavored Tea": "/Mango_Guava_Flavored_Tea.avif",
    "Peach Lychee Flavored Refresher": "/Peach_Lychee_Flavored_Refresher.avif",
    "Pomegranate Pineapple Flavored Lemonade":
      "/Pomegranate_Pineapple_Flavored_Lemonade.avif",
    "Watermelon Mango Flavored Refresher":
      "/Watermelon_Mango_Flavored_Refresher.avif",
    "Barq's Root Beer": "/Barqs_Root_Beer.avif",
    "Fanta Orange": "/Fanta_Orange.avif",
    "Minute Maid Lemonade": "/Minute_Maid_Lemonade.avif",
    "Powerade Mountain Berry Blast": "/Powerade_Mountain_Berry_Blast.avif",
    Sprite: "/Sprite.avif",
    "Coca Cola Cherry": "/Coca_Cola_Cherry.avif",
    "Fuze Raspberry Iced Tea": "/Fuze_Raspberry_Iced_Tea.avif",
    "Powerade Fruit Punch": "/Powerade_Fruit_Punch.avif",
    Dasani: "/Dasani.avif",
    "Minute Maid Apple Juice": "/Minute_Maid_Apple_Juice.avif",
    "Coke Mexico": "/Coke_Mexico.avif",
    "Coke Zero": "/Coke_Zero.avif",
    Smartwater: "/Smartwater.avif",
    Sauces: "/Sauce.png",
    "Soy Sauce": "/Soy_Sauce.png",
    "Sweet & Sour Sauce": "/Sweet_&_Sour_Sauce.png",
    "Teriyaki Sauce": "/Teriyaki_Sauce.png",
    "Chili Sauce": "/Chili_Sauce.png",
    "Hot Mustard": "/Hot_Mustard.png",
    default: "/logo.png", // Default image if no match is found
  };

  const getItemImage = (itemName) => {
    return imageMap[itemName] || imageMap.default;
  };

  const removeItem = (indexToRemove) => {
    const confirmed = window.confirm(text.deleteItem);
    if (!confirmed) return;

    const updatedOrderList = [...orderList];

    // Check if the item is part of a Bowl, Plate, or Bigger Plate combo
    const item = updatedOrderList[indexToRemove];

    // If the item is a main combo item, delete it and its sides/entrees
    if (
      item.name === "Bowl" ||
      item.name === "Plate" ||
      item.name === "Bigger Plate"
    ) {
      const sideCount = 1;
      const entreeCount =
        item.name === "Bowl" ? 1 : item.name === "Plate" ? 2 : 3;
      updatedOrderList.splice(indexToRemove, 1 + sideCount + entreeCount);
    } else {
      // If the item is not part of a combo, check if it belongs to a previous combo
      let mainIndex = -1;
      for (let i = indexToRemove - 1; i >= 0; i--) {
        const prevItem = updatedOrderList[i];
        if (
          prevItem.name === "Bowl" ||
          prevItem.name === "Plate" ||
          prevItem.name === "Bigger Plate"
        ) {
          mainIndex = i;
          break;
        }
      }

      if (
        mainIndex !== -1 &&
        indexToRemove > mainIndex &&
        indexToRemove <=
          mainIndex +
            1 +
            (updatedOrderList[mainIndex].name === "Bowl"
              ? 1
              : updatedOrderList[mainIndex].name === "Plate"
              ? 2
              : 3)
      ) {
        // If the item is part of the combo, remove the whole combo
        const mainItem = updatedOrderList[mainIndex];
        const sideCount = 1;
        const entreeCount =
          mainItem.name === "Bowl" ? 1 : mainItem.name === "Plate" ? 2 : 3;
        updatedOrderList.splice(mainIndex, 1 + sideCount + entreeCount);
      } else {
        // Otherwise, treat it as a standalone item and remove it
        updatedOrderList.splice(indexToRemove, 1);
      }
    }

    setOrderList(updatedOrderList);
  };

  const [transactionType, setTransactionType] = useState(""); // Track selected payment method
  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value); // Update the selected payment method
  };

  const consolidateOrderList = (orderList) => {
    const consolidated = {};
  
    orderList.forEach((item) => {
      if (consolidated[item.name]) {
        // If the item already exists, add its quantity
        consolidated[item.name].quantity += item.quantity;
      } else {
        // Otherwise, add it as a new entry
        consolidated[item.name] = { ...item };
      }
    });
  
    // Convert the object back to an array
    return Object.values(consolidated);
  };

  const handleCheckout = async () => {

    if (orderList.length === 0) {
      alert(text.pleaseadditems);
      return;
    }

    if (!transactionType) {
      alert(text.selectPayment);
      return;
    }

    const confirmed = window.confirm(
      text.proceedToCheckout
    );
    if (confirmed) {
      const consolidatedOrderList = consolidateOrderList(orderList); // Consolidate duplicates
      const totalCost = calculateTotalPrice() * 1.06;
  
      try {
        const response = await axios.post(`${backendURL}/kiosk/order`, {
          totalCost,
          transactionType,
          orderList: consolidatedOrderList, // Use the consolidated list
        });
  
        if (response.status === 200) {
          alert(text.confirmation);
          clearOrderCheckout(); // Clears the local order list
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("There was an error processing your order. Please try again.");
      }
      navigate("/");
    }
  };
  

  const navigate = useNavigate(); // Initialize the navigate function
  const goToCustomerPage = () => {
    navigate("/customer"); // Navigate to the customer page
  };

  const calculateTotalPrice = () => {
    let total = 0;

    for (let index = 0; index < orderList.length; index++) {
      const item = orderList[index];

      // Add the total price for the item
      total += getItemTotalPrice(item, index);

      // Skip over sides and entrees for combos
      if (
        item.name === "Bowl" ||
        item.name === "Plate" ||
        item.name === "Bigger Plate"
      ) {
        const sideCount = 1;
        const entreeCount =
          item.name === "Bowl" ? 1 : item.name === "Plate" ? 2 : 3;
        index += sideCount + entreeCount; // Adjust index to skip sides/entrees
      }
    }

    return total;
  };

  return (
    <div className="background">
      <h2 className="page-title">{text.currentOrder}</h2>

      <div className="container">
        <div className="order-summary">
          <button className="add-more" onClick={goToCustomerPage}>
            + {text.addMore}
          </button>
          <button className="add-more-2" onClick={clearOrder}>
            {text.removeAll}
          </button>
          <br></br><br></br>
          <h2>{text.currentOrder}</h2>


          {orderList.length > 0 ? (
            (() => {
              const items = [];
              for (let index = 0; index < orderList.length; index++) {
                const item = orderList[index];

                if (
                  item.name === "Bowl" ||
                  item.name === "Plate" ||
                  item.name === "Bigger Plate"
                ) {
                  const sideCount = 1;
                  const entreeCount =
                    item.name === "Bowl" ? 1 : item.name === "Plate" ? 2 : 3;
                  const sidesAndEntrees = orderList.slice(
                    index + 1,
                    index + 1 + sideCount + entreeCount
                  );

                  const sides = sidesAndEntrees.slice(0, sideCount);
                  const entrees = sidesAndEntrees.slice(sideCount);

                  items.push(
                    <div className="order-item" key={index}>
                      <img
                        src={getItemImage(item.name)}
                        alt={item.name}
                        className="order-item-image"
                      />
                      <div className="item-details">
                        {/* Name and Price */}
                        <div className="item-row">
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">
                            ${getItemTotalPrice(item).toFixed(2)}
                          </span>
                        </div>

                        {/* Sides and Entrees */}
                        <div className="item-sides-entrees">
                          {sides.length > 0 && (
                            <>
                              <h4>Sides</h4>
                              <ul>
                                {sides.map((side, sideIndex) => (
                                  <li key={sideIndex}>{side.name}</li>
                                ))}
                              </ul>
                            </>
                          )}
                          {entrees.length > 0 && (
                            <>
                              <h4>Entrees</h4>
                              <ul>
                                {entrees.map((entree, entreeIndex) => (
                                  <li key={entreeIndex}>{entree.name}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="item-row">
                          <button
                            className="remove-button"
                            onClick={() => removeItem(index)}
                          >
                            {text.remove}
                          </button>
                          {!(item.name === "Bowl" || item.name === "Plate" || item.name === "Bigger Plate") ? (
                            <div className="quantity-selector">
                              <button onClick={() => decrementQuantity(index)}>-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => incrementQuantity(index)}>+</button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                  index += sideCount + entreeCount; // Skip over sides and entrees in the order list
                } else {
                  items.push(
                    <div className="order-item" key={index}>
                      <img
                        src={getItemImage(item.name)}
                        alt={item.name}
                        className="order-item-image"
                      />
                      <div className="item-details">
                        <div className="item-row">
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">
                            ${getItemTotalPrice(item).toFixed(2)}
                          </span>
                        </div>
                        <div className="item-row">
                          <button
                            className="remove-button"
                            onClick={() => removeItem(index)}
                          >
                            {text.remove}
                          </button>
                          <div className="quantity-selector">
                            <button onClick={() => decrementQuantity(index)}>
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => incrementQuantity(index)}>
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              return items;
            })()
          ) : (
            <p>{text.noItems}</p>
          )}
        </div>

        <div className="pickup-details">
          <h3>{text.additionalRequests}</h3>
          <div className="additional-requests">
            <label>
              <input type="checkbox" /> {text.utensils}
            </label>
            <label>
              <input type="checkbox" /> {text.napkins}
            </label>
          </div>
          <br />
          <br />
          <h3>{text.paymentMethod}</h3>
          <br />
          <div className="payment-method">
          <label>
            <input
              type="radio"
              name="payment"
              value="Credit/Debit"
              onChange={handleTransactionTypeChange}
              checked={transactionType === "Credit/Debit"}
            />
            {text.creditDebit}
          </label>
          <br />
          <br />
          <label>
            <input
              type="radio"
              name="payment"
              value="Gift Card"
              onChange={handleTransactionTypeChange}
              checked={transactionType === "Gift Card"}
            />
            {text.giftCard}
          </label>
          </div>
          <br />
          <br />
          <div className="total-price">
            <h3>{text.subtotal} ${calculateTotalPrice().toFixed(2)}</h3>
            <br />
            <h3>{text.tax} (6%): ${(calculateTotalPrice() * 0.06).toFixed(2)}</h3>
            <br />
            <h3>{text.total}: ${(calculateTotalPrice() * 1.06).toFixed(2)}</h3>
            <br />
          </div>
          <br />
          <button className="checkout-order" onClick={handleCheckout}>
            {text.checkout}
          </button>
        </div>
      </div>
      <div className="weather-recommendation">
        <h3 style={{ backgroundColor : temperatureColor}}>
          <br/><br/>
          {text.recommendation} <br/>{text.based}<br/> {text.on}<br/> {text.Today}<br/> {text.Weather}  
        </h3>
        <h1 style={{ color: temperatureColor}}>
          <br/>
          {weather !== null ? `${weather}°F` : "Loading..."} <br/> {weatherIcon}
        </h1>
        <div className="recommended-items">
        {recommendedItems.map((item) => (
          <div
            key={item}
            className="recommended-item-container"
            onClick={() => addRecommendedItemToOrder(item)} // Add click handler
          >
            <div className="recommended-item">
              <img
                src={getItemImage(item)}
                alt={item}
                className="recommended-item-image"
              />
              <div className="recommended-item-text">
                <span>{item}</span>
              </div>
            </div>
            <div className="hover-text" style={{
          backgroundColor: hexToRgba(temperatureColor, 0.85), // Dynamically set background color
        }}>{text.clickToAdd}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};


export default OrderPage;
