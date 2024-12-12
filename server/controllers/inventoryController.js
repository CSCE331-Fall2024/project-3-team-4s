import db from "../db.js";

/**
 * @swagger
 * tags:
 *   - name: Inventory
 *     description: Operations related to inventory management
 */

/**
 * @swagger
 * /inventory/get-inventory:
 *   get:
 *     summary: Get all inventory items that are in stock
 *     description: Get all inventory items that are in stock, meaning they're "in_stock" is set to true
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ingredient_id:
 *                     type: integer
 *                   ingredient_name:
 *                     type: string
 *                   current_stock:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 *                   unit:
 *                     type: string
 *                   min_stock:
 *                     type: integer
 *                   in_stock:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /inventory/get-min-stock:
 *   get:
 *     summary: Get inventory items with low stock
 *     description: Get inventory items that are in stock and have current stock less than minimum stock
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items with low stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ingredient_id:
 *                     type: integer
 *                   ingredient_name:
 *                     type: string
 *                   current_stock:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 *                   unit:
 *                     type: string
 *                   min_stock:
 *                     type: integer
 *                   in_stock:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /inventory/get-non-min-stock:
 *   get:
 *     summary: Get inventory items with sufficient stock
 *     description: Get inventory items that are in stock and have current stock greater than or equal to minimum stock
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items with sufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ingredient_id:
 *                     type: integer
 *                   ingredient_name:
 *                     type: string
 *                   current_stock:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 *                   unit:
 *                     type: string
 *                   min_stock:
 *                     type: integer
 *                   in_stock:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /inventory/add-inventory:
 *   post:
 *     summary: Add a new inventory item
 *     description: Add a new inventory item with the specified information
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredient_name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               unit:
 *                 type: string
 *               min_stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventory item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventoryItem:
 *                   type: object
 *                   properties:
 *                     ingredient_id:
 *                       type: integer
 *                     ingredient_name:
 *                       type: string
 *                     current_stock:
 *                       type: integer
 *                     price:
 *                       type: number
 *                       format: float
 *                     unit:
 *                       type: string
 *                     min_stock:
 *                       type: integer
 *                     in_stock:
 *                       type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /inventory/update-inventory/{id}:
 *   put:
 *     summary: Update an inventory item by ID
 *     description: Update an inventory item with the specified ID using the provided information
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the inventory item to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredient_name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               unit:
 *                 type: string
 *               min_stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventoryItem:
 *                   type: object
 *                   properties:
 *                     ingredient_id:
 *                       type: integer
 *                     ingredient_name:
 *                       type: string
 *                     current_stock:
 *                       type: integer
 *                     price:
 *                       type: number
 *                       format: float
 *                     unit:
 *                       type: string
 *                     min_stock:
 *                       type: integer
 *                     in_stock:
 *                       type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /inventory/restock-inventory:
 *   post:
 *     summary: Restock inventory items
 *     description: Restock inventory items based on the order provided
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 ingredient_id:
 *                   type: integer
 *                 ingredient_name:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 total_price:
 *                   type: number
 *                   format: float
 *     responses:
 *       200:
 *         description: Inventory successfully restocked
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /inventory/delete-inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item by ID
 *     description: Delete an inventory item with the specified ID by setting its "in_stock" to false
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the inventory item to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *       500:
 *         description: Internal server error
 */
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
