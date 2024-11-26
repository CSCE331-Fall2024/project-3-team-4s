import React from "react";
import '../pages/CustomerHome.css';

const PopupNotification = ({ popupDetails }) => {
  if (!popupDetails) return null;

  return (
    <div className="popup-notification">
      <p>
        Added {popupDetails.quantity} {popupDetails.name} {popupDetails.isBowl} {popupDetails.isPlate} {popupDetails.isBiggerPlate} to the order.
      </p>
    </div>
  );
};

export default PopupNotification;
