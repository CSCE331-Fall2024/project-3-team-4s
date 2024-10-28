import axios from "axios";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import GreetingPage from "./pages/GreetingPage";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";

const App = () => {
  useEffect(() => {
    // Async function to fetch menu data from the server
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/kiosk/meal-types");

        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    // Call the async function
    fetchItems();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<GreetingPage />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/cashier" element={<CashierHome />} />
      </Routes>
    </>
  );
};

export default App;
