import React from 'react';
import '../pages/CustomerHome.css';

const BottomBar = ({ selectedItem, selectedSides, selectedEntrees, addToOrder, resetSelections }) => {
  const validateSelections = () => {
    // Determine the required number of entrees based on the selected item
    const requiredEntrees =
      selectedItem.item_name === 'Bowl'
        ? 1
        : selectedItem.item_name === 'Plate'
        ? 2
        : selectedItem.item_name === 'Bigger Plate'
        ? 3
        : 0;

    // Validate at least one side is selected
    if (selectedSides.length < 1) {
      alert('Please select at least one side.');
      return false;
    }

    // Validate the required number of entrees is selected
    const totalEntreesSelected = selectedEntrees.reduce((sum, entree) => sum + entree.count, 0);
    if (totalEntreesSelected < requiredEntrees) {
      alert(`Please select at least ${requiredEntrees} entree(s).`);
      return false;
    }

    return true;
  };

  const handleAddToOrder = () => {
    if (!validateSelections()) return; // Stop if validation fails

    // Add main item (Bowl, Plate, or Bigger Plate) to the order
    addToOrder(selectedItem.item_name, 1,);

    // Add selected sides and entrees to the order
    const items = [
      ...selectedSides.map((side) => ({ name: side.item_name, quantity: 1 })),
      ...selectedEntrees.map((entree) => ({ name: entree.item.item_name, quantity: entree.count })),
    ];
    items.forEach((item) => addToOrder(item.name, item.quantity));

    // Reset selections and go back to the main menu
    resetSelections();
  };

  return (
    <div className="bottom-bar">
      <div className="selected-items">
        <h3>Selected: {selectedItem.item_name}</h3>
        <ul>
          {selectedSides.map((side, index) => (
            <li key={index}>
              <strong>(Side)</strong> {side.item_name}
            </li>
          ))}
          {selectedEntrees.map((entree, index) => (
            <li key={index}>
              <strong>(Entree)</strong> {entree.item.item_name} x {entree.count}
            </li>
          ))}
        </ul>
      </div>
      <button className="add-to-order-button-bottom" onClick={handleAddToOrder}>
        Add to Order
      </button>
    </div>
  );
};

export default BottomBar;
