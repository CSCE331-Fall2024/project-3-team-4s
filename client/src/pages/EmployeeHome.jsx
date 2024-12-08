import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeHome.css";
import Button from "../components/Button";

const EmployeeHome = () => {
  // const backendURL = "http://localhost:3000";
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const verifyManager = async () => {
    const managerID = localStorage.getItem("employeeID");

    try {
      const res = await axios.post(`${backendURL}/auth/verify-manager`, {
        managerID,
      });

      if (res.status === 200) {
        navigate("/manager");
      }
    } catch (err) {
      alert(err.response.data.message);
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
          onClick={verifyManager}
        />
        <Button
          text="Cashier"
          className="big-custom-button"
          onClick={() => navigate("/cashier")}
        />
      </div>
    </div>
  );
};

export default EmployeeHome;
