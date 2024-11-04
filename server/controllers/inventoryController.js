import db from "../db.js";

const getInventoryItems = async (req, res) => {
  try {
    const inventoryItem = await db.any("SELECT * FROM inventory");

    res.json(inventoryItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addInventoryItem = async (req, res) => {
  try {
    // Extract the ingredient_name, price, unit, and min_stock from the request body
    const { ingredient_name, price, unit, min_stock } = req.body;

    if (!ingredient_name || !price || !unit || !min_stock) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    const newInventoryItem = await db.one(
      "INSERT INTO inventory (ingredient_name, current_stock, price, unit, min_stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [ingredient_name, 0, price, unit, min_stock]
    );

    res.json({ inventoryItem: newInventoryItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateInventoryItem = async (req, res) => {};

const restockInventoryItem = async (req, res) => {};

const deleteInventoryItem = async (req, res) => {};

export {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  restockInventoryItem,
  deleteInventoryItem,
};
