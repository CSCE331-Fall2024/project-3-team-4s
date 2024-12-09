import { Route, Routes } from "react-router-dom";
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
import { LanguageProvider } from "./pages/LanguageContext";

const App = () => {
  return (
    <LanguageProvider>
      <TranslateProvider>
        <div className="global">
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
    </LanguageProvider>
  );
};

export default App;
