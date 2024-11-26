import db from "../db.js"

const pushToMenuItemTable = async (req, res) => {
  try {
    const { menu_item_id } = req.body;

    if (!menu_item_id) {
      return res.status(400).json({ message: "Please provide the menu item ID" });
    }

    const updatedItem = await db.oneOrNone(
      `UPDATE menu_item 
       SET current_servings = current_servings - 1 
       WHERE menu_item_id = $1 AND current_servings > 0
       RETURNING *`,
      [menu_item_id]
    );

    if (!updatedItem) {
      return res.status(400).json({ message: "Unable to update item. It may be out of stock." });
    }

    res.json({ item: updatedItem });
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};

  

const pushToTransactionTable = async (req, res) => {
  try {
    const {
      total_cost,
      transaction_time,
      transaction_date,
      transaction_type,
      customer_id,    // Optional, since it's nullable in the database
      employee_id,
      week_number     // Optional, based on your table definition
    } = req.body;
  
    // Validation: Check for required fields
    if (
      total_cost === undefined ||
      !transaction_time ||
      !transaction_date ||
      !transaction_type ||
      !employee_id
    ) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
  
    // Prepare the values array for the INSERT statement
    const values = [
      total_cost,
      transaction_time,
      transaction_date,
      transaction_type,
      customer_id || null,  // Use null if customer_id is undefined
      employee_id,
      week_number || null   // Use null if week_number is undefined
    ];
  
    const newTransaction = await db.one(
      `INSERT INTO transaction (
        total_cost, transaction_time, transaction_date, transaction_type,
        customer_id, employee_id, week_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      values
    );
  
    res.json({ transaction: newTransaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
  
};

  
const pushToTransactionsMenuTable = async (req, res) => {
  try {
    const { menu_item_id, transaction_id, item_quantity } = req.body;

    if (!menu_item_id || !transaction_id || !item_quantity) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newTransactionMenuItem = await db.one(
      "INSERT INTO menu_item_transaction (menu_item_id, transaction_id, item_quantity) VALUES ($1, $2, $3) RETURNING *",
      [menu_item_id, transaction_id, item_quantity]
    );

    res.json({ transactionMenuItem: newTransactionMenuItem });
  } catch (err) {
    console.error('Error adding transaction menu item:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};

  
  export { pushToTransactionsMenuTable, pushToTransactionTable, pushToMenuItemTable };