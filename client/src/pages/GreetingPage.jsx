import React from 'react';
import '../components/GreetingPage.css'; // Import the CSS file for styling

const GreetingPage = () => {
  return (
    <div className="welcome-container">
      <div className="left-section">
        <button className="accessibility-button">Accessibility Options</button>
        <button className="translate-button">Translate</button>
      </div>
      
      <div className="center-section">
        <h1>Panda Express</h1>
        <div className="panda-logo">
          <img src="/assets/panda.png" alt="Panda Logo" />
        </div>
        <button className="order-button">Place Order</button>
      </div>

      <div className="right-section">
        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default GreetingPage;