import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerHome.css";
import { useTranslate } from "../contexts/TranslateContext";
import { translate } from "../utils/translateUtil";
import he from "he";

import AppetizerModal from "../components/AppetizerModal";
import SideModal from "../components/SideModal";
import EntreeModal from "../components/EntreeModal";
import DrinkModal from "../components/DrinkModal";
import BottomBar from "../components/BottomBar";
import SauceModal from "../components/SauceModal";
import PopupNotification from "../components/PopupNotification";
import { useOrder } from "./OrderContext";
import Button from "../components/Button";

const imageMap = {
  Bowl: { image: "/bowl.avif", description: "1 Side & 1 Entree" },
  Plate: { image: "/plate.avif", description: "1 Side & 2 Entree" },
  "Bigger Plate": {
    image: "/Bigger_Plate.avif",
    description: "1 Side & 3 Entree",
  },
  Appetizer: {
    image: "/Appetizer.avif",
    description: "Choose from a variety of appetizers.",
  },
  "A La Carte Side": {
    image: "/A_La_Carte_Side.avif",
    description: "Side options available à la carte.",
  },
  "A La Carte Entree": {
    image: "/A_La_Carte_Entree.avif",
    description: "Individual entrees served à la carte.",
  },
  Drinks: {
    image: "/Drink.avif",
    description: "A selection of refreshing beverages.",
  },
  "Chow Mein": { image: "/Chow_Mein.png", description: "600 cal" },
  "Super Greens": { image: "/Super_Greens.png", description: "130 cal" },
  "White Rice": { image: "/White_Rice.png", description: "520 cal" },
  "Fried Rice": { image: "/Fried_Rice.png", description: "620 cal" },
  "Beijing Beef": { image: "/Beijing_Beef.png", description: "480 cal" },
  "The Original Orange Chicken": {
    image: "/The_Original_Orange_Chicken.png",
    description: "510 cal",
  },
  "Broccoli Beef": { image: "/Broccoli_Beef.png", description: "150 cal" },
  "Mushroom Chicken": {
    image: "/Mushroom_Chicken.png",
    description: "220 cal",
  },
  "Grilled Teriyaki Chicken": {
    image: "/Grilled_Teriyaki_Chicken.png",
    description: "275 cal",
  },
  "Beyond Original Orange Chicken": {
    image: "/Beyond_Original_Orange_Chicken.png",
    description: "+1.50 | 440 cal",
  },
  "Black Pepper Sirloin Steak": {
    image: "/Black_Pepper_Sirloin_Steak.png",
    description: "+1.50 | 180 cal",
  },
  "Honey Sesame Chicken Breast": {
    image: "/Honey_Sesame_Chicken_Breast.png",
    description: "340 cal",
  },
  "Honey Walnut Shrimp": {
    image: "/Honey_Walnut_Shrimp.png",
    description: "+1.50 | 430 cal",
  },
  "Hot Ones Blazing Bourbon Chicken": {
    image: "/Hot_Ones_Blazing_Bourbon_Chicken.png",
    description: "400 cal",
  },
  "Kung Pao Chicken": {
    image: "/Kung_Pao_Chicken.png",
    description: "320 cal",
  },
  "String Bean Chicken Breast": {
    image: "/String_Bean_Chicken_Breast.png",
    description: "210 cal",
  },
  "Sweet Fire Chicken Breast": {
    image: "/Sweet_Fire_Chicken_Breast.png",
    description: "380 cal",
  },
  "Chicken Egg Roll": { image: "/Chicken_Egg_Roll.avif", description: "" },
  "Veggie Spring Roll": { image: "/Veggie_Spring_Roll.avif", description: "" },
  "Cream Cheese Rangoon": {
    image: "/Cream_Cheese_Rangoon.avif",
    description: "",
  },
  "Apple Pie Roll": { image: "/Apple_Pie_Roll.avif", description: "" },
  "Dr Pepper": { image: "/Dr_Pepper.avif", description: "" },
  "Coca Cola": { image: "/Coca_Cola.avif", description: "" },
  "Diet Coke": { image: "/Diet_Coke.avif", description: "" },
  "Mango Guava Flavored Tea": {
    image: "/Mango_Guava_Flavored_Tea.avif",
    description: "",
  },
  "Peach Lychee Flavored Refresher": {
    image: "/Peach_Lychee_Flavored_Refresher.avif",
    description: "",
  },
  "Pomegranate Pineapple Flavored Lemonade": {
    image: "/Pomegranate_Pineapple_Flavored_Lemonade.avif",
    description: "",
  },
  "Watermelon Mango Flavored Refresher": {
    image: "/Watermelon_Mango_Flavored_Refresher.avif",
    description: "",
  },
  "Barqs Root Beer": { image: "/Barqs_Root_Beer.avif", description: "" },
  "Fanta Orange": { image: "/Fanta_Orange.avif", description: "" },
  "Minute Maid Lemonade": {
    image: "/Minute_Maid_Lemonade.avif",
    description: "",
  },
  "Powerade Mountain Berry Blast": {
    image: "/Powerade_Mountain_Berry_Blast.avif",
    description: "",
  },
  Sprite: { image: "/Sprite.avif", description: "" },
  "Coca Cola Cherry": { image: "/Coca_Cola_Cherry.avif", description: "" },
  "Fuze Raspberry Iced Tea": {
    image: "/Fuze_Raspberry_Iced_Tea.avif",
    description: "",
  },
  "Powerade Fruit Punch": {
    image: "/Powerade_Fruit_Punch.avif",
    description: "",
  },
  Dasani: { image: "/Dasani.avif", description: "" },
  "Minute Maid Apple Juice": {
    image: "/Minute_Maid_Apple_Juice.avif",
    description: "",
  },
  "Coke Mexico": { image: "/Coke_Mexico.avif", description: "" },
  "Coke Zero": { image: "/Coke_Zero.avif", description: "" },
  Smartwater: { image: "/Smartwater.avif", description: "" },
  Sauces: { image: "/sauce.png", description: "Choice of different blend of sauces" },
  "Soy Sauce": { image: "/Soy_Sauce.png", description: "" },
  "Sweet & Sour Sauce": { image: "/Sweet_&_Sour_Sauce.png", description: "" },
  "Chili Sauce": { image: "/Chili_Sauce.png", description: "" },
  "Teriyaki Sauce": { image: "/Teriyaki_Sauce.png", description: "" },
  "Hot Mustard": { image: "/Hot_Mustard.png", description: "" },
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
  // const backendURL = "http://localhost:3000";
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [menuItems, setMenuItems] = useState([]);
  const { language } = useTranslate(); // Get current language
  const logo = "/logo.png";
  const { popupDetails } = useOrder();

  const { addToOrder } = useOrder();
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
  const [selectedSauce, setSelectedSauce] = useState(null); // State for selected sauce
  const [isSauceModalOpen, setIsSauceModalOpen] = useState(false); // Modal visibility state
  const [sauces, setSauces] = useState([]); // State for sauces
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(null); // 'side' or 'entree'


  useEffect(() => {
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

  // Fetch sauces from backend
  const fetchSauces = async () => {
    try {
      const response = await fetch(`${backendURL}/kiosk/sauces`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSauces(data);
    } catch (error) {
      console.error("Error fetching sauces:", error);
    }
  };

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

  const [translations, setTranslations] = useState({
    pageHeading: "Choose your meal type to start your order",
    customizeHeading: "Customize your",
    goBack: "Go Back",
    backToMenu: "Back to Menu",
    bowlchooseSide: "Step 1 : Choose Your Side",
    bowlchooseEntree: "Step 2 : Choose Your Entree",
    selectSide: "Your Selected Side",
    selectEntree: "Your Selected Entree",
    chooseSide: "Choose Your Side",
    chooseEntree: "Choose Your Entree",
    chooseAppetizer: "Choose Your Appetizer",
    chooseDrink: "Choose Your Drink",
    chooseSauce: "Choose Your Sauce",
    itemNames: {}, // To store translated item names
    itemDescriptions: {}, // To store translated item descriptions
    viewOrder: "View Order",
    doSide: "Do you want to select the side",
    doEntree: "Do you want to select the entree",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const translatedTexts = {
          pageHeading: he.decode(
            await translate("Choose your meal type to start your order", language)
          ),
          customizeHeading: he.decode(await translate("Customize your", language)),
          goBack: he.decode(await translate("Go Back", language)),
          backToMenu: he.decode(await translate("Back to Menu", language)),
          chooseSide: he.decode(await translate("Step 1: Choose Your Side", language)),
          chooseEntree: he.decode(await translate("Step 2: Choose Your Entree", language)),
          chooseAppetizer: he.decode(await translate("Choose Your Appetizer", language)),
          chooseDrink: he.decode(await translate("Choose Your Drink", language)),
          chooseSauce: he.decode(await translate("Choose Your Sauce", language)),
          viewOrder: he.decode(await translate("View Order", language)),
          selectSide: he.decode(await translate("Your Selected Side", language)),
          selectEntree: he.decode(await translate("Your Selected Entree", language)),
          bowlchooseEntree: he.decode(await translate("Step 2: Choose Your Entree", language)),
          bowlchooseSide: he.decode(await translate("Step 1: Choose Your Side", language)),
          doSide: he.decode(await translate("Do you want to select the side", language)),
          doEntree: he.decode(await translate("Do you want to select the entree", language)),

        };

        // Translate menu item names and descriptions
        const itemTranslations = {};
        const descriptionTranslations = {};
        for (const item of menuItems) {
          const itemName = item.item_name;
          itemTranslations[itemName] = he.decode(await translate(itemName, language));
          descriptionTranslations[itemName] = he.decode(
            await translate(imageMap[item.item_name]?.description || "", language)
          );
        }

        const translateItems = async (items) => {
          const itemTranslations = {};
          for (const item of items) {
            const translatedName = await translate(item.item_name, language);
            itemTranslations[item.item_name] = he.decode(translatedName);
          }
          return itemTranslations;
        };

        const sideTranslations = await translateItems(sides);
      const entreeTranslations = await translateItems(entrees);
      const appetizerTranslations = await translateItems(appetizers);
      const drinkTranslations = await translateItems(drinks);
      const sauceTranslations = await translateItems(sauces);

      setTranslations({
        ...translatedTexts,
        itemNames: {
          ...itemTranslations,
          ...sideTranslations,
          ...entreeTranslations,
          ...appetizerTranslations,
          ...drinkTranslations,
          ...sauceTranslations,
        },
        itemDescriptions: {
          ...descriptionTranslations}
      });
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  };

  fetchTranslations();
}, [language, menuItems, sides, entrees, appetizers, drinks, sauces]);


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
    } else if (item.item_name === "Sauces") {
      fetchSauces(); // Fetch sauces
    } else {
      fetchSides();
      fetchEntrees();
    }

    if (["Bowl", "Plate", "Bigger Plate"].includes(item.item_name)) {
      setSelectedItem(item);
      fetchSides();
      setCurrentStep("side");
    }
  };

  const resetSelections = () => {
    setSelectedSides([]);
    setSelectedEntrees([]);
    setSelectedItem(null);
  };

  const handleSauceClick = (sauce) => {
    setSelectedSauce({
      name: sauce.item_name,
      image: imageMap[sauce.item_name]?.image || logo,
      price: sauce.item_price,
    });
    setIsSauceModalOpen(true); // Open the modal
  };

  const closeSauceModal = () => {
    setSelectedSauce(null);
    setIsSauceModalOpen(false); // Close the modal
  };

  const handleSideSelect = (side) => {
    const confirmSelection = window.confirm(
      `${translations.doSide} "${translations.itemNames[side.item_name] || side.item_name}"?`
    );
    if (confirmSelection) {
      setSelectedSides([...selectedSides, side]);
      setCurrentStep("entree"); // Move to the next step
      fetchEntrees();
    }
  };

  const maxEntrees =
    selectedItem?.item_name === "Plate"
      ? 2
      : selectedItem?.item_name === "Bigger Plate"
      ? 3
      : 1;

  const handleEntreeSelect = (entree) => {
    const confirmSelection = window.confirm(
      `${translations.doEntree} "${translations.itemNames[entree.item_name] || entree.item_name}"?`
    );
    if (confirmSelection) {
      setSelectedEntrees([
        ...selectedEntrees,
        { item: entree, count: 1 }, // Add the entree with a count
      ]);
      // Check if more entrees can be added
      const totalEntrees = selectedEntrees.reduce(
        (acc, e) => acc + e.count,
        1 // Include the current selection
      );
      if (totalEntrees >= maxEntrees) {
        setCurrentStep("complete"); // Mark the selection process complete
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

  const handleDrinkClick = (drink, event) => {
    const cursorX = event.clientX;
    const cursorY = event.clientY;

    let price;

    if (drink.item_category === "Bottle") {
      price = drink.item_price;
    } else if (drink.item_category === "Drink") {
      price = 2.3;
    } else if (drink.item_category === "Refresher") {
      price = 3.2;
    } else {
      price = 0;
    }

    setSelectedDrink({
      name: drink.item_name,
      image: imageMap[drink.item_name]?.image,
      price: price,
      position: { x: cursorX, y: cursorY }, // Pass the cursor position
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
    setSauces([]);
    setCurrentStep("complete");
  };

  const sortedItems = [...menuItems].sort(
    (a, b) =>
      displayOrder.indexOf(a.item_name) - displayOrder.indexOf(b.item_name)
  );

  return (
    <div className="background">
      <div className="nav-header">
        <h2 className="order-heading">
          {translations.pageHeading}
        </h2>
      </div>

      <Button text={translations.viewOrder} className="navbar-button" onClick={() => navigate("/order")} fontSize="32px">
      </Button> 

      <Button text={translations.backToMenu} className="navbar-button-2" onClick={() => navigate("/")} fontSize="32px">
      </Button>

      <PopupNotification popupDetails={popupDetails} />
      <br></br>
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
              <h2>{translations.itemNames[item.item_name] || item.item_name}</h2>
              <p className="image_description">
              {translations.itemDescriptions[item.item_name] ||
                imageMap[item.item_name]?.description}
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
        ) : currentStep === "side" ? (
          // Render sides step
          <div className="steps-container">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
            <h3>{translations.bowlchooseSide}</h3>
            <br></br><br></br><br></br><br></br>
            <div className="sides-container">
              {sides.map((side) => (
                <div
                  key={side.menu_item_id}
                  className="menu-item"
                  onClick={() => handleSideSelect(side)}
                >
                  <img
                    src={imageMap[side.item_name]?.image || logo}
                    alt={side.item_name}
                    className="menu-item-image"
                  />
                  <h2>{translations.itemNames[side.item_name] || side.item_name}</h2>
                  <p className="image_description">
                    {imageMap[side.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : currentStep === "entree" ? (
          // Render entrees step
          <div className="steps-container">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
            <h3>{translations.bowlchooseEntree}</h3>
            <br></br><br></br><br></br><br></br>
            <div className="entrees-container">
              {entrees.map((entree) => (
                <div
                  key={entree.menu_item_id}
                  className="menu-item"
                  onClick={() => handleEntreeSelect(entree)}
                >
                  <img
                    src={imageMap[entree.item_name]?.image || logo}
                    alt={entree.item_name}
                    className="menu-item-image"
                  />
                  <h2>{translations.itemNames[entree.item_name] || entree.item_name}</h2>
                  <p className="image_description">
                    {imageMap[entree.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : selectedItem.item_name === "Sauces" ? (
          <div className="steps-container">
            <div className="steps-header">
              <h3>{translations.chooseSauce}</h3>
              <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
            </div>
            
            <div className="drinks-container">
              {sauces.map((sauce) => (
                <div
                  key={sauce.menu_item_id}
                  className="menu-item"
                  onClick={() => handleSauceClick(sauce)}
                >
                  <img
                    src={imageMap[sauce.item_name]?.image || logo}
                    alt={sauce.item_name}
                    className="menu-item-image"
                  />
                  <h2>{translations.itemNames[sauce.item_name] || sauce.item_name}</h2>
                  <p className="image_price">${sauce.item_price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : selectedItem.item_name === "Appetizer" ? (
          <div className="steps-container">
            <div className="steps-header">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button>  
              <h3>{translations.chooseAppetizer}</h3>
            </div>
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
                  <h2>{translations.itemNames[appetizer.item_name] || appetizer.item_name}</h2>
                </div>
              ))}
            </div>
            <AppetizerModal
              appetizer={selectedAppetizer}
              onClose={closeAppetizerModal}
              addToOrder={addToOrder}
              resetSelections={resetSelections}
            />
          </div>
        ) : selectedItem.item_name === "A La Carte Side" ? (
          <div className="steps-container">
            <div className="steps-header">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
              <h3>{translations.chooseSide}</h3>
            </div>
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
                  <h2>{translations.itemNames[side.item_name] || side.item_name}</h2>
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
                resetSelections={resetSelections}
              />
            )}
          </div>
        ) : selectedItem.item_name === "A La Carte Entree" ? (
          <div className="steps-container">
            <div className="steps-header">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
              <h3>{translations.chooseEntree}</h3>
            </div>
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
                  <h2>{translations.itemNames[entree.item_name] || entree.item_name}</h2>
                  <p className="image_description">
                    {imageMap[entree.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : selectedItem.item_name === "Drinks" ? (
          <div className="steps-container">
            <div className="steps-header">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
              <h3>{translations.chooseDrink}</h3>
            </div>
            <div className="drinks-container">
              {drinks.map((drink) => (
                <div
                  key={drink.menu_item_id}
                  className="menu-item"
                  onClick={(eve) => handleDrinkClick(drink, event)}
                >
                  <img
                    src={imageMap[drink.item_name]?.image || logo}
                    alt={drink.item_name}
                    className="menu-item-image"
                  />
                  <h2>{translations.itemNames[drink.item_name] || drink.item_name}</h2>
                  <p className="image_description">
                    {imageMap[drink.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="steps-container">
            <div className="steps-header">
            <Button onClick={handleBackToMenu} className="back-button-to-menu" text={translations.goBack}>
                </Button> 
                <Button onClick={handleBackToMenu} className="back-button-to-menu2" text={translations.goBack}>
                </Button> 
              <h3>{translations.selectSide}</h3>
            </div>
            <div className="sides-container">
              {sides.map((side) => (
                <div
                  key={side.menu_item_id}
                  className={`menu-item ${
                    selectedSides.length === 1 && !selectedSides.includes(side)
                      ? "unselected"
                      : ""
                  } ${selectedSides.includes(side) ? "selected" : ""}`}
                >
                  <img
                    src={imageMap[side.item_name]?.image || logo}
                    alt={side.item_name}
                    className="menu-item-image"
                  />
                  <h2>{translations.itemNames[side.item_name] || side.item_name}</h2>
                  <p className="image_description">
                    {imageMap[side.item_name]?.description}
                  </p>
                </div>
              ))}
            </div>
            <br></br>
            <br></br>
            <br></br>
            <h3>{translations.selectEntree}</h3>
            <br></br>
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
                  >
                    <img
                      src={imageMap[entree.item_name]?.image || logo}
                      alt={entree.item_name}
                      className="menu-item-image"
                    />
                    <h2>{translations.itemNames[entree.item_name] || entree.item_name}</h2>
                    <p className="image_description">
                      {imageMap[entree.item_name]?.description}
                    </p>
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

      {isDrinkModalOpen && selectedDrink && (
        <DrinkModal
          drink={selectedDrink}
          onClose={closeDrinkModal}
          addToOrder={addToOrder}
          resetSelections={resetSelections}
        />
      )}

      {isEntreeModalOpen && selectedEntree && (
        <EntreeModal
          entree={selectedEntree}
          onClose={closeEntreeModal}
          addToOrder={addToOrder}
          resetSelections={resetSelections}
        />
      )}
      {isSauceModalOpen && selectedSauce && (
        <SauceModal
          sauce={selectedSauce}
          onClose={closeSauceModal}
          addToOrder={addToOrder}
          resetSelections={resetSelections}
        />
      )}
    </div>
  );
};

export default CustomerHome;
