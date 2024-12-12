import db from "../db.js";

/**
 * @swagger
 * tags:
 *   - name: Kiosk
 *     description: Operations related to customer kiosk
 */

/**
 * @swagger
 * /kiosk/prices:
 *   get:
 *     summary: Get the price of an item
 *     description: Retrieve the price of an item from the menu based on the name provided in the request body
 *     tags: [Kiosk]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the item to retrieve the price for
 *     responses:
 *       200:
 *         description: The price of the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 price:
 *                   type: number
 *                   format: float
 *       404:
 *         description: Item not found
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
const getItemPrice = async (req, res) => {
  try {
    const { itemName } = req.query; // Get the item name from query parameters

    // Query the database to retrieve the item's price
    const item = await db.oneOrNone(
      "SELECT item_price FROM menu_item WHERE item_name = $1",
      [itemName]
    );

    if (item) {
      res.json({ price: item.item_price });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/meal-types:
 *   get:
 *     summary: Get all meal items
 *     description: Retrieve all items from the menu that are categorized as "Meal"
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of meal items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getMealTypes = async (req, res) => {
  try {
    const mealTypes = await db.any(
      "SELECT * FROM menu_item WHERE item_category = 'Meal'"
    );

    res.json(mealTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/items:
 *   get:
 *     summary: Get all items
 *     description: Retrieve all items from the menu
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getItems = async (req, res) => {
  try {
    const mealTypes = await db.any("SELECT * FROM menu_item");

    res.json(mealTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/entrees:
 *   get:
 *     summary: Get all entrees
 *     description: Retrieve all items from the menu that are categorized as "Entree"
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of entree items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getEntrees = async (req, res) => {
  try {
    const entrees = await db.any(
      "SELECT * FROM menu_item WHERE item_category = 'Entree'"
    );

    res.json(entrees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/sauces:
 *   get:
 *     summary: Get all sauces
 *     description: Retrieve all items from the menu that are categorized as "Sauces"
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of sauce items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getSauces = async (req, res) => {
  try {
    const entrees = await db.any(
      "SELECT * FROM menu_item WHERE item_category = 'Sauces'"
    );

    res.json(entrees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/sides:
 *   get:
 *     summary: Get all sides
 *     description: Retrieve all items from the menu that are categorized as "Side"
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of side items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getSides = async (req, res) => {
  try {
    const sides = await db.any(
      "SELECT * FROM menu_item WHERE item_category = 'Side'"
    );

    res.json(sides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/appetizers:
 *   get:
 *     summary: Get all appetizers
 *     description: Retrieve all items from the menu that are categorized as "Appetizer"
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of appetizer items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getAppetizers = async (req, res) => {
  try {
    const appetizers = await db.any(
      "SELECT * FROM menu_item WHERE item_category = 'Appetizer'"
    );

    res.json(appetizers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/drinks:
 *   get:
 *     summary: Get all drinks
 *     description: Retrieve all items from the menu that are categorized as "Drink", "Bottle", or "Refresher"
 *     tags: [Kiosk]
 *     responses:
 *       200:
 *         description: List of drink items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_item_id:
 *                     type: integer
 *                   current_servings:
 *                     type: number
 *                     format: float
 *                   item_name:
 *                     type: string
 *                   item_price:
 *                     type: number
 *                     format: float
 *                   item_category:
 *                     type: string
 *                   on_menu:
 *                     type: boolean
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
const getDrinks = async (req, res) => {
  try {
    const drinks = await db.any(
      "SELECT * FROM menu_item WHERE item_category = 'Drink' OR item_category = 'Bottle' OR item_category = 'Refresher'"
    );

    res.json(drinks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /kiosk/order:
 *   post:
 *     summary: Submit a new order
 *     description: Submit a new order and update the database accordingly
 *     tags: [Kiosk]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalCost:
 *                 type: number
 *                 format: float
 *               transactionType:
 *                 type: string
 *               orderList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order successfully added to the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Not enough servings for one or more items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error submitting order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const postOrder = async (req, res) => {
  const { totalCost, transactionType, orderList } = req.body;
  const transactionDate = new Date();
  const transactionTime = transactionDate.toTimeString().split(" ")[0]; // Time in HH:MM:SS format
  const weekNumber = 1;
  const customerId = null;
  const employeeId = null;

  try {
    // Insert into the transaction table and get the transaction_id
    const transaction = await db.one(
      `INSERT INTO transaction (total_cost, transaction_time, transaction_date, transaction_type, customer_id, employee_id, week_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING transaction_id`,
      [
        totalCost,
        transactionTime,
        transactionDate,
        transactionType,
        customerId,
        employeeId,
        weekNumber,
      ]
    );

    const transactionId = transaction.transaction_id;

    // For each item, get menu_item_id based on name, insert into Menu_item_transaction,
    // and update the current_servings column in the menu_item table
    const itemPromises = orderList.map(async (item) => {
      const { name, quantity } = item;

      // Look up the menu_item_id and current_servings based on the name
      const menuItem = await db.oneOrNone(
        `SELECT menu_item_id, current_servings FROM menu_item WHERE item_name = $1`,
        [name]
      );

      if (menuItem) {
        const { menu_item_id: menuItemId, current_servings: currentServings } =
          menuItem;

        if (currentServings < quantity) {
          throw new Error(
            `Not enough servings for item "${name}". Available: ${currentServings}, Required: ${quantity}`
          );
        }

        // Insert into Menu_item_transaction
        await db.none(
          `INSERT INTO menu_item_transaction (menu_item_id, transaction_id, item_quantity)
                    VALUES ($1, $2, $3)`,
          [menuItemId, transactionId, quantity]
        );

        // Update the current_servings in the menu_item table
        await db.none(
          `UPDATE menu_item SET current_servings = current_servings - $1 WHERE menu_item_id = $2`,
          [quantity, menuItemId]
        );
      } else {
        console.warn(`Item with name "${name}" not found in menu_item table.`);
      }
    });

    await Promise.all(itemPromises);

    res
      .status(200)
      .json({ message: "Order successfully added to the database" });
  } catch (error) {
    console.error("Error submitting order:", error);
    if (error.message.includes("Not enough servings")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error submitting order" });
    }
  }
};

export {
  getMealTypes,
  getEntrees,
  getSides,
  getAppetizers,
  getDrinks,
  getItemPrice,
  postOrder,
  getSauces,
  getItems,
};
