import { Route, Routes } from "react-router-dom";
import GreetingPage from "./pages/GreetingPage";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import ReportsPage from "./pages/ReportsPage";
import Inventory from "./pages/Inventory";
import EditMenu from "./pages/EditMenu";
import Employees from "./pages/Employees";
import OrderPage from "./pages/OrderPage";

const App = () => {
  return (
    <div className="global">
      <Routes>
        <Route path="/" element={<GreetingPage />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/cashier" element={<CashierHome />} />
        <Route path="/menu" element={<EditMenu />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </div>
  );
};

export default App;
