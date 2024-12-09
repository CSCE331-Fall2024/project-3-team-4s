import db from "../db.js";

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
