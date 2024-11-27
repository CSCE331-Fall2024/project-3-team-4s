import express from "express";
import cors from "cors";
import kioskRoutes from "./routes/kioskRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import cashierRoutes from "./routes/cashierRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";

const app = express(); // Create an Express app
const port = process.env.PORT || 3000; // Dynamically set the port or default to 3000

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Routes
app.use("/kiosk", kioskRoutes); // Use the kiosk routes
app.use("/inventory", inventoryRoutes); // Use the inventory routes
app.use("/employee", employeeRoutes); // Use the employee routes
app.use("/reports", reportsRoutes); // Use the reports routes
app.use("/cashier", cashierRoutes); // Use the cashier routes
app.use("/translate", translateRoutes); // Use the translate routes
app.use("/weather", weatherRoutes); // Use the weather routes
app.use("/menu", menuRoutes); // use the menu routes

console.log("Translate route initialized");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
