import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * @module Contexts
 */

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

/**
 * OrderProvider component that provides order context to its children components.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
export const OrderProvider = ({ children }) => {
  const [popupDetails, setPopupDetails] = useState(null); // Popup state
  const [orderList, setOrderList] = useState(() => {
    // Load order list from local storage if it exists
    const savedOrderList = sessionStorage.getItem("orderList");
    return savedOrderList ? JSON.parse(savedOrderList) : [];
  });

  const addToOrder = (name, quantity) => {
    const isBowl = name.toLowerCase() === "bowl";
    const isPlate = name.toLowerCase() === "plate";
    const isBiggerPlate = name.toLowerCase() === "bigger plate";

    setOrderList((prevList) => [...prevList, { name, quantity }]);
    setPopupDetails({
      name: name,
      quantity: quantity,
      isBowl,
      isPlate,
      isBiggerPlate,
    });
    console.log("Added to order:", name, quantity);
  };
  setTimeout(() => setPopupDetails(null), 5000);

  // Update local storage whenever orderList changes
  useEffect(() => {
    sessionStorage.setItem("orderList", JSON.stringify(orderList));
  }, [orderList]);

  return (
    <OrderContext.Provider
      value={{ orderList, setOrderList, addToOrder, popupDetails }}
    >
      {children}
    </OrderContext.Provider>
  );
};
