import db from "../db.js";

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Operations related to menu management
 */

/**
 * @swagger
 * /menu/get-menu:
 *   get:
 *     summary: Get all menu items that are currently on the menu
 *     description: Retrieve a list of all menu items that are marked as "on_menu"
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await db.any(
      "SELECT * FROM menu_item WHERE on_menu = true"
    );
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /menu/add-menu-item:
 *   post:
 *     summary: Add a new menu item or restore an existing one
 *     description: Add a new menu item to the menu if it doesn't exist, or update its price and category if it does and set "on_menu" to true
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *               item_price:
 *                 type: number
 *               item_category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item added or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 menuItem:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields for adding menu item
 *       500:
 *         description: Internal server error
 */
const addMenuItem = async (req, res) => {
  try {
    const { item_name, item_price, item_category } = req.body;

    if (!item_name || !item_price || !item_category) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    const existingMenuItem = await db.oneOrNone(
      "SELECT * FROM menu_item WHERE item_name = $1",
      [item_name]
    );

    if (existingMenuItem) {
      const updatedMenuItem = await db.one(
        `UPDATE menu_item
         SET item_price = $1, item_category = $2, on_menu = true
         WHERE item_name = $3 RETURNING *`,
        [item_price, item_category, item_name]
      );

      return res.json({
        menuItem: updatedMenuItem,
        message: `${item_name} added to menu`,
      });
    }

    const newMenuItem = await db.one(
      `INSERT INTO menu_item (item_name, item_price, item_category, current_servings, on_menu)
       VALUES ($1, $2, $3, 0, true) RETURNING *`,
      [item_name, item_price, item_category]
    );

    res.json({
      menuItem: newMenuItem,
      message: `${item_name} added to menu`,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /menu/update-menu-item/{id}:
 *   put:
 *     summary: Update a menu item
 *     description: Update the details of an existing menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the menu item to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *               item_price:
 *                 type: number
 *               item_category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 menuItem:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields for updating menu item
 *       500:
 *         description: Internal server error
 */
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, item_price, item_category } = req.body;

    if (!item_name || !item_price || !item_category) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    const updatedMenuItem = await db.one(
      `UPDATE menu_item
       SET item_name = $1, item_price = $2, item_category = $3
       WHERE menu_item_id = $4 RETURNING *`,
      [item_name, item_price, item_category, id]
    );

    res.json({
      menuItem: updatedMenuItem,
      message: `${item_name} updated`,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /delete-menu-items/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Remove a menu item from the menu by setting its "on_menu" status to false
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the menu item to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item removed from the menu successfully
 *       500:
 *         description: Internal server error
 */
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.none(
      "UPDATE menu_item SET on_menu = false WHERE menu_item_id = $1",
      [id]
    );

    res.json({ message: `Menu item ${id} removed from menu` });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };
