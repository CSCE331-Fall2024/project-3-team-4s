import express from "express";
import cors from "cors";
import kioskRoutes from "./routes/kioskRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express(); // Create an Express app
const port = 3000; // Set the port

app.use(cors()); // Enable CORS
app.use("/kiosk", kioskRoutes); // Use the kiosk routes
app.use("/employee", employeeRoutes); // Use the employee routes

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
