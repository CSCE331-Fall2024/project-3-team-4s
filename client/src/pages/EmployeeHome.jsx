import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeHome.css";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

const EmployeeHome = () => {
  const backendURL = "http://localhost:3000";
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const decodeJWT = (token) => {
    const payloadBase64 = token.split(".")[1]; // Extract payload
    const payloadDecoded = atob(payloadBase64); // Decode from Base64

    return JSON.parse(payloadDecoded); // Parse to JSON
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || localStorage.getItem("token");

    if (token && !localStorage.getItem("token")) {
      try {
        // Decode the token to extract the payload
        const payload = decodeJWT(token);
        const employeeID = payload.employeeID;
        const employeeFirstName = payload.employeeFirstName;
        const employeeLastName = payload.employeeLastName;

        setFirstName(employeeFirstName);
        setLastName(employeeLastName);

        localStorage.setItem("employeeID", employeeID); // Store employee ID in local storage
        localStorage.setItem("employeeFirstName", employeeFirstName); // Store first name in local storage
        localStorage.setItem("employeeLastName", employeeLastName); // Store last name in local storage
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

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="employee-home-container">
      <PageHeader
        pageTitle={`Employee Home (Logged in as ${
          firstName || localStorage.getItem("employeeFirstName")
        } ${lastName || localStorage.getItem("employeeLastName")})`}
      />
      <div className="employee-home-button-container">
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

        <div className="employee-home-nav">
          <Button
            text="Home"
            className="med-custom-button"
            onClick={() => navigate("/")}
          />
          <Button
            text="Logout"
            className="med-custom-button"
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
