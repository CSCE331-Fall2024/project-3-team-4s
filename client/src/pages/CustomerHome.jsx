import React, { useEffect, useState } from "react";
import "./CustomerHome.css";

import AppetizerModal from "../components/AppetizerModal";
import SideModal from "../components/SideModal";
import EntreeModal from "../components/EntreeModal";
import DrinkModal from "../components/DrinkModal";
import BottomBar from "../components/BottomBar";
import { useOrder } from "./OrderContext";

import Bowl from "../../public/Bowl.avif";
import Plate from "../../public/Plate.avif";
import Bigger_Plate from "../../public/Bigger_Plate.avif";
import Appetizer from "../../public/Appetizer.avif";
import A_La_Carte_Side from "../../public/A_La_Carte_Side.avif";
import A_La_Carte_Entree from "../../public/A_La_Carte_Entree.avif";
import Drink from "../../public/Drink.avif";
import logo from "../../public/logo.png";
import Chow_Mein from "../../public/Chow_Mein.png";
import Super_Greens from "../../public/Super_Greens.png";
import White_Rice from "../../public/White_Rice.png";
import Fried_Rice from "../../public/Fried_Rice.png";
import Beijing_Beef from "../../public/Beijing_Beef.png";
import The_Original_Orange_Chicken from "../../public/The_Original_Orange_Chicken.png";
import Broccoli_Beef from "../../public/Broccoli_Beef.png";
import Mushroom_Chicken from "../../public/Mushroom_Chicken.png";
import Grilled_Teriyaki_Chicken from "../../public/Grilled_Teriyaki_Chicken.png";
import Beyond_Original_Orange_Chicken from "../../public/Beyond_Original_Orange_Chicken.png";
import Black_Pepper_Sirloin_Steak from "../../public/Black_Pepper_Sirloin_Steak.png";
import Honey_Sesame_Chicken_Breast from "../../public/Honey_Sesame_Chicken_Breast.png";
import Honey_Walnut_Shrimp from "../../public/Honey_Walnut_Shrimp.png";
import Hot_Ones_Blazing_Bourbon_Chicken from "../../public/Hot_Ones_Blazing_Bourbon_Chicken.png";
import Kung_Pao_Chicken from "../../public/Kung_Pao_Chicken.png";
import String_Bean_Chicken_Breast from "../../public/String_Bean_Chicken_Breast.png";
import Sweet_Fire_Chicken_Breast from "../../public/Sweet_Fire_Chicken_Breast.png";
import Chicken_Egg_Roll from "../../public/Chicken_Egg_Roll.avif";
import Veggie_Spring_Roll from "../../public/Veggie_Spring_Roll.avif";
import Cream_Cheese_Rangoon from "../../public/Cream_Cheese_Rangoon.avif";
import Apple_Pie_Roll from "../../public/Apple_Pie_Roll.avif";
import Dr_Pepper from "../../public/Dr_Pepper.avif";
import Coca_Cola from "../../public/Coca_Cola.avif";
import Diet_Coke from "../../public/Diet_Coke.avif";
import Mango_Guava_Flavored_Tea from "../../public/Mango_Guava_Flavored_Tea.avif";
import Peach_Lychee_Flavored_Refresher from "../../public/Peach_Lychee_Flavored_Refresher.avif";
import Pomegranate_Pineapple_Flavored_Lemonade from "../../public/Pomegranate_Pineapple_Flavored_Lemonade.avif";
import Watermelon_Mango_Flavored_Refresher from "../../public/Watermelon_Mango_Flavored_Refresher.avif";
import Barqs_Root_Beer from "../../public/Barqs_Root_Beer.avif";
import Fanta_Orange from "../../public/Fanta_Orange.avif";
import Minute_Maid_Lemonade from "../../public/Minute_Maid_Lemonade.avif";
import Powerade_Mountain_Berry_Blast from "../../public/Powerade_Mountain_Berry_Blast.avif";
import Sprite from "../../public/Sprite.avif";
import Coca_Cola_Cherry from "../../public/Coca_Cola_Cherry.avif";
import Fuze_Raspberry_Iced_Tea from "../../public/Fuze_Raspberry_Iced_Tea.avif";
import Powerade_Fruit_Punch from "../../public/Powerade_Fruit_Punch.avif";
import Dasani from "../../public/Dasani.avif";
import Minute_Maid_Apple_Juice from "../../public/Minute_Maid_Apple_Juice.avif";
import Coke_Mexico from "../../public/Coke_Mexico.avif";
import Coke_Zero from "../../public/Coke_Zero.avif";
import Smartwater from "../../public/Smartwater.avif";

const imageMap = {
  Bowl: { image: Bowl, description: "1 Side & 1 Entree" },
  Plate: { image: Plate, description: "1 Side & 2 Entree" },
  "Bigger Plate": { image: Bigger_Plate, description: "1 Side & 3 Entree" },
  Appetizer: {
    image: Appetizer,
    description: "Choose from a variety of appetizers.",
  },
  "A La Carte Side": {
    image: A_La_Carte_Side,
    description: "Side options available à la carte.",
  },
  "A La Carte Entree": {
    image: A_La_Carte_Entree,
    description: "Individual entrees served à la carte.",
  },
  Drinks: { image: Drink, description: "A selection of refreshing beverages." },
  "Chow Mein": { image: Chow_Mein, description: "600 cal" },
  "Super Greens": { image: Super_Greens, description: "130 cal" },
  "White Rice": { image: White_Rice, description: "520 cal" },
  "Fried Rice": { image: Fried_Rice, description: "620 cal" },
  "Beijing Beef": { image: Beijing_Beef, description: "480 cal" },
  "The Original Orange Chicken": {
    image: The_Original_Orange_Chicken,
    description: "510 cal",
  },
  "Broccoli Beef": { image: Broccoli_Beef, description: "150 cal" },
  "Mushroom Chicken": { image: Mushroom_Chicken, description: "220 cal" },
  "Grilled Teriyaki Chicken": {
    image: Grilled_Teriyaki_Chicken,
    description: "275 cal",
  },
  "Beyond Original Orange Chicken": {
    image: Beyond_Original_Orange_Chicken,
    description: "+1.50 | 440 cal",
  },
  "Black Pepper Sirloin Steak": {
    image: Black_Pepper_Sirloin_Steak,
    description: "+1.50 | 180 cal",
  },
  "Honey Sesame Chicken Breast": {
    image: Honey_Sesame_Chicken_Breast,
    description: "340 cal",
  },
  "Honey Walnut Shrimp": {
    image: Honey_Walnut_Shrimp,
    description: "+1.50 | 430 cal",
  },
  "Hot Ones Blazing Bourbon Chicken": {
    image: Hot_Ones_Blazing_Bourbon_Chicken,
    description: "400 cal",
  },
  "Kung Pao Chicken": { image: Kung_Pao_Chicken, description: "320 cal" },
  "String Bean Chicken Breast": {
    image: String_Bean_Chicken_Breast,
    description: "210 cal",
  },
  "Sweet Fire Chicken Breast": {
    image: Sweet_Fire_Chicken_Breast,
    description: "380 cal",
  },
  "Chicken Egg Roll": { image: Chicken_Egg_Roll, description: "" },
  "Veggie Spring Roll": { image: Veggie_Spring_Roll, description: "" },
  "Cream Cheese Rangoon": { image: Cream_Cheese_Rangoon, description: "" },
  "Apple Pie Roll": { image: Apple_Pie_Roll, description: "" },
  "Dr Pepper": { image: Dr_Pepper, description: "" },
  "Coca Cola": { image: Coca_Cola, description: "" },
  "Diet Coke": { image: Diet_Coke, description: "" },
  "Mango Guava Flavored Tea": {
    image: Mango_Guava_Flavored_Tea,
    description: "",
  },
  "Peach Lychee Flavored Refresher": {
    image: Peach_Lychee_Flavored_Refresher,
    description: "",
  },
  "Pomegranate Pineapple Flavored Lemonade": {
    image: Pomegranate_Pineapple_Flavored_Lemonade,
    description: "",
  },
  "Watermelon Mango Flavored Refresher": {
    image: Watermelon_Mango_Flavored_Refresher,
    description: "",
  },
  "Barqs Root Beer": { image: Barqs_Root_Beer, description: "" },
  "Fanta Orange": { image: Fanta_Orange, description: "" },
  "Minute Maid Lemonade": { image: Minute_Maid_Lemonade, description: "" },
  "Powerade Mountain Berry Blast": {
    image: Powerade_Mountain_Berry_Blast,
    description: "",
  },
  Sprite: { image: Sprite, description: "" },
  "Coca Cola Cherry": { image: Coca_Cola_Cherry, description: "" },
  "Fuze Raspberry Iced Tea": {
    image: Fuze_Raspberry_Iced_Tea,
    description: "",
  },
  "Powerade Fruit Punch": { image: Powerade_Fruit_Punch, description: "" },
  Dasani: { image: Dasani, description: "" },
  "Minute Maid Apple Juice": {
    image: Minute_Maid_Apple_Juice,
    description: "",
  },
  "Coke Mexico": { image: Coke_Mexico, description: "" },
  "Coke Zero": { image: Coke_Zero, description: "" },
  Smartwater: { image: Smartwater, description: "" },
};

const displayOrder = [
  "Bowl",
  "Plate",
  "Bigger Plate",
  "Appetizer",
  "A La Carte Side",
  "A La Carte Entree",
  "Drink",
];

const CustomerHome = () => {
  const { addToOrder } = useOrder();
  const [menuItems, setMenuItems] = useState([]);
  const [sides, setSides] = useState([]); // Store sides here
  const [entrees, setEntrees] = useState([]); // Store entrees here
  const [appetizers, setAppetizers] = useState([]); // State for appetizers
  const [drinks, setDrinks] = useState([]); // State for drinks
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSides, setSelectedSides] = useState([]); // Track selected sides
  const [selectedEntrees, setSelectedEntrees] = useState([]); // Track selected entrees and their counts
  const [selectedAppetizer, setSelectedAppetizer] = useState(null);
  const [selectedEntree, setSelectedEntree] = useState(null); // State for selected entree
  const [isEntreeModalOpen, setIsEntreeModalOpen] = useState(false); // State for modal visibility
  const [selectedSide, setSelectedSide] = useState(null); // State to track the selected side for the modal
  const [selectedDrink, setSelectedDrink] = useState(null); // State for selected drink
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false); // Drink modal visibility

  useEffect(() => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${backendURL}/kiosk/meal-types`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();

        // Consolidate drinks items into a single "Drinks" item
        const drinksNames = ["Refresher", "Drink", "Bottle"];
        const drinksItem = {
          menu_item_id: "drinks",
          item_name: "Drinks",
          item_price: 2.1,
        };

        // Filter out individual drinks, entrees, and sides, and add consolidated items
        data = data.filter((item) => !drinksNames.includes(item.item_name));
        data.push(drinksItem);

        // Sort data according to displayOrder, pushing unmatched items to the end
        data.sort((a, b) => {
          const indexA = displayOrder.indexOf(a.item_name);
          const indexB = displayOrder.indexOf(b.item_name);

          return (
            (indexA === -1 ? displayOrder.length : indexA) -
            (indexB === -1 ? displayOrder.length : indexB)
          );
        });

        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Fetch sides when an item is selected
  const fetchSides = async () => {
    try {
      const response = await fetch(`${backendURL}/kiosk/sides`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSides(data);
    } catch (error) {
      console.error("Error fetching sides:", error);
    }
  };

  // Fetch entrees when an item is selected
  const fetchEntrees = async () => {
    try {
      const response = await fetch(`${backendURL}/kiosk/entrees`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Sort entrees by menu_item_id in descending order
      const sortedEntrees = data.sort(
        (a, b) => b.menu_item_id - a.menu_item_id
      );
      setEntrees(sortedEntrees);
    } catch (error) {
      console.error("Error fetching entrees:", error);
    }
  };

  const fetchAppetizers = async () => {
    try {
      const response = await fetch(`${backendURL}/kiosk/appetizers`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAppetizers(data);
    } catch (error) {
      console.error("Error fetching appetizers:", error);
    }
  };

  const fetchDrinks = async () => {
    try {
      const response = await fetch(`${backendURL}/kiosk/drinks`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDrinks(data);
    } catch (error) {
      console.error("Error fetching drinks:", error);
    }
  };

  const handleMenuItemClick = (item) => {
    setSelectedItem(item);

    if (item.item_name === "Appetizer") {
      fetchAppetizers();
    } else if (item.item_name === "A La Carte Side") {
      fetchSides();
      setEntrees([]);
      setDrinks([]);
    } else if (item.item_name === "A La Carte Entree") {
      fetchEntrees();
      setSides([]);
      setDrinks([]);
    } else if (item.item_name === "Drinks") {
      fetchDrinks(); // Load only drinks
      setSides([]);
      setEntrees([]);
    } else {
      fetchSides();
      fetchEntrees();
    }

    if (item.item_name === "Bowl") {
      fetchSides();
      fetchEntrees();
      setSelectedSides([]); // Reset selected sides
      setSelectedEntrees([]); // Reset selected entrees
    }
  };
  const resetSelections = () => {
    setSelectedSides([]);
    setSelectedEntrees([]);
    setSelectedItem(null);
  };

  const handleSideSelect = (side) => {
    if (selectedSides.includes(side)) {
      // Deselect if the side is already selected
      setSelectedSides(selectedSides.filter((s) => s !== side));
    } else if (selectedSides.length < 2) {
      // Add the side if less than two sides are selected
      setSelectedSides([...selectedSides, side]);
    }
  };

  const maxEntrees =
    selectedItem?.item_name === "Plate"
      ? 2
      : selectedItem?.item_name === "Bigger Plate"
      ? 3
      : 1;

  const handleEntreeSelect = (entree) => {
    const entreeIndex = selectedEntrees.findIndex((e) => e.item === entree);

    if (selectedItem.item_name === "Bowl") {
      // For "Bowl," if the item is already selected, deselect it
      if (entreeIndex !== -1) {
        setSelectedEntrees([]);
      } else {
        // Add the selected entree since it's not yet selected
        setSelectedEntrees([{ item: entree, count: 1 }]);
      }
    } else {
      if (entreeIndex !== -1) {
        // If the entree is already selected, increase its count up to the max per item limit
        const newSelectedEntrees = [...selectedEntrees];
        const maxPerItem = selectedItem.item_name === "Bigger Plate" ? 3 : 2;

        // Ensure not to exceed the max per item limit or max total count
        if (
          newSelectedEntrees[entreeIndex].count < maxPerItem &&
          selectedEntrees.reduce((acc, e) => acc + e.count, 0) < maxEntrees
        ) {
          newSelectedEntrees[entreeIndex].count += 1;
          setSelectedEntrees(newSelectedEntrees);
        }
      } else if (
        selectedEntrees.reduce((acc, e) => acc + e.count, 0) < maxEntrees
      ) {
        // Add a new entree if there’s room for more selections
        setSelectedEntrees([...selectedEntrees, { item: entree, count: 1 }]);
      }
    }
  };

  const handleAppetizerClick = (appetizer) => {
    setSelectedAppetizer({
      name: appetizer.item_name,
      image: imageMap[appetizer.item_name]?.image,
      price: 2.0,
      sauces: [
        { name: "Soy Sauce" },
        { name: "Sweet & Sour Sauce" },
        { name: "Chili Sauce" },
        { name: "Teriyaki Sauce" },
        { name: "Hot Mustard" },
      ],
    });
  };

  const closeAppetizerModal = () => setSelectedAppetizer(null);

  const handleSideClick = (side) => {
    setSelectedSide({
      name: side.item_name,
      image: imageMap[side.item_name]?.image,
      price: 4.4,
    });
  };

  const handleEntreeClick = (entree) => {
    setSelectedEntree({
      name: entree.item_name,
      image: imageMap[entree.item_name]?.image,
      price: 5.2,
    });
    setIsEntreeModalOpen(true);
  };

  const closeEntreeModal = () => {
    setSelectedEntree(null);
    setIsEntreeModalOpen(false); // Close the modal
  };

  const closeSideModal = () => {
    setSelectedSide(null);
  };

  const handleDrinkClick = async (drink) => {
    let price;

    if (drink.item_category === "Bottle") {
      // Use the price of the selected drink
      price = drink.item_price;
    } else if (drink.item_category === "Drink") {
      // Use a fixed price for drinks
      price = 2.3;
    } else if (drink.item_category === "Refresher") {
      // Use a fixed price for refreshers
      price = 3.2;
    } else {
      price = 0;
    }

    setSelectedDrink({
      name: drink.item_name,
      image: imageMap[drink.item_name]?.image,
      price: price, // Set the determined price
    });
    setIsDrinkModalOpen(true);
  };

  const closeDrinkModal = () => {
    setSelectedDrink(null);
    setIsDrinkModalOpen(false);
  };

  const handleBackToMenu = () => {
    setSelectedItem(null);
    setSides([]);
    setEntrees([]);
    setAppetizers([]);
    setDrinks([]);
    setSelectedSides([]); // Reset selected sides
    setSelectedEntrees([]); // Reset selected entrees
    resetSelections();
  };

  const sortedItems = [...menuItems].sort(
    (a, b) =>
      displayOrder.indexOf(a.item_name) - displayOrder.indexOf(b.item_name)
  );

  return (
    <div className="background">
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <a href="/">Home</a>
          <span className="divider">|</span>
          <a href="#">About</a>
          <span className="divider">|</span>
          <a href="#">Services</a>
          <span className="divider">|</span>
          <a href="/order">Our Rewards</a>
        </div>
        <div className="navbar-actions">
          <button className="navbar-button">
            <a href="/order">ORDER</a>
          </button>
          <span role="img" aria-label="user" className="navbar-icon">
            👤
          </span>
        </div>
      </div>

      <h2 className="order-heading">
        {selectedItem
          ? `Customize your ${selectedItem.item_name}`
          : "Choose your meal type to start your order"}
      </h2>

      <div className="menu-container">
        {!selectedItem ? (
          menuItems.map((item) => (
            <div
              key={item.menu_item_id}
              className="menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              <img
                src={imageMap[item.item_name]?.image || logo}
                alt={item.item_name}
                className="menu-item-image"
              />
              <h2>{item.item_name}</h2>
              <p className="image_description">
                {imageMap[item.item_name]?.description}
              </p>
              <p className="image_price">
                $
                {item.item_name === "Drink"
                  ? "2.10"
                  : item.item_price.toFixed(2)}{" "}
                +
              </p>
            </div>
          ))
        ) : selectedItem.item_name === "Appetizer" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">
              Back to Menu
            </button>
            <h3>Select an Appetizer</h3>
            <div className="appetizers-container">
              {appetizers.map((appetizer) => (
                <div
                  key={appetizer.menu_item_id}
                  className="menu-item"
                  onClick={() => handleAppetizerClick(appetizer)}
                >
                  <img
                    src={imageMap[appetizer.item_name]?.image || logo}
                    alt={appetizer.item_name}
                    className="menu-item-image"
                  />
                  <h2>{appetizer.item_name}</h2>
                </div>
              ))}
            </div>
            <AppetizerModal
              appetizer={selectedAppetizer}
              onClose={closeAppetizerModal}
              addToOrder={addToOrder}
            />
          </div>
        ) : selectedItem.item_name === "A La Carte Side" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">
              Back to Menu
            </button>
            <h3>Choose Your Side</h3>
            <div className="sides-container">
              {sides.map((side) => (
                <div
                  key={side.menu_item_id}
                  className="menu-item"
                  onClick={() => handleSideClick(side)} // Call handleSideClick here
                >
                  <img
                    src={imageMap[side.item_name]?.image || logo}
                    alt={side.item_name}
                    className="menu-item-image"
                  />
                  <h2>{side.item_name}</h2>
                  <p className="image_description">
                    {imageMap[side.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
            {selectedSide && (
              <SideModal
                side={selectedSide}
                onClose={closeSideModal}
                addToOrder={addToOrder}
              />
            )}
          </div>
        ) : selectedItem.item_name === "A La Carte Entree" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">
              Back to Menu
            </button>
            <h3>Choose Your Entree</h3>
            <div className="entrees-container">
              {entrees.map((entree) => (
                <div
                  key={entree.menu_item_id}
                  className="menu-item"
                  onClick={() => handleEntreeClick(entree)}
                >
                  <img
                    src={imageMap[entree.item_name]?.image || logo}
                    alt={entree.item_name}
                    className="menu-item-image"
                  />
                  <h2>{entree.item_name}</h2>
                  <p className="image_description">
                    {imageMap[entree.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
            {isEntreeModalOpen && selectedEntree && (
              <EntreeModal
                entree={selectedEntree}
                onClose={closeEntreeModal}
                addToOrder={addToOrder}
              />
            )}
          </div>
        ) : selectedItem.item_name === "Drinks" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">
              Back to Menu
            </button>
            <h3>Select Your Drink</h3>
            <div className="drinks-container">
              {drinks.map((drink) => (
                <div
                  key={drink.menu_item_id}
                  className="menu-item"
                  onClick={() => handleDrinkClick(drink)}
                >
                  <img
                    src={imageMap[drink.item_name]?.image || logo}
                    alt={drink.item_name}
                    className="menu-item-image"
                  />
                  <h2>{drink.item_name}</h2>
                  <p className="image_description">
                    {imageMap[drink.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
            {isDrinkModalOpen && selectedDrink && (
              <DrinkModal
                drink={selectedDrink}
                onClose={closeDrinkModal}
                addToOrder={addToOrder}
              />
            )}
          </div>
        ) : (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">
              Back to Menu
            </button>

            <h3>Step 1: Choose Your Side</h3>
            <div className="sides-container">
              {sides.map((side) => (
                <div
                  key={side.menu_item_id}
                  className={`menu-item ${
                    selectedSides.length === 2 && !selectedSides.includes(side)
                      ? "unselected"
                      : ""
                  } ${selectedSides.includes(side) ? "selected" : ""}`}
                  onClick={() => handleSideSelect(side)}
                >
                  <img
                    src={imageMap[side.item_name]?.image || logo}
                    alt={side.item_name}
                    className="menu-item-image"
                  />
                  <h2>{side.item_name}</h2>
                  <p className="image_description">
                    {imageMap[side.item_name]?.description}
                  </p>
                  {selectedSides.includes(side) && (
                    <p className="selection-count">
                      {selectedSides.length === 1 ? "1" : "1/2"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <h3>Step 2: Choose Your Entree</h3>
            <div className="entrees-container">
              {entrees.map((entree) => {
                const entreeData = selectedEntrees.find(
                  (e) => e.item === entree
                );
                const itemsSelected = selectedEntrees.length; // Number of distinct entrees selected

                return (
                  <div
                    key={entree.menu_item_id}
                    className={`menu-item ${
                      itemsSelected === maxEntrees && !entreeData
                        ? "unselected"
                        : ""
                    } ${entreeData ? "selected" : ""}`}
                    onClick={() => handleEntreeSelect(entree)}
                  >
                    <img
                      src={imageMap[entree.item_name]?.image || logo}
                      alt={entree.item_name}
                      className="menu-item-image"
                    />
                    <h2>{entree.item_name}</h2>
                    <p className="image_description">
                      {imageMap[entree.item_name]?.description}
                    </p>
                    {entreeData && (
                      <p className="selection-count">{entreeData.count}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {selectedItem &&
        ["Bowl", "Plate", "Bigger Plate"].includes(selectedItem.item_name) && (
          <BottomBar
            selectedItem={selectedItem}
            selectedSides={selectedSides}
            selectedEntrees={selectedEntrees}
            addToOrder={addToOrder}
            resetSelections={resetSelections}
          />
        )}
      {/* <OrderPage orderList={orderList} /> */}
    </div>
  );
};

export default CustomerHome;
