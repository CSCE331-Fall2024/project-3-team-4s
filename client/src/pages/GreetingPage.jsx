import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GreetingPage.css';    

const GreetingPage = () => {
  const navigate = useNavigate();  

  // Function to navigate to CustomerHome
  const handlePlaceOrderClick = () => {
    navigate('/customer'); 
  };

  // Function to navigate to ManagerHome
  const handleLoginClick = () => {
    navigate('/manager');
  };

  return (
    <div className="welcome-container">
      <div className="vbox left-box">
        <button className="translate-button">Translate</button>
        <button className="accessibility-button">Accessibility Options</button>
      </div>
      <div className="center-box">
        <h1>Panda Express</h1>
        <div className="panda-logo">
          <img src="/assets/panda.png" alt="Panda Logo" />
        </div>
        <button className="order-button" onClick={handlePlaceOrderClick}>
          Place Order
        </button>
      </div>
      <button className="login-button" onClick={handleLoginClick}>
        Login
      </button>
    </div>
  );
};

export default GreetingPage;