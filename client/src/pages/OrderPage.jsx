import React, { useEffect, useState } from 'react';
import './OrderPage.css';
import { useOrder } from './OrderContext';
import Bowl from '../../public/Bowl.avif';
import Plate from '../../public/Plate.avif';
import Bigger_Plate from '../../public/Bigger_Plate.avif';
import logo from '../../public/logo.png';
import Chow_Mein from '../../public/Chow_Mein.png';
import Super_Greens from '../../public/Super_Greens.png';
import White_Rice from '../../public/White_Rice.png';
import Fried_Rice from '../../public/Fried_Rice.png';
import Beijing_Beef from '../../public/Beijing_Beef.png';
import The_Original_Orange_Chicken from '../../public/The_Original_Orange_Chicken.png';
import Broccoli_Beef from '../../public/Broccoli_Beef.png';
import Mushroom_Chicken from '../../public/Mushroom_Chicken.png';
import Grilled_Teriyaki_Chicken from '../../public/Grilled_Teriyaki_Chicken.png';
import Beyond_Original_Orange_Chicken from '../../public/Beyond_Original_Orange_Chicken.png';
import Black_Pepper_Sirloin_Steak from '../../public/Black_Pepper_Sirloin_Steak.png';
import Honey_Sesame_Chicken_Breast from '../../public/Honey_Sesame_Chicken_Breast.png';
import Honey_Walnut_Shrimp from '../../public/Honey_Walnut_Shrimp.png';
import Hot_Ones_Blazing_Bourbon_Chicken from '../../public/Hot_Ones_Blazing_Bourbon_Chicken.png';
import Kung_Pao_Chicken from '../../public/Kung_Pao_Chicken.png';
import String_Bean_Chicken_Breast from '../../public/String_Bean_Chicken_Breast.png';
import Sweet_Fire_Chicken_Breast from '../../public/Sweet_Fire_Chicken_Breast.png';
import Chicken_Egg_Roll from '../../public/Chicken_Egg_Roll.avif';
import Veggie_Spring_Roll from '../../public/Veggie_Spring_Roll.avif';
import Cream_Cheese_Rangoon from '../../public/Cream_Cheese_Rangoon.avif';
import Apple_Pie_Roll from '../../public/Apple_Pie_Roll.avif';
import Dr_Pepper from '../../public/Dr_Pepper.avif';
import Coca_Cola from '../../public/Coca_Cola.avif';
import Diet_Coke from '../../public/Diet_Coke.avif';
import Mango_Guava_Flavored_Tea from '../../public/Mango_Guava_Flavored_Tea.avif';
import Peach_Lychee_Flavored_Refresher from '../../public/Peach_Lychee_Flavored_Refresher.avif';
import Pomegranate_Pineapple_Flavored_Lemonade from '../../public/Pomegranate_Pineapple_Flavored_Lemonade.avif';
import Watermelon_Mango_Flavored_Refresher from '../../public/Watermelon_Mango_Flavored_Refresher.avif';
import Barqs_Root_Beer from '../../public/Barqs_Root_Beer.avif';
import Fanta_Orange from '../../public/Fanta_Orange.avif';
import Minute_Maid_Lemonade from '../../public/Minute_Maid_Lemonade.avif';
import Powerade_Mountain_Berry_Blast from '../../public/Powerade_Mountain_Berry_Blast.avif';
import Sprite from '../../public/Sprite.avif';
import Coca_Cola_Cherry from '../../public/Coca_Cola_Cherry.avif';
import Fuze_Raspberry_Iced_Tea from '../../public/Fuze_Raspberry_Iced_Tea.avif';
import Powerade_Fruit_Punch from '../../public/Powerade_Fruit_Punch.avif';
import Dasani from '../../public/Dasani.avif';
import Minute_Maid_Apple_Juice from '../../public/Minute_Maid_Apple_Juice.avif';
import Coke_Mexico from '../../public/Coke_Mexico.avif';
import Coke_Zero from '../../public/Coke_Zero.avif';
import Smartwater from '../../public/Smartwater.avif';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import { Link } from 'react-router-dom'; // Import Link
const OrderPage = () => {
    const { orderList, setOrderList } = useOrder();
    const [prices, setPrices] = useState({}); // Cache for fetched prices
    const [categoryPrices, setCategoryPrices] = useState({}); // Cache for category prices

    // Fetch item or category price
    const fetchPrice = async (name) => {
        if (!prices[name]) { // Cache lookup for both item and category names
            try {
                const response = await axios.get(`http://localhost:3000/kiosk/prices`, { params: { itemName: name } });
                console.log(`Fetched price for ${name}:`, response.data.price); // Log the fetched price
                setPrices((prev) => ({ ...prev, [name]: response.data.price }));
                return response.data.price;
            } catch (error) {
                console.error('Error fetching price:', error.response || error.message || error);
                return 0;
            }
        }
        return prices[name];
    };


    console.log(orderList);
    const clearOrder = () => {
        setOrderList([]);
        localStorage.removeItem('orderList');
    };

    // Fetch all prices initially for items in the order list
    useEffect(() => {
        const fetchAllPrices = async () => {
            const newPrices = {};
            for (const item of orderList) {
                // Fetch individual item price
                if (!prices[item.name]) {
                    const price = await fetchPrice(item.name);
                    newPrices[item.name] = price;
                }
                // Fetch category price (if category exists in the database as an item)
                if (item.category && !prices[item.category]) {
                    const categoryPrice = await fetchPrice(item.category);
                    newPrices[item.category] = categoryPrice;
                }
            }
            setPrices((prev) => ({ ...prev, ...newPrices }));
        };
        fetchAllPrices();
    }, [orderList]);
    

    // Calculate total price for an item with category price if applicable
    const getItemTotalPrice = (item) => {
        const itemPrice = prices[item.name] || 0;
        const categoryPrice = prices[item.category] || 0; // Use category name as key
        return (itemPrice + categoryPrice) * item.quantity;
    };

    // Calculate total price for main items with sides and entrees
    const getTotalPrice = (item, sidesAndEntrees) => {
        const mainItemPrice = getItemTotalPrice(item);
        const sidesAndEntreesPrice = sidesAndEntrees.reduce(
            (sum, subItem) => sum + getItemTotalPrice(subItem),
            0
        );
        return (mainItemPrice + sidesAndEntreesPrice).toFixed(2);
    };


    const getItemImage = (itemName) => {
        switch (itemName) {
            case 'Broccoli Beef': return Broccoli_Beef;
            case 'Super Greens': return Super_Greens;
            case 'White Rice': return White_Rice;
            case 'Fried Rice': return Fried_Rice;
            case 'Beijing Beef': return Beijing_Beef;
            case 'The Original Orange Chicken': return The_Original_Orange_Chicken;
            case 'Mushroom Chicken': return Mushroom_Chicken;
            case 'Grilled Teriyaki Chicken': return Grilled_Teriyaki_Chicken;
            case 'Beyond Original Orange Chicken': return Beyond_Original_Orange_Chicken;
            case 'Black Pepper Sirloin Steak': return Black_Pepper_Sirloin_Steak;
            case 'Honey Sesame Chicken Breast': return Honey_Sesame_Chicken_Breast;
            case 'Honey Walnut Shrimp': return Honey_Walnut_Shrimp;
            case 'Hot Ones Blazing Bourbon Chicken': return Hot_Ones_Blazing_Bourbon_Chicken;
            case 'Kung Pao Chicken': return Kung_Pao_Chicken;
            case 'String Bean Chicken Breast': return String_Bean_Chicken_Breast;
            case 'Sweet Fire Chicken Breast': return Sweet_Fire_Chicken_Breast;
            case 'Chicken Egg Roll': return Chicken_Egg_Roll;
            case 'Veggie Spring Roll': return Veggie_Spring_Roll;
            case 'Cream Cheese Rangoon': return Cream_Cheese_Rangoon;
            case 'Apple Pie Roll': return Apple_Pie_Roll;
            case 'Dr Pepper': return Dr_Pepper;
            case 'Coca Cola': return Coca_Cola;
            case 'Diet Coke': return Diet_Coke;
            case 'Mango Guava Flavored Tea': return Mango_Guava_Flavored_Tea;
            case 'Peach Lychee Flavored Refresher': return Peach_Lychee_Flavored_Refresher;
            case 'Pomegranate Pineapple Flavored Lemonade': return Pomegranate_Pineapple_Flavored_Lemonade;
            case 'Watermelon Mango Flavored Refresher': return Watermelon_Mango_Flavored_Refresher;
            case 'Barq\'s Root Beer': return Barqs_Root_Beer;
            case 'Fanta Orange': return Fanta_Orange;
            case 'Minute Maid Lemonade': return Minute_Maid_Lemonade;
            case 'Powerade Mountain Berry Blast': return Powerade_Mountain_Berry_Blast;
            case 'Sprite': return Sprite;
            case 'Coca Cola Cherry': return Coca_Cola_Cherry;
            case 'Fuze Raspberry Iced Tea': return Fuze_Raspberry_Iced_Tea;
            case 'Powerade Fruit Punch': return Powerade_Fruit_Punch;
            case 'Dasani': return Dasani;
            case 'Minute Maid Apple Juice': return Minute_Maid_Apple_Juice;
            case 'Coke Mexico': return Coke_Mexico;
            case 'Coke Zero': return Coke_Zero;
            case 'Smartwater': return Smartwater;
            case 'Chow Mein': return Chow_Mein;
            case 'Bigger Plate': return Bigger_Plate;
            case 'Plate': return Plate;
            case 'Bowl' : return Bowl;
            default: return logo; // default image if item not found
        }
    };

    const removeItem = (indexToRemove) => {
        const updatedOrderList = orderList.filter((_, index) => index !== indexToRemove);
        setOrderList(updatedOrderList);
    };

    const handleCheckout = async () => {
        const confirmed = window.confirm("Are you sure you want to proceed to checkout?");
        if (confirmed) {
            const totalCost = orderList.reduce((sum, item) => sum + (prices[item.name] * item.quantity), 0).toFixed(2);
            const transactionType = "card"; // Or set dynamically based on user input
    
            try {
                const response = await axios.post('http://localhost:3000/kiosk/order', {
                    totalCost,
                    transactionType,
                    orderList // Pass orderList directly if each item has menu_item_id and quantity
                });
                
                if (response.status === 200) {
                    alert("Order has been successfully checked out!");
                    clearOrder(); // Clears the local order list
                }
            } catch (error) {
                console.error("Error during checkout:", error);
                alert("There was an error processing your order. Please try again.");
            }
        }
    };

    const navigate = useNavigate(); // Initialize the navigate function
    const goToCustomerPage = () => {
        navigate('/customer'); // Navigate to the customer page
    };
    

    return (
        <div className='background'>
            <div className="navbar">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <div className="navbar-links">
                    <a href="/">Home</a> | <a href="#">About</a> | <a href="#">Services</a> | <a href="/order">Our Rewards</a>
                </div>
                <div className="navbar-actions">
                    <button className="navbar-button"><Link to='/customer'>Go Back To Menu</Link></button>
                    <span role="img" aria-label="user" className="navbar-icon">👤</span>
                </div>
            </div>

            <h2 className="page-title">Order</h2>

            <div className="container">
                <div className="order-summary">
                    <button className="add-more" onClick={goToCustomerPage}>+ Add More Items</button>
                    <h2>Your Order</h2>

                    {orderList.length > 0 ? (
                        (() => {
                            const items = [];
                            for (let index = 0; index < orderList.length; index++) {
                                const item = orderList[index];

                                if (item.name === 'Bowl' || item.name === 'Plate' || item.name === 'Bigger Plate') {
                                    const sideCount = 1;
                                    const entreeCount = item.name === 'Bowl' ? 1 : item.name === 'Plate' ? 2 : 3;
                                    const sidesAndEntrees = orderList.slice(index + 1, index + 1 + sideCount + entreeCount);

                                    items.push(
                                        <div className="order-item" key={index}>
                                            <img src={getItemImage(item.name)} alt={item.name} className="order-item-image" />
                                            <div className="item-details">
                                                <h3>{item.name}</h3>
                                                {sidesAndEntrees.map((subItem, subIndex) => (
                                                    <p key={subIndex}>{subItem.name}</p>
                                                ))}
                                                <p>Quantity: {item.quantity}</p>
                                                <p className="item-price">Total: ${getTotalPrice(item, sidesAndEntrees)}</p>
                                                <button className="remove-button" onClick={() => removeItem(index)}>Remove</button>
                                            </div>
                                        </div>
                                    );
                                    index += sideCount + entreeCount;
                                } else {
                                    items.push(
                                        <div className="order-item" key={index}>
                                            <img src={getItemImage(item.name)} alt={item.name} className="order-item-image" />
                                            <div className="item-details">
                                                <h3>{item.name}</h3>
                                                <p>Quantity: {item.quantity}</p>
                                                <p className="item-price">Total: ${getItemTotalPrice(item).toFixed(2)}</p>
                                                <button className="remove-button" onClick={() => removeItem(index)}>Remove</button>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                            return items;
                        })()
                    ) : (
                        <p>No items in the order.</p>
                    )}
                </div>

                <div className="pickup-details">
                    <h3>Additional Requests?</h3>
                    <div className="additional-requests">
                        <label><input type="checkbox" /> Utensils</label>
                        <label><input type="checkbox" /> Napkins</label>
                    </div>
                    <br />
                    <h3>Special Requests</h3>
                    <input type="text" className="special-request-input" placeholder="Add Note" />
                    <br /><br />
                    <h3>Coupon Code</h3>
                    <div className="coupon-code">
                        <input type="text" placeholder="Enter Code" />
                        <button>Add</button>
                    </div>
                    <br />
                    <h3>Payment Method</h3>
                    <div className="payment-method">
                        <label><input type="radio" name="payment" /> Credit Card</label>
                        <label><input type="radio" name="payment" /> Debit Card</label>
                        <label><input type="radio" name="payment" /> Cash</label>
                    </div>
                    <br />

                    <button className="checkout" onClick={handleCheckout}>Checkout</button>
                    <br />
                    <br />
                    <label>Subtotal : ${orderList.reduce((sum, item) => sum + prices[item.name] * item.quantity, 0).toFixed(2)}</label>
                    <br />
                    <br />
                    <label>Tax : ${(orderList.reduce((sum, item) => sum + prices[item.name] * item.quantity, 0) * 0.06).toFixed(2)}</label>
                    <br />
                    <br />
                    <label>Total : ${(orderList.reduce((sum, item) => sum + prices[item.name] * item.quantity, 0) * 1.06).toFixed(2)}</label>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;