import React, { useEffect, useState } from 'react';
import './styles/CustomerHome.css';
import logo from '../customerImages/logo.png';
import Bowl from '../customerImages/Bowl.avif';
import Plate from '../customerImages/Plate.avif';
import Bigger_Plate from '../customerImages/Bigger_Plate.avif';
import Appetizer from '../customerImages/Appetizer.avif';
import Drink from '../customerImages/Drink.avif';
import A_La_Carte_Side from '../customerImages/A_La_Carte_Side.avif';
import A_La_Carte_Entree from '../customerImages/A_La_Carte_Entree.avif';
import Chow_Mein from '../customerImages/Chow_Mein.png';
import Super_Greens from '../customerImages/Super_Greens.png';
import White_Rice from '../customerImages/White_Rice.png';
import Fried_Rice from '../customerImages/Fried_Rice.png';
import Beijing_Beef from '../customerImages/Beijing_Beef.png';
import The_Original_Orange_Chicken from '../customerImages/The_Original_Orange_Chicken.png';
import Broccoli_Beef from '../customerImages/Broccoli_Beef.png';
import Mushroom_Chicken from '../customerImages/Mushroom_Chicken.png';
import Grilled_Teriyaki_Chicken from '../customerImages/Grilled_Teriyaki_Chicken.png';
import Beyond_Original_Orange_Chicken from '../customerImages/Beyond_Original_Orange_Chicken.png';
import Black_Pepper_Sirloin_Steak from '../customerImages/Black_Pepper_Sirloin_Steak.png';
import Honey_Sesame_Chicken_Breast from '../customerImages/Honey_Sesame_Chicken_Breast.png';
import Honey_Walnut_Shrimp from '../customerImages/Honey_Walnut_Shrimp.png';
import Hot_Ones_Blazing_Bourbon_Chicken from '../customerImages/Hot_Ones_Blazing_Bourbon_Chicken.png';
import Kung_Pao_Chicken from '../customerImages/Kung_Pao_Chicken.png';
import String_Bean_Chicken_Breast from '../customerImages/String_Bean_Chicken_Breast.png';
import Sweet_Fire_Chicken_Breast from '../customerImages/Sweet_Fire_Chicken_Breast.png';
import Chicken_Egg_Roll from '../customerImages/Chicken_Egg_Roll.avif';
import Veggie_Spring_Roll from '../customerImages/Veggie_Spring_Roll.avif';
import Cream_Cheese_Rangoon from '../customerImages/Cream_Cheese_Rangoon.avif';
import Apple_Pie_Roll from '../customerImages/Apple_Pie_Roll.avif';



const imageMap = {
  "Bowl": { image: Bowl, description: "1 Side & 1 Entree" },
  "Plate": { image: Plate, description: "1 Side & 2 Entree" },
  "Bigger Plate": { image: Bigger_Plate, description: "1 Side & 3 Entree" },
  "Appetizer": { image: Appetizer, description: "Choose from a variety of appetizers." },
  "A La Carte Side": { image: A_La_Carte_Side, description: "Side options available à la carte." },
  "A La Carte Entree": { image: A_La_Carte_Entree, description: "Individual entrees served à la carte." },
  "Drinks": { image: Drink, description: "A selection of refreshing beverages." },
  "Chow Mein": { image: Chow_Mein, description: "600 cal" },
  "Super Greens": { image: Super_Greens, description: "130 cal" },
  "White Rice": { image: White_Rice, description: "520 cal" },
  "Fried Rice": { image: Fried_Rice, description: "620 cal" },
  "Beijing Beef": { image: Beijing_Beef, description: "480 cal" },
  "The Original Orange Chicken": { image: The_Original_Orange_Chicken, description: "510 cal" },
  "Broccoli Beef": { image: Broccoli_Beef, description: "150 cal" },
  "Mushroom Chicken": { image: Mushroom_Chicken, description: "220 cal" },
  "Grilled Teriyaki Chicken": { image: Grilled_Teriyaki_Chicken, description: "275 cal" },
  "Beyond Original Orange Chicken": { image: Beyond_Original_Orange_Chicken, description: "+1.50 | 440 cal" },
  "Black Pepper Sirloin Steak": { image: Black_Pepper_Sirloin_Steak, description: "+1.50 | 180 cal" },
  "Honey Sesame Chicken Breast": { image: Honey_Sesame_Chicken_Breast, description: "340 cal" },
  "Honey Walnut Shrimp": { image: Honey_Walnut_Shrimp, description: "+1.50 | 430 cal" },
  "Hot Ones Blazing Bourbon Chicken": { image: Hot_Ones_Blazing_Bourbon_Chicken, description: "400 cal" },
  "Kung Pao Chicken": { image: Kung_Pao_Chicken, description: "320 cal" },
  "String Bean Chicken Breast": { image: String_Bean_Chicken_Breast, description: "210 cal" },
  "Sweet Fire Chicken Breast": { image: Sweet_Fire_Chicken_Breast, description: "380 cal" },
  "Chicken Egg Roll": { image: Chicken_Egg_Roll, description: "" },
  "Veggie Spring Roll": { image: Veggie_Spring_Roll, description: "" },
  "Cream Cheese Rangoon": { image: Cream_Cheese_Rangoon, description: "" },
  "Apple Pie Roll": { image: Apple_Pie_Roll, description: "" }
};

const displayOrder = [
  "Bowl",
  "Plate",
  "Bigger Plate",
  "Appetizer",
  "A La Carte Side",
  "A La Carte Entree",
  "Drink"
];

const CustomerHome = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [sides, setSides] = useState([]);           // Store sides here
  const [entrees, setEntrees] = useState([]);        // Store entrees here
  const [appetizers, setAppetizers] = useState([]); // State for appetizers
  const [selectedItem, setSelectedItem] = useState(null); 


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/menu/meals');
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();
  
        // Consolidate drinks items into a single "Drinks" item
        const drinksNames = ["Refresher", "Small Drink", "Medium Drink", "Bottle"];
        const drinksItem = {
          menu_item_id: 'drinks',
          item_name: "Drinks",
          item_price: 2.10,
        };
  
        // Consolidate entrees into a single "A La Carte Entree" item
        const entreeNames = ["Small Entree", "Medium Entree", "Large Entree"];
        const entreeItem = {
          menu_item_id: 'a_la_carte_entree',
          item_name: "A La Carte Entree",
          item_price: 5.50,
        };
  
        // Consolidate sides into a single "A La Carte Side" item
        const sideNames = ["Medium Side", "Large Side"];
        const sideItem = {
          menu_item_id: 'a_la_carte_side',
          item_name: "A La Carte Side",
          item_price: 3.00, // Set an appropriate price if needed
        };
  
        // Filter out individual drinks, entrees, and sides, and add consolidated items
        data = data.filter(item => 
          !drinksNames.includes(item.item_name) && 
          !entreeNames.includes(item.item_name) &&
          !sideNames.includes(item.item_name)
        );
        data.push(drinksItem);
        data.push(entreeItem);
        data.push(sideItem);
  
        // Sort data according to displayOrder, pushing unmatched items to the end
        data.sort((a, b) => {
          const indexA = displayOrder.indexOf(a.item_name);
          const indexB = displayOrder.indexOf(b.item_name);
  
          return (indexA === -1 ? displayOrder.length : indexA) - 
                 (indexB === -1 ? displayOrder.length : indexB);
        });
  
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);
  
  
  

  // Fetch sides when an item is selected
  const fetchSides = async () => {
    try {
      const response = await fetch('http://localhost:3000/menu/sides');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSides(data);
    } catch (error) {
      console.error('Error fetching sides:', error);
    }
  };

  // Fetch entrees when an item is selected
  const fetchEntrees = async () => {
    try {
      const response = await fetch('http://localhost:3000/menu/entree');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Sort entrees by menu_item_id in descending order
      const sortedEntrees = data.sort((a, b) => b.menu_item_id - a.menu_item_id);
      setEntrees(sortedEntrees);
    } catch (error) {
      console.error('Error fetching entrees:', error);
    }
  };

  const fetchAppetizers = async () => {
    try {
      const response = await fetch('http://localhost:3000/menu/appetizer');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAppetizers(data);
    } catch (error) {
      console.error('Error fetching appetizers:', error);
    }
  };
  

  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
  
    if (item.item_name === "Appetizer") {
      fetchAppetizers();
    } else if (item.item_name === "A La Carte Side") {
      fetchSides(); // Load only sides
      setEntrees([]); // Clear entrees to avoid displaying them
    } else if (item.item_name === "A La Carte Entree") {
      fetchEntrees(); // Load only entrees
      setSides([]); // Clear sides to avoid displaying them
    } else {
      // For any other selection, load both sides and entrees as default
      fetchSides();
      fetchEntrees();
    }
  };
  

  const handleBackToMenu = () => {
    setSelectedItem(null);
    setSides([]);
    setEntrees([]);
    setAppetizers([]);
  };

  const sortedItems = [...menuItems].sort(
    (a, b) => displayOrder.indexOf(a.item_name) - displayOrder.indexOf(b.item_name)
  );

  return (
    <div>
      <div className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <a href="#">Home</a>
          <span className="divider">|</span>
          <a href="#">About</a>
          <span className="divider">|</span>
          <a href="#">Services</a>
          <span className="divider">|</span>
          <a href="#">Our Rewards</a>
        </div>
        <div className="navbar-actions">
          <button className="navbar-button">ORDER</button>
          <span role="img" aria-label="user" className="navbar-icon">👤</span>
        </div>
      </div>
  
      <h2 className="order-heading">
        {selectedItem ? `Customize your ${selectedItem.item_name}` : "Choose your meal type to start your order"}
      </h2>
  
      <div className="menu-container">
        {!selectedItem ? (
          menuItems.map((item) => (
            <div key={item.menu_item_id} className="menu-item" onClick={() => handleMenuItemClick(item)}>
              <img 
                src={imageMap[item.item_name]?.image || logo} 
                alt={item.item_name} 
                className="menu-item-image" 
              />
              <h2>{item.item_name}</h2>
              <p className='image_description'>{imageMap[item.item_name]?.description}</p>
              <p className='image_price'>${item.item_name === "Drink" ? "2.10" : item.item_price.toFixed(2)} +</p>
            </div>
          ))
        ) : selectedItem.item_name === "Appetizer" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">Back to Menu</button>
            <h3>Select an Appetizer</h3>
            <div className="appetizers-container">
              {appetizers.map((appetizer) => (
                <div key={appetizer.menu_item_id} className="menu-item">
                  <img 
                    src={imageMap[appetizer.item_name]?.image || logo} 
                    alt={appetizer.item_name} 
                    className="menu-item-image" 
                  />
                  <h2>{appetizer.item_name}</h2>
                  <p className="image_description">{imageMap[appetizer.item_name]?.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : selectedItem.item_name === "A La Carte Side" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">Back to Menu</button>
            <h3>Choose Your Side</h3>
            <div className="sides-container">
              {sides.map((side) => (
                <div key={side.menu_item_id} className="menu-item">
                  <img 
                    src={imageMap[side.item_name]?.image || logo} 
                    alt={side.item_name} 
                    className="menu-item-image" 
                  />
                  <h2>{side.item_name}</h2>
                  <p className="image_description">{imageMap[side.item_name]?.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : selectedItem.item_name === "A La Carte Entree" ? (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">Back to Menu</button>
            <h3>Choose Your Entree</h3>
            <div className="entrees-container">
              {entrees.map((entree) => (
                <div key={entree.menu_item_id} className="menu-item">
                  <img 
                    src={imageMap[entree.item_name]?.image || logo} 
                    alt={entree.item_name} 
                    className="menu-item-image" 
                  />
                  <h2>{entree.item_name}</h2>
                  <p className="image_description">{imageMap[entree.item_name]?.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="steps-container">
            <button onClick={handleBackToMenu} className="back-button">Back to Menu</button>
  
            <h3>Step 1: Choose Your Side</h3>
            <div className="sides-container">
              {sides.map((side) => (
                <div key={side.menu_item_id} className="menu-item">
                  <img 
                    src={imageMap[side.item_name]?.image || logo} 
                    alt={side.item_name} 
                    className="menu-item-image" 
                  />
                  <h2>{side.item_name}</h2>
                  <p className="image_description">{imageMap[side.item_name]?.description}</p>
                </div>
              ))}
            </div>
  
            <h3>Step 2: Choose Your Entree</h3>
            <div className="entrees-container">
              {entrees.map((entree) => (
                <div key={entree.menu_item_id} className="menu-item">
                  <img 
                    src={imageMap[entree.item_name]?.image || logo} 
                    alt={entree.item_name} 
                    className="menu-item-image" 
                  />
                  <h2>{entree.item_name}</h2>
                  <p className="image_description">{imageMap[entree.item_name]?.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;