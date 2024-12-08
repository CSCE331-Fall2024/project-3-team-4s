import db from "../db.js";

const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await db.any(
      "SELECT * FROM inventory WHERE in_stock = true"
    );

    res.json(inventoryItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMinStockInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await db.any(
      "SELECT * FROM inventory WHERE in_stock = true and current_stock < min_stock"
    );

    res.json(inventoryItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNonMinStockInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await db.any(
      "SELECT * FROM inventory WHERE in_stock = true and current_stock >= min_stock"
    );

    res.json(inventoryItems);
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

      return res.json({
        inventoryItem: updatedInventoryItem,
        message: `${ingredient_name} added`,
      });
    }

    const newInventoryItem = await db.one(
      "INSERT INTO inventory (ingredient_name, current_stock, price, unit, min_stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [ingredient_name, 0, price, unit, min_stock]
    );

    res.json({
      inventoryItem: newInventoryItem,
      message: `${ingredient_name} added`,
    });
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

    res.json({
      inventoryItem: updatedInventoryItem,
      message: `${ingredient_name} updated`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const restockInventoryItems = async (req, res) => {
  try {
    // Extract order from the request body
    const order = req.body;
    console.log(order);

    // Iterate through the order and update inventory
    for (const item of order) {
      const { ingredient_id, ingredient_name, quantity, total_price } = item;
      console.log(ingredient_id, ingredient_name, quantity, total_price);

      await db.none(
        "UPDATE inventory SET current_stock = current_stock + $1 WHERE ingredient_id = $2",
        [quantity, ingredient_id]
      );
    }

    res.json({ message: "Inventory restocked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;

    const { ingredient_name } = await db.one(
      "SELECT ingredient_name FROM inventory WHERE ingredient_id = $1",
      [id]
    );

    await db.none(
      "UPDATE inventory SET in_stock = false WHERE ingredient_id = $1",
      [id]
    );

    res.json({ message: `${ingredient_name} deleted` });
  } catch (err) {
    console.error(err);
    res.res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getInventoryItems,
  getMinStockInventoryItems,
  getNonMinStockInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  restockInventoryItems,
  deleteInventoryItem,
};
