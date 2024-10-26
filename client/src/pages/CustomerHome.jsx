import React from 'react';
import './styles/CustomerHome.css';
import logo from '../customerImages/logo.png';
const CustomerHome = () => {
  return (
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
  );
};

export default CustomerHome;
