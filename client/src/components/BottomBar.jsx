// BottomBar.jsx
import React from 'react';
import '../pages/CustomerHome.css';


const BottomBar = ({ selectedItem, selectedSides, selectedEntrees, addToOrder, resetSelections }) => {
  const handleAddToOrder = () => {
    // Add main item (Bowl, Plate, or Bigger Plate) to the order
    addToOrder(selectedItem.item_name, 1);

    // Add selected sides and entrees to the order
    const items = [
      ...selectedSides.map(side => ({ name: side.item_name, quantity: 1 })),
      ...selectedEntrees.map(entree => ({ name: entree.item.item_name, quantity: entree.count })),
    ];
    items.forEach(item => addToOrder(item.name, item.quantity));

    // Reset selections and go back to the main menu
    resetSelections();
  };

  return (
    <div className="bottom-bar">
      <div className="selected-items">
        <h3>Selected: {selectedItem.item_name}</h3>
        <ul>
          {selectedSides.map((side, index) => (
            <li key={index}>{side.item_name} (Side)</li>
          ))}
          {selectedEntrees.map((entree, index) => (
            <li key={index}>{entree.item.item_name} (Entree) x {entree.count}</li>
          ))}
        </ul>
      </div>
      <button className="add-to-order-button" onClick={handleAddToOrder}>Add to Order</button>
    </div>
  );
};

export default BottomBar;
