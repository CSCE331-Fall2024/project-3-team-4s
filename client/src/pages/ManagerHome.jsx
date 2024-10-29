import "./ManagerHome.css";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button"; 

const ManagerHome = () => {
  return (
    <div className="ManagerHome-container">
      <PageHeader pageTitle="Admin Page" />
      <div className="bigButton-container">
        <Button text="Edit Menu" className="big-button" />
        <Button text="Reports" className="big-button" />
        <Button text="Manage Employees" className="big-button" />
        <Button text="Manage Inventory" className="big-button" />
      </div>
    </div>
  );
};

export default ManagerHome;