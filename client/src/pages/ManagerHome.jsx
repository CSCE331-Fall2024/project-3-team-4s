import { useNavigate } from "react-router-dom";
import "./ManagerHome.css";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";

const ManagerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="manager-home-container">
      <PageHeader pageTitle="Admin" />

      <div className="manager-button-container">
        <div className="manager-button-col">
          <Button
            text="Edit Menu"
            onClick={() => navigate("/menu")}
            className="big-custom-button"
          />
          <Button
            text="Manage Employees"
            onClick={() => navigate("/employees")}
            className="big-custom-button"
          />
        </div>

        <div className="manager-button-col">
          <Button
            text="Reports"
            onClick={() => navigate("/reports")}
            className="big-custom-button"
          />
          <Button
            text="Manage Inventory"
            onClick={() => navigate("/inventory")}
            className="big-custom-button"
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
