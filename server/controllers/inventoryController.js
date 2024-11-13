import db from "../db.js";

const getInventoryItems = async (req, res) => {
  try {
    const inventoryItem = await db.any(
      "SELECT * FROM inventory where in_stock = true"
    );

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

    // Check if the inventory item already exists
    const existingInventoryItem = await db.oneOrNone(
      "SELECT * FROM inventory WHERE ingredient_name = $1",
      [ingredient_name]
    );

    if (existingInventoryItem) {
      // If the inventory item exists, set in_stock to true and update the price, unit, and min_stock
      const updatedInventoryItem = await db.one(
        "UPDATE inventory SET in_stock = true, price = $1, unit = $2, min_stock = $3 WHERE ingredient_id = $4 RETURNING *",
        [price, unit, min_stock, existingInventoryItem.ingredient_id]
      );

      return res.json({ inventoryItem: updatedInventoryItem });
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

const updateInventoryItem = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;
    // Extract the ingredient_name, price, unit, and min_stock from the request body
    const { ingredient_name, price, unit, min_stock } = req.body;

    const updatedInventoryItem = await db.one(
      "UPDATE inventory SET ingredient_name = $1, price = $2, unit = $3, min_stock = $4 WHERE ingredient_id = $5 RETURNING *",
      [ingredient_name, price, unit, min_stock, id]
    );

    res.json({ inventoryItem: updatedInventoryItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const restockInventoryItem = async (req, res) => {};

const deleteInventoryItem = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;

    await db.none(
      "UPDATE inventory SET in_stock = false WHERE ingredient_id = $1",
      [id]
    );

    res.json({ message: `Inventory item ${id} set to out of stock` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  restockInventoryItem,
  deleteInventoryItem,
};
