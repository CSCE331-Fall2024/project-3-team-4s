import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [popupDetails, setPopupDetails] = useState(null); // Popup state
  const [orderList, setOrderList] = useState(() => {
    // Load order list from local storage if it exists
    const savedOrderList = localStorage.getItem('orderList');
    return savedOrderList ? JSON.parse(savedOrderList) : [];
  });

  const addToOrder = (name, quantity) => {
    const isBowl = name.toLowerCase() === 'bowl';
    const isPlate = name.toLowerCase() === 'plate';
    const isBiggerPlate = name.toLowerCase() === 'bigger plate';
    
    setOrderList((prevList) => [...prevList, { name, quantity }]);
    setPopupDetails({ name: name, quantity: quantity, isBowl, 
      isPlate, 
      isBiggerPlate });
    console.log('Added to order:', name, quantity);
  };
  setTimeout(() => setPopupDetails(null), 5000);

  

  // Update local storage whenever orderList changes
  useEffect(() => {
    localStorage.setItem('orderList', JSON.stringify(orderList));
  }, [orderList]);

  return (
    <OrderContext.Provider value={{ orderList, setOrderList, addToOrder, popupDetails }}>
      {children}
    </OrderContext.Provider>
  );
};
