import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import db from "../db.js"; // Ensure your database connection is correctly imported

// Define __dirname for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get the X Report data
const getXReport = async (req, res) => {
    try {
        const { startDate, endDate, startHour = 9, endHour = 21 } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required for X Report." });
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
        rawTransactionTypesData.forEach(row => {
            if (!transactionTypesData[row.transaction_type]) {
                transactionTypesData[row.transaction_type] = [];
            }
            transactionTypesData[row.transaction_type].push({
                label: `Hour ${row.hour}`,
                value: row.count
            });
        });

        res.json({
            sales: salesData.map(row => ({ label: `Hour ${row.hour}`, value: parseFloat(row.value) })),
            itemsSold: itemsSoldData.map(row => ({ label: `Hour ${row.hour}`, value: row.total_items })),
            transactionTypes: transactionTypesData
        });
    } catch (err) {
        console.error("Error fetching X report:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Function to get the Z Report data for a single date
const getZReport = async (req, res) => {
    try {
        const { startDate } = req.query; // Accept `startDate` from frontend

        if (!startDate) {
            return res.status(400).json({ message: "A start date is required for the Z Report." });
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

        res.json({
            sales: salesData.map((row) => ({ label: `Hour ${row.hour}`, value: parseFloat(row.value) })),
            itemsSold: itemsSoldData.map((row) => ({ label: `Hour ${row.hour}`, value: row.total_items })),
            transactionTypes: transactionTypesData,
        });
    } catch (err) {
        console.error("Error fetching Z report:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Function to get the Product Usage report data
const getProductUsage = async (req, res) => {
    try {
        const { startDate, endDate, startHour = 9, endHour = 21 } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required for Product Usage report." });
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
                value: parseFloat(row.total_used)
            });
            return acc;
        }, {});

        res.json(groupedData);
    } catch (error) {
        console.error("Error fetching Product Usage report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { getXReport, getZReport, getProductUsage };