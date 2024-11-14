// OrderPageWrapper.js
import React from 'react';
import { OrderProvider } from './OrderContext';
import OrderPage from './OrderPage';

const OrderPageWrapper = () => (
  <OrderProvider>
    <OrderPage />
  </OrderProvider>
);

export default OrderPageWrapper;
