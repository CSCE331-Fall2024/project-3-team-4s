import axios from "axios";
import { useEffect, useState } from "react";

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
    </>
  );
};

export default App;
