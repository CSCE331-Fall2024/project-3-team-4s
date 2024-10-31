import { useNavigate } from "react-router-dom";
import "./ManagerHome.css";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";

const ManagerHome = () => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate("/menu");
  };

  const handleReportsClick = () => {
    navigate("/reports");
  };

  const handleEmployeesClick = () => {
    navigate("/employees");
  };

  const handleInventoryClick = () => {
    navigate("/inventory");
  };

  return (
    <div className="manager-home-container">
      <PageHeader pageTitle="Admin" />
      <div className="manager-button-container">
        <div className="manager-button-col">
          <Button
            text="Edit Menu"
            onClick={handleMenuClick}
            className="big-custom-button"
          />
          <Button
            text="Manage Employees"
            onClick={handleEmployeesClick}
            className="big-custom-button"
          />
        </div>
        <div className="manager-button-col">
          <Button
            text="Reports"
            onClick={handleReportsClick}
            className="big-custom-button"
          />
          <Button
            text="Manage Inventory"
            onClick={handleInventoryClick}
            className="big-custom-button"
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
