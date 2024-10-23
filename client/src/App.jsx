import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Async function to fetch test data from the server
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/test");

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the async function
    fetchData();
  }, []);

  return (
    <>
      <h1>{data}</h1>

      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/cashier" element={<CashierHome />} />
      </Routes>
    </>
  );
};

export default App;
