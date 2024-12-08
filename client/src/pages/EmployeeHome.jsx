import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeHome.css";
import Button from "../components/Button";
import ManagerVerifyModal from "../components/ManagerVerifyModal";

const EmployeeHome = () => {
  const backendURL = "http://localhost:3000";
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
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

  const decodeJWT = (token) => {
    const payloadBase64 = token.split(".")[1]; // Extract payload
    const payloadDecoded = atob(payloadBase64); // Decode from Base64

    return JSON.parse(payloadDecoded); // Parse to JSON
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        // Decode the token to extract the payload
        const payload = decodeJWT(token);
        const employeeID = payload.employeeID;

        localStorage.setItem("employeeID", employeeID); // Store employee ID in local storage
        localStorage.setItem("token", token); // Store token in local storage

        window.history.replaceState({}, document.title, "/employee"); // Remove token from URL
      } catch (err) {
        console.error(err);
        navigate("/"); // Redirect to the home page
      }
    } else {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        navigate("/"); // Redirect to the home page
      }
    }
  }, [navigate]);

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
