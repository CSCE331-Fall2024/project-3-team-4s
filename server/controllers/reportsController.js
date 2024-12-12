import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import db from "../db.js"; // Ensure your database connection is correctly imported

// Define __dirname for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Operations related to generating reports
 */

/**
 * @swagger
 * /reports/x-report:
 *  post:
 *    summary: X Report generation
 *    description: Generate an X Report for a specified date range, including sales, items sold, and transaction types
 *    tags: [Reports]
 *    parameters:
 *    - in: query
 *      name: startDate
 *      required: true
 *      description: Start date for the report
 *      schema:
 *          type: string
 *    - in: query
 *      name: endDate
 *      required: true
 *      description: End date for the report
 *      schema:
 *          type: string
 *    - in: query
 *      name: startHour
 *      required: false
 *      description: Start hour for the report
 *      schema:
 *          type: integer
 *    - in: query
 *      name: endHour
 *      required: false
 *      description: End hour for the report
 *      schema:
 *          type: integer
 *    responses:
 *     200:
 *        description: X Report generated successfully
 *     400:
 *        description: Missing parameters for X Report
 *     500:
 *        description: Internal server error
 */
const getXReport = async (req, res) => {
  try {
    const { startDate, endDate, startHour = 9, endHour = 21 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required for X Report.",
      });
    }

    const salesData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(total_cost) AS value
             FROM transaction
             WHERE transaction_date BETWEEN $1 AND $2
             AND EXTRACT(HOUR FROM transaction_time) BETWEEN $3 AND $4
             GROUP BY hour
             ORDER BY hour`,
      [startDate, endDate, startHour, endHour]
    );

    const itemsSoldData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(item_quantity) AS total_items
             FROM transaction
             JOIN menu_item_transaction ON transaction.transaction_id = menu_item_transaction.transaction_id
             WHERE transaction_date BETWEEN $1 AND $2
             AND EXTRACT(HOUR FROM transaction_time) BETWEEN $3 AND $4
             GROUP BY hour
             ORDER BY hour`,
      [startDate, endDate, startHour, endHour]
    );

    const rawTransactionTypesData = await db.any(
      `SELECT transaction_type, COUNT(*) AS count, EXTRACT(HOUR FROM transaction_time) AS hour
             FROM transaction
             WHERE transaction_date BETWEEN $1 AND $2
             AND EXTRACT(HOUR FROM transaction_time) BETWEEN $3 AND $4
             GROUP BY transaction_type, hour
             ORDER BY hour`,
      [startDate, endDate, startHour, endHour]
    );

    const transactionTypesData = {};
    rawTransactionTypesData.forEach((row) => {
      if (!transactionTypesData[row.transaction_type]) {
        transactionTypesData[row.transaction_type] = [];
      }
      transactionTypesData[row.transaction_type].push({
        label: `Hour ${row.hour}`,
        value: row.count,
      });
    });

    res.status(200).json({
      sales: salesData.map((row) => ({
        label: `Hour ${row.hour}`,
        value: parseFloat(row.value),
      })),
      itemsSold: itemsSoldData.map((row) => ({
        label: `Hour ${row.hour}`,
        value: row.total_items,
      })),
      transactionTypes: transactionTypesData,
    });
  } catch (err) {
    console.error("Error fetching X report:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

/**
 * @swagger
 * /reports/z-report:
 *  post:
 *    summary: Z Report generation
 *    description: Generate a Z Report for a specified date, including sales, items sold, and transaction types by hour.
 *    tags: [Reports]
 *    parameters:
 *    - in: query
 *      name: startDate
 *      required: true
 *      description: Date for the report
 *      schema:
 *          type: string
 *    responses:
 *     200:
 *        description: Z Report generated successfully
 *     400:
 *        description: Missing parameters for Z Report
 *     500:
 *        description: Internal server error
 */
const getZReport = async (req, res) => {
  try {
    const { startDate } = req.query; // Accept `startDate` from frontend

    if (!startDate) {
      return res
        .status(400)
        .json({ message: "A start date is required for the Z Report." });
    }

    const salesData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(total_cost) AS value
             FROM transaction
             WHERE transaction_date = $1
             AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
             GROUP BY hour
             ORDER BY hour`,
      [startDate]
    );

    const itemsSoldData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(item_quantity) AS total_items
             FROM transaction
             JOIN menu_item_transaction ON transaction.transaction_id = menu_item_transaction.transaction_id
             WHERE transaction_date = $1
             AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
             GROUP BY hour
             ORDER BY hour`,
      [startDate]
    );

    const rawTransactionTypesData = await db.any(
      `SELECT transaction_type, COUNT(*) AS count, EXTRACT(HOUR FROM transaction_time) AS hour
             FROM transaction
             WHERE transaction_date = $1
             AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
             GROUP BY transaction_type, hour
             ORDER BY hour`,
      [startDate]
    );

    const transactionTypesData = {};
    rawTransactionTypesData.forEach((row) => {
      if (!transactionTypesData[row.transaction_type]) {
        transactionTypesData[row.transaction_type] = [];
      }
      transactionTypesData[row.transaction_type].push({
        label: `Hour ${row.hour}`,
        value: row.count,
      });
    });

    res.status(200).json({
      sales: salesData.map((row) => ({
        label: `Hour ${row.hour}`,
        value: parseFloat(row.value),
      })),
      itemsSold: itemsSoldData.map((row) => ({
        label: `Hour ${row.hour}`,
        value: row.total_items,
      })),
      transactionTypes: transactionTypesData,
    });
  } catch (err) {
    console.error("Error fetching Z report:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

/**
 * @swagger
 * /reports/product-usage:
 *  post:
 *    summary: Product Usage report generation
 *    description: Generate a Product Usage report for a specified date range, including ingredient usage by hour.
 *    tags: [Reports]
 *    parameters:
 *    - in: query
 *      name: startDate
 *      required: true
 *      description: Start date for the report
 *      schema:
 *          type: string
 *    - in: query
 *      name: endDate
 *      required: true
 *      description: End date for the report
 *      schema:
 *          type: string
 *    - in: query
 *      name: startHour
 *      required: false
 *      description: Start hour for the report
 *      schema:
 *          type: integer
 *    - in: query
 *      name: endHour
 *      required: false
 *      description: End hour for the report
 *      schema:
 *          type: integer
 *    responses:
 *     200:
 *        description: Product Usage report generated successfully
 *     400:
 *        description: Missing parameters for Product Usage report
 *     500:
 *        description: Internal server error
 */
const getProductUsage = async (req, res) => {
  try {
    const { startDate, endDate, startHour = 9, endHour = 21 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message:
          "Start date and end date are required for Product Usage report.",
      });
    }

    const productUsageData = await db.any(
      `SELECT i.ingredient_name, i.unit, SUM(mit.item_quantity * imi.ingredient_amount / 10) AS total_used
             FROM transaction t
             JOIN menu_item_transaction mit ON t.transaction_id = mit.transaction_id
             JOIN menu_item mi ON mit.menu_item_id = mi.menu_item_id
             JOIN inventory_menu_item imi ON mi.menu_item_id = imi.menu_item_id
             JOIN inventory i ON imi.ingredient_id = i.ingredient_id
             WHERE t.transaction_date BETWEEN $1 AND $2
             AND EXTRACT(HOUR FROM t.transaction_time) BETWEEN $3 AND $4
             GROUP BY i.unit, i.ingredient_name
             ORDER BY i.unit`,
      [startDate, endDate, startHour, endHour]
    );

    const groupedData = productUsageData.reduce((acc, row) => {
      if (!acc[row.unit]) {
        acc[row.unit] = [];
      }
      acc[row.unit].push({
        label: row.ingredient_name,
        value: parseFloat(row.total_used),
      });
      return acc;
    }, {});

    res.json(groupedData);
  } catch (error) {
    console.error("Error fetching Product Usage report:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { getXReport, getZReport, getProductUsage };
