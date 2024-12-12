import db from "../db.js";

/**
 * @swagger
 * tags:
 *   - name: Cashier
 *     description: Operations related to cashier responsibilities
 */

/**
 * @swagger
 * /cashier/put-menu:
 *   put:
 *     summary: Update menu item servings
 *     description: Decrease the current servings of a menu item by the specified quantity
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menu_item_id:
 *                 type: integer
 *               item_quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully updated menu item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   type: object
 *       400:
 *         description: Item out of stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const pushToMenuItemTable = async (req, res) => {
  try {
    const { menu_item_id, item_quantity } = req.body;

    if (!menu_item_id || !item_quantity) {
      return res
        .status(400)
        .json({ message: "Please provide the menu item ID and item quantity" });
    }

    const updatedItem = await db.oneOrNone(
      `UPDATE menu_item 
       SET current_servings = current_servings - $2 
       WHERE menu_item_id = $1 AND current_servings >= $2
       RETURNING *`,
      [menu_item_id, item_quantity]
    );

    if (!updatedItem) {
      return res
        .status(400)
        .json({ message: "Unable to update item. It may be out of stock." });
    }

    res.json({ item: updatedItem });
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /cashier/post-transaction:
 *   post:
 *     summary: Add a new transaction
 *     description: Add a new transaction to the transaction table
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_cost:
 *                 type: number
 *                 format: float
 *               transaction_time:
 *                 type: string
 *                 format: time
 *               transaction_date:
 *                 type: string
 *                 format: date
 *               transaction_type:
 *                 type: string
 *               customer_id:
 *                 type: integer
 *                 nullable: true
 *               employee_id:
 *                 type: integer
 *               week_number:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Successfully added transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const pushToTransactionTable = async (req, res) => {
  try {
    const {
      total_cost,
      transaction_time,
      transaction_date,
      transaction_type,
      customer_id, // Optional, since it's nullable in the database
      employee_id,
      week_number, // Optional, based on your table definition
    } = req.body;

    // Validation: Check for required fields
    if (
      total_cost === undefined ||
      !transaction_time ||
      !transaction_date ||
      !transaction_type ||
      !employee_id
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Prepare the values array for the INSERT statement
    const values = [
      total_cost,
      transaction_time,
      transaction_date,
      transaction_type,
      customer_id || null, // Use null if customer_id is undefined
      employee_id,
      week_number || null, // Use null if week_number is undefined
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

/**
 * @swagger
 * /cashier/post-transaction-menu:
 *   post:
 *     summary: Add a menu item to a transaction
 *     description: Add a menu item to a transaction in the menu_item_transaction table
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menu_item_id:
 *                 type: integer
 *               transaction_id:
 *                 type: integer
 *               item_quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully added menu item to transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionMenuItem:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const pushToTransactionsMenuTable = async (req, res) => {
  try {
    const { menu_item_id, transaction_id, item_quantity } = req.body;

    if (!menu_item_id || !transaction_id || !item_quantity) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const newTransactionMenuItem = await db.one(
      "INSERT INTO menu_item_transaction (menu_item_id, transaction_id, item_quantity) VALUES ($1, $2, $3) RETURNING *",
      [menu_item_id, transaction_id, item_quantity]
    );

    res.json({ transactionMenuItem: newTransactionMenuItem });
  } catch (err) {
    console.error("Error adding transaction menu item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /cashier/add-customer:
 *   post:
 *     summary: Add a new customer
 *     description: Add a new customer to the customer table
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 customer:
 *                   type: object
 *       400:
 *         description: Missing required fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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
      return res.status(400).json({
        message: "First name, last name, email, and phone number are required.",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate phone number format (e.g., 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number format. Please enter a 10-digit number.",
      });
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
      return res
        .status(400)
        .json({ message: "A customer with this email already exists." });
    }

    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "A customer with this phone number already exists." });
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

/**
 * @swagger
 * /cashier/get-customer-by-phone:
 *   get:
 *     summary: Get customer by phone number
 *     description: Retrieve a customer by their phone number
 *     tags: [Cashier]
 *     parameters:
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: The phone number of the customer
 *     responses:
 *       200:
 *         description: Successfully retrieved customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 customer:
 *                   type: object
 *       400:
 *         description: Missing or invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
const getCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format. Please enter a 10-digit number.",
      });
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

/**
 * @swagger
 * /cashier/update-customer-points:
 *   put:
 *     summary: Update customer reward points
 *     description: Update the reward points of a customer
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               reward_points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully updated customer points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   type: object
 *       400:
 *         description: Missing required fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const updateCustomerPoints = async (req, res) => {
  try {
    const { customer_id, reward_points } = req.body;

    if (!customer_id || reward_points === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide customer ID and reward points." });
    }

    console.log("Received data:", { customer_id, reward_points });

    const updatedCustomer = await db.oneOrNone(
      `UPDATE customer
       SET reward_points = reward_points + $2
       WHERE customer_id = $1
       RETURNING *`,
      [customer_id, reward_points]
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json({ customer: updatedCustomer });
  } catch (err) {
    console.error("Error updating customer points:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /cashier/restock-servings:
 *   put:
 *     summary: Restock menu item servings
 *     description: Restock the servings of menu items that have less than 25 servings
 *     tags: [Cashier]
 *     responses:
 *       200:
 *         description: Successfully restocked servings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const restockServings = async (req, res) => {
  try {
    await db.none(
      `UPDATE menu_item
       SET current_servings = 75
       WHERE current_servings < 25`
    );

    res.json({
      message: "Servings restocked successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  pushToTransactionsMenuTable,
  pushToTransactionTable,
  pushToMenuItemTable,
  addCustomer,
  getCustomerByPhone,
  updateCustomerPoints,
  restockServings,
};
