import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CustomerHome";

import AppetizerModal from "../components/AppetizerModal";
import SideModal from "../components/SideModal";
import EntreeModal from "../components/EntreeModal";
import DrinkModal from "../components/DrinkModal";
import BottomBar from "../components/BottomBar";
import { useOrder } from "./OrderContext";

const imageMap = {
    Bowl: { image: "/bowl.avif", description: "1 Side & 1 Entree" },
    Plate: { image: "/plate.avif", description: "1 Side & 2 Entree" },
    "Bigger Plate": { image: "/Bigger_Plate.avif", description: "1 Side & 3 Entree" },
    Appetizer: { image: "/Appetizer.avif", description: "Choose from a variety of appetizers." },
    "A La Carte Side": { image: "/A_La_Carte_Side.avif", description: "Side options available à la carte." },
    "A La Carte Entree": { image: "/A_La_Carte_Entree.avif", description: "Individual entrees served à la carte." },
    Drinks: { image: "/Drink.avif", description: "A selection of refreshing beverages." },
    "Chow Mein": { image: "/Chow_Mein.png", description: "600 cal" },
    "Super Greens": { image: "/Super_Greens.png", description: "130 cal" },
    "White Rice": { image: "/White_Rice.png", description: "520 cal" },
    "Fried Rice": { image: "/Fried_Rice.png", description: "620 cal" },
    "Beijing Beef": { image: "/Beijing_Beef.png", description: "480 cal" },
    "The Original Orange Chicken": { image: "/The_Original_Orange_Chicken.png", description: "510 cal" },
    "Broccoli Beef": { image: "/Broccoli_Beef.png", description: "150 cal" },
    "Mushroom Chicken": { image: "/Mushroom_Chicken.png", description: "220 cal" },
    "Grilled Teriyaki Chicken": { image: "/Grilled_Teriyaki_Chicken.png", description: "275 cal" },
    "Beyond Original Orange Chicken": { image: "/Beyond_Original_Orange_Chicken.png", description: "+1.50 | 440 cal" },
    "Black Pepper Sirloin Steak": { image: "/Black_Pepper_Sirloin_Steak.png", description: "+1.50 | 180 cal" },
    "Honey Sesame Chicken Breast": { image: "/Honey_Sesame_Chicken_Breast.png", description: "340 cal" },
    "Honey Walnut Shrimp": { image: "/Honey_Walnut_Shrimp.png", description: "+1.50 | 430 cal" },
    "Hot Ones Blazing Bourbon Chicken": { image: "/Hot_Ones_Blazing_Bourbon_Chicken.png", description: "400 cal" },
    "Kung Pao Chicken": { image: "/Kung_Pao_Chicken.png", description: "320 cal" },
    "String Bean Chicken Breast": { image: "/String_Bean_Chicken_Breast.png", description: "210 cal" },
    "Sweet Fire Chicken Breast": { image: "/Sweet_Fire_Chicken_Breast.png", description: "380 cal" },
    "Chicken Egg Roll": { image: "/Chicken_Egg_Roll.avif", description: "" },
    "Veggie Spring Roll": { image: "/Veggie_Spring_Roll.avif", description: "" },
    "Cream Cheese Rangoon": { image: "/Cream_Cheese_Rangoon.avif", description: "" },
    "Apple Pie Roll": { image: "/Apple_Pie_Roll.avif", description: "" },
    "Dr Pepper": { image: "/Dr_Pepper.avif", description: "" },
    "Coca Cola": { image: "/Coca_Cola.avif", description: "" },
    "Diet Coke": { image: "/Diet_Coke.avif", description: "" },
    "Mango Guava Flavored Tea": { image: "/Mango_Guava_Flavored_Tea.avif", description: "" },
    "Peach Lychee Flavored Refresher": { image: "/Peach_Lychee_Flavored_Refresher.avif", description: "" },
    "Pomegranate Pineapple Flavored Lemonade": { image: "/Pomegranate_Pineapple_Flavored_Lemonade.avif", description: "" },
    "Watermelon Mango Flavored Refresher": { image: "/Watermelon_Mango_Flavored_Refresher.avif", description: "" },
    "Barqs Root Beer": { image: "/Barqs_Root_Beer.avif", description: "" },
    "Fanta Orange": { image: "/Fanta_Orange.avif", description: "" },
    "Minute Maid Lemonade": { image: "/Minute_Maid_Lemonade.avif", description: "" },
    "Powerade Mountain Berry Blast": { image: "/Powerade_Mountain_Berry_Blast.avif", description: "" },
    Sprite: { image: "/Sprite.avif", description: "" },
    "Coca Cola Cherry": { image: "/Coca_Cola_Cherry.avif", description: "" },
    "Fuze Raspberry Iced Tea": { image: "/Fuze_Raspberry_Iced_Tea.avif", description: "" },
    "Powerade Fruit Punch": { image: "/Powerade_Fruit_Punch.avif", description: "" },
    Dasani: { image: "/Dasani.avif", description: "" },
    "Minute Maid Apple Juice": { image: "/Minute_Maid_Apple_Juice.avif", description: "" },
    "Coke Mexico": { image: "/Coke_Mexico.avif", description: "" },
    "Coke Zero": { image: "/Coke_Zero.avif", description: "" },
    Smartwater: { image: "/Smartwater.avif", description: "" },
  };


  const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const { addToOrder } = useOrder();


    
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAppetizer, setSelectedAppetizer] = useState(null);
    const [selectedEntree, setSelectedEntree] = useState(null);
    const [selectedSide, setSelectedSide] = useState(null);
    const [selectedDrink, setSelectedDrink] = useState(null);

    const [sides, setSides] = useState([]);
    const [entrees, setEntrees] = useState([]);
    const [selectedSides, setSelectedSides] = useState([]);
    const [selectedEntrees, setSelectedEntrees] = useState([]);

  
    const [isEntreeModalOpen, setIsEntreeModalOpen] = useState(false);
    const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
  
    const backendURL = "http://localhost:3000";
  
    // Centralized fetch logic
    const fetchCategoryData = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error(`Error fetching data for ${categoryName}:`, error);
      }
    };
  
    useEffect(() => {
      const categoryEndpoints = {
        "A La Carte Side": `${backendURL}/kiosk/sides`,
        "A La Carte Entree": `${backendURL}/kiosk/entrees`,
        Appetizer: `${backendURL}/kiosk/appetizers`,
        Drinks: `${backendURL}/kiosk/drinks`,
      };
  
      const url = categoryEndpoints[categoryName];
      if (url) {
        fetchCategoryData(url);
      } else {
        console.error("Unknown category:", categoryName);
      }
    }, [categoryName]);
  
    // Modal handlers
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
  
    const closeSideModal = () => setSelectedSide(null);
  
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
      setIsEntreeModalOpen(false);
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
  
    return (
      <div className="background-category">
        {/* Category Header */}
        <div className="category-header">
          <button className="navbar-button" onClick={() => navigate(-1)}>
            Go Back To Menu
          </button>
          <h1 className="category-title">{categoryName}</h1>
          <button className="navbar-button" onClick={() => navigate("/order")}>
            ORDER
          </button>
        </div>
  
        {/* Category Items */}
        <div className="category-container">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.menu_item_id}
                className="menu-item"
                onClick={() => {
                  if (categoryName === "Appetizer") handleAppetizerClick(item);
                  else if (categoryName === "A La Carte Side")
                    handleSideClick(item);
                  else if (categoryName === "A La Carte Entree")
                    handleEntreeClick(item);
                  else if (categoryName === "Drinks") handleDrinkClick(item);
                }}
              >
                <img
                  src={imageMap[item.item_name]?.image || "/logo.png"}
                  alt={item.item_name}
                  className="menu-item-image"
                />
                <h2>{item.item_name}</h2>
                <p className="image_description">
                  {imageMap[item.item_name]?.description}
                </p>
                <p className="image_price">${item.item_price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p>Loading items...</p>
          )}
        </div>
  
        {/* Modals */}
        {selectedAppetizer && (
          <AppetizerModal
            appetizer={selectedAppetizer}
            onClose={closeAppetizerModal}
            addToOrder={addToOrder}
          />
        )}
        {selectedSide && (
          <SideModal
            side={selectedSide}
            onClose={closeSideModal}
            addToOrder={addToOrder}
          />
        )}
        {selectedEntree && isEntreeModalOpen && (
          <EntreeModal
            entree={selectedEntree}
            onClose={closeEntreeModal}
            addToOrder={addToOrder}
          />
        )}
        {selectedDrink && isDrinkModalOpen && (
          <DrinkModal
            drink={selectedDrink}
            onClose={closeDrinkModal}
            addToOrder={addToOrder}
          />
        )}
      </div>
    );
  };
  
  export default CategoryPage;