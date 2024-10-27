import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express(); // Create an Express app
const port = 3000; // Set the port

app.use(cors()); // Enable CORS

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Test route to get all menu items
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await db.any("SELECT * FROM menu_item");
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/menu/meals", async (req, res) => {
  try {
    const mealItems = await db.any("SELECT * FROM menu_item WHERE item_category = 'Meal'");
    res.json(mealItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/menu/sides", async (req, res) => {
  try {
    const mealItems = await db.any("SELECT * FROM menu_item WHERE item_category = 'Side'");
    res.json(mealItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/menu/entree", async (req, res) => {
  try {
    const mealItems = await db.any("SELECT * FROM menu_item WHERE item_category = 'Entree'");
    res.json(mealItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/menu/appetizer", async (req, res) => {
  try {
    const mealItems = await db.any("SELECT * FROM menu_item WHERE item_category = 'Appetizer'");
    res.json(mealItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});