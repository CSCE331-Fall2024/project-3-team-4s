// CustomerHomeWrapper.js
import React from "react";
import { OrderProvider } from "../contexts/OrderContext";
import CustomerHome from "./CustomerHome";

const CustomerHomeWrapper = () => (
  <OrderProvider>
    <CustomerHome />
  </OrderProvider>
);

export default CustomerHomeWrapper;
