import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AccessibilityContext } from "./contexts/AccessibilityContext";
import Home from "./pages/Home";
import CustomerHome from "./pages/CustomerHomeWrapper";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import ReportsPage from "./pages/ReportsPage";
import Inventory from "./pages/Inventory";
import Restock from "./pages/Restock";
import EditMenu from "./pages/EditMenu";
import Employees from "./pages/Employees";
import OrderPage from "./pages/OrderPageWrapper";
import CategoryPage from "./pages/CategoryPage";
import EmployeeHome from "./pages/EmployeeHome";
import { OrderProvider } from "./pages/OrderContext";
import { TranslateProvider } from "./contexts/TranslateContext";

const App = () => {
  const { settings } = useContext(AccessibilityContext);

  const appStyle = {
    filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
  };

  return (
    <TranslateProvider>
      <div className="global" style={appStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/manager" element={<ManagerHome />} />
          <Route path="/cashier" element={<CashierHome />} />
          <Route path="/employee" element={<EmployeeHome />} />
          <Route path="/menu" element={<EditMenu />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/restock" element={<Restock />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/order" element={<OrderPage />} />
          <Route
            path="/category/:categoryName"
            element={
              <OrderProvider>
                <CategoryPage />
              </OrderProvider>
            }
          />
        </Routes>
      </div>
    </TranslateProvider>
  );
};

export default App;
