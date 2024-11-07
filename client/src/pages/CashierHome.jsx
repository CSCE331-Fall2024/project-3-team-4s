import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './styles/CashierHome.css';
import axios from "axios";
import { useEffect, useState } from "react";
import "./Employees.css";


const CashierHome = () => {
  const [activeTab, setActiveTab] = useState('Orders');
  const [showInput, setShowInput] = useState(false); // State to manage input field visibility
  const [inputValue, setInputValue] = useState(''); // State to manage input value
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
  const [cost, setCost] = useState(''); // Initialize cost state
  const [currentOrderCost, setCurrentOrderCost] = useState(''); // Initialize currentOrderCost state
  const [mealTypes, setMealTypes] = useState([]); // Initialize mealTypes state
  const [currentOrderIDs, setCurrentOrderIDs] = useState([]); // Initialize currentOrderIDs state
  const [currentOrdersIDs, setCurrentOrdersIDs] = useState([]); // Initialize currentOrdersIDs state
  



  // Preloading all the data so it's faster
  useEffect(() => {
    const fetchFood = async () => {
      try {
        //preload all of it so it doesn't need to make a request later on 
        const res = await axios.get('http://localhost:3000/kiosk/entrees');
        setEntrees(res.data);
        const res2 = await axios.get('http://localhost:3000/kiosk/sides');
        setSides(res2.data);
        const res3 = await axios.get('http://localhost:3000/kiosk/appetizers');
        setAppetizers(res3.data);
        const res4 = await(axios.get('http://localhost:3000/kiosk/drinks'));
        setDrinks(res4.data);
        const res5 = await(axios.get('http://localhost:3000/kiosk/meal-types'));
        setMealTypes(res5.data);

      } catch (err) {
        console.error(err);
      }
    };


    fetchFood();
  }, []);


  
// ADD CUSTOM ITEM FUNCTIONALITIES -------------------------------------------------------------------------------------------


  const toggleKeyboard = () => { 
    setCurrentOrder([]); 
    setCurrentOrderIDs([]);
    setCurrentOrderCost([]); 
    setShowInput(!showInput);
    setKeyboardVisible(!keyboardVisible);
  };

  const handleKeyPress = (button) => { // for item name
    if (button === '{enter}') {
      console.log('Input value:', inputValue);
      currentOrder.push(inputValue);
      setNumPadVisible(true); // Show the numpad after entering the item name
      setInputValue(''); // Clear the input field after adding the item to the order
      setShowInput(false); // Hide the input field after adding the item to the order
      setKeyboardVisible(false);

      setKeyboardVisible(false);
      setActiveTab('Orders');
      setNumAppetizers(1);
      setNumDrinks(1);
      setNumEntrees(1);
      setNumSides(1);
      

      
    }
  };
  const handleNumPadChange = (input) => {
    setCost(input);
    console.log('Cost input changed:', input);
  };

  const handleNumPadKeyPress = (button) => {
    if (button === '{enter}') {
      try {
        if (cost === '') {
          console.log('Cost is empty');
          return;
        }
        
        Number(cost);
        console.log('Cost entered:', cost);
        setNumPadVisible(false); // Hide the numpad after entering the cost
        currentOrder.push(Number(cost).toFixed(2));
        currentOrderCost.push(Number(cost).toFixed(2));
        currentOrders.push(currentOrder);
        setCurrentOrders([...currentOrders]);
        console.log("Current Orders: ");
        console.log(currentOrders);
        setInputValue(''); // Clear the input field after adding the item to the order
        setCurrentOrder([]); // Clear the current order after adding it to the list of orders
        setCurrentOrderIDs([]);
        setCost('');

        if (numAppetizers > 0 && numDrinks > 0 && numEntrees > 0 && numSides > 0) { //this is for adding custom items for ids, if an item is not selected it defaults to 999
          currentOrdersIDs.push([999]);
        }
        else{
          currentOrdersIDs.push(currentOrderIDs);
        }
      
    }
      catch (err) {
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

  //END OF ADD CUSTOM ITEM FUNCTIONALITIES -------------------------------------------------------------------------------------------

  //GLOBALLY USED FUNCTIONS -------------------------------------------------------------------------------------------

  const reset = () => {
    setNumEntrees(0);
    setNumSides(0);
    setNumAppetizers(0);
    setNumDrinks(0);
  }
  const resetAll = () => {
    reset();
    console.log('working')
    setActiveTab('Orders');
    setCurrentOrder([]);
    setCurrentOrderIDs([]);
    setCurrentOrderCost([]);
    console.log('Reset all' + currentOrder);
  }
    
    
useEffect(() => {
  console.log('Current Order after reset:', currentOrder);
}, [currentOrder]);
//END OF GLOBALLY USED FUNCTIONS -------------------------------------------------------------------------------------------



//TAB FUNCTIONALITIES --------------------------------------------------------------------------------------------

const openTab = (e, tabName) => { //handles the tab clicks and sets the number of items
  console.log('Tab name:', tabName);
  //resets the current order and cost then assigns it
  setCurrentOrder([]); 
  setCurrentOrderIDs([]);
  setActiveTab(tabName.item_name);
  reset();

  console.log('Tab name:', tabName.name);
  if (tabName.item_name === 'Bowl') {
    console.log('Bowl tab opened');
    reset();
    setNumEntrees(1);
    setNumSides(1);
  }
  if (tabName.item_name === 'Plate') {
    console.log('Plate tab opened');
    reset();
    setNumEntrees(2);
    setNumSides(1);
  }
  if (tabName.item_name === 'Bigger Plate') {
    console.log('Bigger Plate tab opened');
    reset();
    setNumEntrees(3);
    setNumSides(1);
  }
  if (tabName.item_name.includes('Entree')) {
    console.log('Entree tab opened');
    reset();
    setNumEntrees(1);
  }
  if (tabName.item_name.includes('Side')) {
    console.log('Side tab opened');
    reset();
    setNumSides(1);
  }
  if (tabName.item_name === 'Appetizer') {
    console.log('Appetizer tab opened');
    reset();
    setNumAppetizers(1);
  }
  if (tabName.item_name.includes('Drink')) {
    console.log('Drink tab opened');
    reset();
    setNumDrinks(1);
  }
  

  // Handle other tab types as necessary
  handleOrderTypeClick(tabName);
};
// END OF TAB FUNCTIONALITIES --------------------------------------------------------------------------------------------
// HANDLES CURRENT ORDERS AND NUMBER OF ITEMS  -------------------------------------------------------------------------------------------


const handleFoodClick = (id) => { //does the subtraction stuff
  console.log('Entree clicked:', id);

  if (id.item_category === 'Entree' && numEntrees > 0) {
    setNumEntrees(numEntrees - 1);
    currentOrder.push(id.item_name);
    currentOrderIDs.push(id.menu_item_id);
    currentOrderCost.push(id.item_price);
  }
  if (id.item_category === 'Side' && numSides > 0) {
    setNumSides(numSides - 1);
    currentOrder.push(id.item_name);
    currentOrderIDs.push(id.menu_item_id);
    currentOrderCost.push(id.item_price);
  }
  if (id.item_category === 'Appetizer' && numAppetizers > 0) {
    setNumAppetizers(numAppetizers - 1);
    currentOrder.push(id.item_name);
    currentOrderIDs.push(id.menu_item_id);
    currentOrderCost.push(id.item_price);
  }
  if (id.item_category === 'Drink' && numDrinks > 0) {
    setNumDrinks(numDrinks - 1);
    currentOrder.push(id.item_name);
    currentOrderIDs.push(id.menu_item_id);
    currentOrderCost.push(id.item_price);
    
  }
};
const debug = async () => {
  /*
  console.log("MealTypes: ");
  try {
    const response = await axios.get('http://localhost:3000/cashier/get-transaction-id');
    const transactionId = response.data.transaction_id;
    console.log('Transaction ID:', transactionId);
    console.log("test");
  } catch (err) {
    console.error(err);
    console.log("oops");
  }

  console.log(mealTypes);
  */
 console.log("Current Orders IDS:", currentOrdersIDs);
};
const handleOrderTypeClick = (id) => { //adds the first item to the order, this will be bowls, plates, etc
  console.log('Order type clickfdsafed:', id.item_name);
  setCurrentOrder((prevOrder) => [...prevOrder, id.item_name]);
  setCurrentOrderIDs((prevOrderIDs) => [...prevOrderIDs, id.menu_item_id]);
  setCurrentOrderCost((prevOrderCost) => [...prevOrderCost, id.item_price]);
};


const removeItem = (index) => {
  console.log('Remove item clicked:', index);
  setCurrentOrders(currentOrders.filter((_, i) => i !== index));
  setCurrentOrdersIDs(currentOrdersIDs.filter((_, i) => i !== index));

}


const orderEntered = () => { //adds the items to the list of orders 
  if (numAppetizers == 0 && numDrinks == 0 && numEntrees == 0 && numSides == 0 && currentOrder.length > 0) { 
    console.log("current order cost:", currentOrderCost);
    currentOrder.push(currentOrderCost.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2));
    currentOrdersIDs.push(currentOrderIDs);
    currentOrders.push(currentOrder);
    setCurrentOrders([...currentOrders]);
    console.log("Current Orders: ");
    console.log(currentOrders);
    setInputValue(''); // Clear the input field after adding the item to the order
    setCurrentOrder([]); // Clear the current order after adding it to the list of orders
    setCurrentOrderIDs([]);
    setCurrentOrderCost([]);
    reset();

    }
    else {
      console.log(numAppetizers, numDrinks, numEntrees, numSides);
      console.log("Please select the correct number of items");
    }
  }





  const checkout = async () => {
    console.log('Checkout clicked');
    if (currentOrders.length > 0) {
      console.log('Checkout successful');
  
      // Iterate over each sublist in currentOrders
      for (const order of currentOrders) {
        // Iterate over each item in the sublist
        for (const item of order) {
          try {
            // Make an Axios PUT request for each item
            const res = await axios.put('http://localhost:3000/cashier/get-menu', {
              item_name: item
            });
            console.log(`Updated item: ${item}`, res.data);
          } catch (error) {
            console.error(`Error updating item: ${item}`, error);
          }
        }
      }

      const transactionId = await getLatestTransactionId();
      console.log('Transaction ID:', transactionId);


  
      // Clear currentOrders after processing
      setCurrentOrders([]);
    }
  };


  


const tabs = mealTypes;


  return (
    <div className = "overall">
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
          Entrees
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
                  Sides
                  <div className="menu-item-list">
                    {sides.map((sides) => (
                      <button
                        key={sides.menu_item_id}
                        className="menu-item-button"
                        onClick={() => handleFoodClick(sides)}
                        disabled={numSides === 0}
                      >
                        {sides.item_name}
                      </button>
                    ))}
                    
                  </div>
                  Appetizer
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
                  Drinks
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
            
            
         

            currentOrder: {currentOrder.join(', ')}
          </div>
        </div>
      </div>

      <div className="order">
        <div className="orderItems">
          <h2>Current Order</h2>
          <ul>
          {currentOrders.map((order, index) => (
  <ul key={index}>
    <button key={index} onClick={() => removeItem(index)}>X </button>
    {order.join(', ')}
  </ul>
))}
                </ul>
        </div> 

        <button className="checkoutCHECK" onClick={(e) => openTab(e, 'Drink')}>Checkout</button> 
        <button className="enter_item" onClick={toggleKeyboard}>Enter Item</button>
        <button className="clear_order" onClick={resetAll}>Clear Order</button>
        <button className ="Confirm" onClick={orderEntered}>Confirm Order</button>
        <button className = "debug" onClick={debug}>Debug</button>

        {showInput && ( //makes text box appear
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter item details"
          />

        )}
          {numPadVisible && ( //makes text box appear
          <input
            type="text"
            value={cost}
            onChange={handleNumPadChange}
            placeholder="Enter item details"
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
            default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 . {enter}']
          }}
        />
      )}
    </div>

  );
};

export default CashierHome;