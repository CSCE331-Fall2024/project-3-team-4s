import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeHome.css";
import Button from "../components/Button";
import ManagerVerifyModal from "../components/ManagerVerifyModal";

const EmployeeHome = () => {
  const backendURL = "http://localhost:3000";
  const navigate = useNavigate();
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const openVerifyModal = () => {
    setShowVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
  };

  const verifyManager = async (managerID) => {
    try {
      const res = await axios.post(`${backendURL}/auth/verify-manager`, {
        managerID,
      });

      if (res.status === 200) {
        navigate("/manager");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="employee-home-container">
      <div className="employee-home-buttons">
        <Button
          text="Manager"
          className="big-custom-button"
          onClick={openVerifyModal}
        />
        <Button
          text="Cashier"
          className="big-custom-button"
          onClick={() => navigate("/cashier")}
        />
      </div>

      {showVerifyModal && (
        <ManagerVerifyModal
          onCancel={closeVerifyModal}
          onVerify={verifyManager}
        />
      )}
    </div>
  );
};

export default EmployeeHome;
