// OrderContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orderList, setOrderList] = useState(() => {
    // Load order list from local storage if it exists
    const savedOrderList = localStorage.getItem('orderList');
    return savedOrderList ? JSON.parse(savedOrderList) : [];
  });

  const addToOrder = (name, quantity) => {
    setOrderList((prevList) => [...prevList, { name, quantity }]);
    console.log('Added to order:', name, quantity);
  };

  // Update local storage whenever orderList changes
  useEffect(() => {
    localStorage.setItem('orderList', JSON.stringify(orderList));
  }, [orderList]);

  return (
    <OrderContext.Provider value={{ orderList, addToOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
