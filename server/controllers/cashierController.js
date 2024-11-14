import db from "../db.js"

const pushToMenuItemTable = async (req, res) => {
    try {
      // Extract the item_name from the request body
      const { item_name } = req.body;
  
      if (!item_name) {
        return res.status(400).json({ message: "Please provide the item name" });
      }
  
      // Query to update the current_servings column by subtracting one
      const updatedItem = await db.one(
        "UPDATE menu_item SET current_servings = current_servings - 1 WHERE item_name = $1 RETURNING *",
        [item_name]
      );
  
      res.json({ item: updatedItem });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

const pushToTransactionTable = async (req, res) => {
    try {
      // Extract the first_name, last_name, and role from the request body
      const { first_name, last_name, role } = req.body;
  
      if (!first_name || !last_name || !role) {
        return res.status(400).json({ message: "Please fill out all fields" });
      }
  
      const newEmployee = await db.one(
        "INSERT INTO employee (first_name, last_name, role) VALUES ($1, $2, $3) RETURNING *",
        [first_name, last_name, role]
      );
  
      res.json({ employee: newEmployee });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  const getLatestTransactionId = async (req, res) => {
    try {
      // Query to get the latest transaction ID
      const result = await db.one(
        "SELECT transaction_id FROM transaction ORDER BY transaction_id DESC LIMIT 1"
      );
      res.json({ transaction_id: result.transaction_id });
    } catch (err) {
      console.error('Error fetching latest transaction ID:', err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const pushToTransactionsMenuTable = async (req, res) => {
    try {
      // Extract the menu_item_id, transaction_id, and item_quantity from the request body
      const { menu_item_id, transaction_id, item_quantity } = req.body;
  
      // Check if all required fields are provided
      if (!menu_item_id || !transaction_id || !item_quantity) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }
  
      // Insert the new transaction menu item into the menu_item_transaction table
      const newTransactionMenuItem = await db.one(
        "INSERT INTO menu_item_transaction (menu_item_id, transaction_id, item_quantity) VALUES ($1, $2, $3) RETURNING *",
        [menu_item_id, transaction_id, item_quantity]
      );
  
      // Send the inserted transaction menu item data as the response
      res.json({ transactionMenuItem: newTransactionMenuItem });
    } catch (err) {
      // Handle any errors that occur during the query execution
      console.error('Error adding transaction menu item:', err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export { pushToTransactionsMenuTable, pushToTransactionTable, pushToMenuItemTable,getLatestTransactionId };