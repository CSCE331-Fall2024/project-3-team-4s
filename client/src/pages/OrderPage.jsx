import React from 'react';
import './styles/OrderPage.css';
import { useOrder } from './OrderContext';
import Bowl from '../customerImages/Bowl.avif';
import Plate from '../customerImages/Plate.avif';
import Bigger_Plate from '../customerImages/Bigger_Plate.avif';
import logo from '../customerImages/logo.png';
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
import Dr_Pepper from '../customerImages/Dr_Pepper.avif';
import Coca_Cola from '../customerImages/Coca_Cola.avif';
import Diet_Coke from '../customerImages/Diet_Coke.avif';
import Mango_Guava_Flavored_Tea from '../customerImages/Mango_Guava_Flavored_Tea.avif';
import Peach_Lychee_Flavored_Refresher from '../customerImages/Peach_Lychee_Flavored_Refresher.avif';
import Pomegranate_Pineapple_Flavored_Lemonade from '../customerImages/Pomegranate_Pineapple_Flavored_Lemonade.avif';
import Watermelon_Mango_Flavored_Refresher from '../customerImages/Watermelon_Mango_Flavored_Refresher.avif';
import Barqs_Root_Beer from '../customerImages/Barqs_Root_Beer.avif';
import Fanta_Orange from '../customerImages/Fanta_Orange.avif';
import Minute_Maid_Lemonade from '../customerImages/Minute_Maid_Lemonade.avif';
import Powerade_Mountain_Berry_Blast from '../customerImages/Powerade_Mountain_Berry_Blast.avif';
import Sprite from '../customerImages/Sprite.avif';
import Coca_Cola_Cherry from '../customerImages/Coca_Cola_Cherry.avif';
import Fuze_Raspberry_Iced_Tea from '../customerImages/Fuze_Raspberry_Iced_Tea.avif';
import Powerade_Fruit_Punch from '../customerImages/Powerade_Fruit_Punch.avif';
import Dasani from '../customerImages/Dasani.avif';
import Minute_Maid_Apple_Juice from '../customerImages/Minute_Maid_Apple_Juice.avif';
import Coke_Mexico from '../customerImages/Coke_Mexico.avif';
import Coke_Zero from '../customerImages/Coke_Zero.avif';
import Smartwater from '../customerImages/Smartwater.avif';


const OrderPage = () => {
    const { orderList, setOrderList } = useOrder();
    console.log(orderList);
    const clearOrder = () => {
        setOrderList([]);
        localStorage.removeItem('orderList');
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

  return (
    <div>
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
          <button className="navbar-button">ORDER</button>
          <span role="img" aria-label="user" className="navbar-icon">👤</span>
        </div>
      </div>
      
      <h2 className="page-title">Order</h2>
      
      <div className="container">
        {/* Left Section: Order Summary */}
        <div className="order-summary">
          <button className="add-more"><a href='/customer'>+ Add More Items</a></button>
          <h2>Your Order</h2>
          
          {orderList.length > 0 ? (
  (() => {
    const items = []; // Array to store the JSX for each row
    for (let index = 0; index < orderList.length; index++) {
      const item = orderList[index];
      
      if (item.name === 'Bowl' || item.name === 'Plate' || item.name === 'Bigger Plate') {
        // Determine the number of sides and entrees based on the item type
        const sideCount = 1;
        const entreeCount = item.name === 'Bowl' ? 1 : item.name === 'Plate' ? 2 : 3;

        // Gather sides and entrees
        const sidesAndEntrees = orderList.slice(index + 1, index + 1 + sideCount + entreeCount);

        // Push the main item with its sides and entrees into the items array
        items.push(
          <div className="order-item" key={index}>
            <img src={getItemImage(item.name)} alt={item.name} className="order-item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              {sidesAndEntrees.map((subItem, subIndex) => (
                <p key={subIndex}>{subItem.name}</p>
              ))}
              <p>Quantity: {item.quantity}</p>
              <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        );

        // Skip over the sides and entrees in the main loop
        index += sideCount + entreeCount;
      } else {
        // For items not part of Bowl, Plate, or Bigger Plate, add them individually
        items.push(
          <div className="order-item" key={index}>
            <img src={getItemImage(item.name)} alt={item.name} className="order-item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
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

          
          {/* Recommended Items Section */}
          <h2>You May Also Like</h2>
          <div className="recommended-items">
            <div className="recommendation">
              <img src={Watermelon_Mango_Flavored_Refresher} alt="Watermelon Mango Flavored Refresher" />
              <p>Watermelon Mango Flavored Refresher</p>
            </div>
            <div className="recommendation">
              <img src={Chicken_Egg_Roll} alt="Chicken Egg Roll" />
              <p>Chicken Egg Roll</p>
            </div>
            <div className="recommendation">
              <img src={Dr_Pepper} alt="Dr Pepper" />
              <p>Dr Pepper</p>
            </div>
            <div className="recommendation">
              <img src={Veggie_Spring_Roll} alt="Veggie Spring Roll" />
              <p>Veggie Spring Roll</p>
            </div>
          </div>
        </div>
        
        {/* Right Section: Pickup Details */}
        <div className="pickup-details">
          <h3>Additional Requests?</h3>
          <div className="additional-requests">
            <label>
              <input type="checkbox" />
              Utensils
            </label>
            <label>
              <input type="checkbox" />
              Napkins
            </label>
          </div>
          
          <h3>Special Requests</h3>
          <input type="text" className="special-request-input" placeholder="Add Note" />
          
          <h3>Coupon Code</h3>
          <div className="coupon-code">
            <input type="text" placeholder="Enter Code" />
            <button>Add</button>
          </div>
          
          <h3>Payment Method</h3>
          <div className="payment-method">
            <label>
              <input type="radio" name="payment" />
              Credit Card
            </label>
            <label>
              <input type="radio" name="payment" />
              Debit Card
            </label>
            <label>
              <input type="radio" name="payment" />
              Cash
            </label>
          </div>
          
          <button className="checkout" onClick={clearOrder}>Checkout</button>
          <br />
          <label>Subtotal : ${orderList.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</label>
          <br />
          <label>Tax : ${(orderList.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.06).toFixed(2)}</label>
          <br />
          <label>Total : ${(orderList.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.06).toFixed(2)}</label>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;