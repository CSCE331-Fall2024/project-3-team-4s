import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import Employees from "./pages/Employees";

const App = () => {
  return (
    <div className="global">
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/cashier" element={<CashierHome />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
    </div>
  );
};

export default App;
