import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import Employees from "./pages/Employees";
import GreetingPage from "./pages/GreetingPage";
import OrderPage from "./pages/OrderPage";

const App = () => {
  return (
    <div className="global">
      <Routes>
        <Route path="/" element={<GreetingPage />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/cashier" element={<CashierHome />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </div>
  );
};

export default App;
