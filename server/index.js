import express from "express";
import cors from "cors";
import kioskRoutes from "./routes/kioskRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express(); // Create an Express app
const port = process.env.PORT || 3000; // Dynamically set the port or default to 3000

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing
app.use("/kiosk", kioskRoutes); // Use the kiosk routes
app.use("/inventory", inventoryRoutes); // Use the inventory routes
app.use("/employee", employeeRoutes); // Use the employee routes

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
