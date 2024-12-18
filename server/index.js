import express from "express";
import cors from "cors";
import kioskRoutes from "./routes/kioskRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import cashierRoutes from "./routes/cashierRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
app.use("/menu", menuRoutes); // Use the menu routes
app.use("/auth", authRoutes); // Use the auth routes

// Swagger documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Panda Express Documentation (Backend)",
      version: "1.0.0",
      description: "Documentation for the system's API routes",
    },
    servers: [
      {
        url: "http://localhost:3000",
        url: "https://project-3-backend-chkb.onrender.com/",
      },
    ],
  },
  apis: ["./controllers/*.js", "./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
