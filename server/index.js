import express from "express";
import cors from "cors";
import kioskRoutes from "./routes/kioskRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import cashierRoutes from "./routes/cashierRoutes.js";
import translateRoutes from "./routes/translateRoutes.js"; 
import weatherRoutes from './routes/weatherRoutes.js';


const app = express(); // Create an Express app
const port = 3000; // Set the port

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing
app.use("/kiosk", kioskRoutes); // Use the kiosk routes
app.use("/inventory", inventoryRoutes); // Use the inventory routes
app.use("/employee", employeeRoutes); // Use the employee routes
app.use("/cashier", cashierRoutes); // Use the cashier routes
app.use('/translate', translateRoutes); // Use the translate routes
app.use('/weather', weatherRoutes); // Add the route with a base path

console.log("Translate route initialized");

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
