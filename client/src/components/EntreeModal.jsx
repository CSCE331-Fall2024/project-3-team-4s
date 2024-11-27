import React, { useState } from 'react';
import { useOrder } from '../pages/OrderContext';
import '../pages/CustomerHome.css';



const EntreeModal = ({ entree, onClose, resetSelections }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToOrder } = useOrder();
  if (!entree) return null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToOrder = () => {
    resetSelections(); // Reset the selections in the parent component
    addToOrder(entree.name, quantity);
    onClose(); // Close the modal after adding to the order
  };
    
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        <div className='modal-name'><h2>{entree.name}</h2></div>
        <img src={entree.image} alt={entree.name} className="modal-image" />

        <div className='modal-name'><h2 className='appetizer-price'>${entree.price.toFixed(2)}</h2></div>
        
        {/* Quantity Selector */}
        <div className="quantity-selector">
          <button onClick={decrementQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={incrementQuantity}>+</button>
        </div>

        <button className="add-to-order-button" onClick={handleAddToOrder}>Add to Order</button>
      </div>
    </div>
  );
};

export default EntreeModal;
