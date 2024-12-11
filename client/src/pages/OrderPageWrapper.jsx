// OrderPageWrapper.js
import React from "react";
import { OrderProvider } from "../contexts/OrderContext";
import OrderPage from "./OrderPage";

const OrderPageWrapper = () => (
  <OrderProvider>
    <OrderPage />
  </OrderProvider>
);

export default OrderPageWrapper;
