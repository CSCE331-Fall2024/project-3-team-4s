import React, { useState } from 'react';

const DrinkModal = ({ drink, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  if (!drink) return null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{drink.name}</h2>
        <img src={drink.image} alt={drink.name} className="modal-image" />

        <h2 className='appetizer-price'>${drink.price.toFixed(2)}</h2>
        
        {/* Quantity Selector */}
        <div className="quantity-selector">
          <button onClick={decrementQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={incrementQuantity}>+</button>
        </div>

        <button className="add-to-order-button">Add to Order</button>
      </div>
    </div>
  );
};

export default DrinkModal;
