import db from "../db.js"

const pushToMenuItemTable = async (req, res) => {
  try {
    const { menu_item_id, item_quantity } = req.body;

    if (!menu_item_id || !item_quantity) {
      return res.status(400).json({ message: "Please provide the menu item ID and item quantity" });
    }

    const updatedItem = await db.oneOrNone(
      `UPDATE menu_item 
       SET current_servings = current_servings - $2 
       WHERE menu_item_id = $1 AND current_servings >= $2
       RETURNING *`,
      [menu_item_id, item_quantity]
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

const addCustomer = async (req, res) => {
  try {
    let { first_name, last_name, email, phone } = req.body;

    // Trim whitespace and convert email to lowercase
    email = email.trim().toLowerCase();
    first_name = first_name.trim();
    last_name = last_name.trim();
    phone = phone.trim();

    // Validate input
    if (!first_name || !last_name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "First name, last name, email, and phone number are required." });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate phone number format (e.g., 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format. Please enter a 10-digit number." });
    }

    // Check if email or phone already exists in the database
    const emailExists = await db.oneOrNone(
      `SELECT 1 FROM customer WHERE email = $1`,
      [email]
    );

    const phoneExists = await db.oneOrNone(
      `SELECT 1 FROM customer WHERE phone = $1`,
      [phone]
    );

    if (emailExists) {
      return res.status(400).json({ message: "A customer with this email already exists." });
    }

    if (phoneExists) {
      return res.status(400).json({ message: "A customer with this phone number already exists." });
    }

    // If email and phone are unique, insert the new customer
    const newCustomer = await db.one(
      `INSERT INTO customer (first_name, last_name, email, reward_points, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [first_name, last_name, email, 0, phone]
    );

    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    console.error("Error adding customer:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
const getCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format. Please enter a 10-digit number." });
    }

    // Search for the customer by phone number
    const customer = await db.oneOrNone(
      `SELECT customer_id, first_name, last_name, email, phone FROM customer WHERE phone = $1`,
      [phone]
    );

    if (customer) {
      res.status(200).json({ success: true, customer });
    } else {
      res.status(404).json({ success: false, message: "Customer not found." });
    }
  } catch (error) {
    console.error("Error fetching customer by phone:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


  
  export { pushToTransactionsMenuTable, pushToTransactionTable, pushToMenuItemTable, addCustomer, getCustomerByPhone };