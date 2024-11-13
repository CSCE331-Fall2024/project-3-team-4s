import React, { useState } from 'react';

const SideModal = ({ side, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('small'); // 'small' or 'large'

  if (!side) return null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{side.name}</h2>
        <img src={side.image} alt={side.name} className="modal-image" />
        

        <h2 className='appetizer-price'>${side.price.toFixed(2)}</h2>
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

export default SideModal;
