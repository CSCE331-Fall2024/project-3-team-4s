import db from "../db.js";

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await db.any("SELECT * FROM menu_item WHERE on_menu = true");
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const { item_name, item_price, item_category, current_servings } = req.body;

    if (!item_name || !item_price || !item_category) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    const newMenuItem = await db.one(
      `INSERT INTO menu_item (item_name, item_price, item_category, current_servings, on_menu)
       VALUES ($1, $2, $3, $4, true) RETURNING *`,
      [item_name, item_price, item_category, current_servings || 0]
    );

    res.json(newMenuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, item_price, item_category, current_servings } = req.body;

    if (!item_name || !item_price || !item_category) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    const updatedMenuItem = await db.one(
      `UPDATE menu_item
       SET item_name = $1, item_price = $2, item_category = $3, current_servings = $4
       WHERE menu_item_id = $5 RETURNING *`,
      [item_name, item_price, item_category, current_servings, id]
    );

    res.json(updatedMenuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.none("UPDATE menu_item SET on_menu = false WHERE menu_item_id = $1", [id]);

    res.json({ message: `Menu item ${id} set to off menu` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };