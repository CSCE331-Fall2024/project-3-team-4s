import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import db from "../db.js"; // Ensure your database connection is correctly imported

// Define __dirname for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Z_REPORTS_DIR = path.join(__dirname, '..', 'z_reports');

// Function to initialize the Z reports directory and populate with past data if empty
const initializeZReportsDirectory = async () => {
    if (!fs.existsSync(Z_REPORTS_DIR)) {
        fs.mkdirSync(Z_REPORTS_DIR, { recursive: true });
        console.log("Created Z Reports directory.");
    }

    console.log("Checking for missing Z reports from January 1, 2024, to October 1, 2024...");

    await generateSpecificDateRangeZReports(); // Generate reports for any missing dates
};

const generateSpecificDateRangeZReports = async () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-10-01");

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const formattedDate = d.toISOString().split('T')[0];
        const filePath = path.join(Z_REPORTS_DIR, `${formattedDate}_z_report.json`);

        if (!fs.existsSync(filePath)) {
            console.log(`Generating Z Report for missing date: ${formattedDate}`);

            try {
                // Fetch data from your database
                const salesData = await db.any(
                    `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(total_cost) AS value
                     FROM transaction
                     WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
                     GROUP BY hour
                     ORDER BY hour`,
                    [formattedDate]
                );

                const itemsSoldData = await db.any(
                    `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(item_quantity) AS total_items
                     FROM transaction
                     JOIN menu_item_transaction ON transaction.transaction_id = menu_item_transaction.transaction_id
                     WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
                     GROUP BY hour
                     ORDER BY hour`,
                    [formattedDate]
                );

                const transactionTypesData = await db.any(
                    `SELECT transaction_type, EXTRACT(HOUR FROM transaction_time) AS hour, COUNT(*) AS count
                     FROM transaction
                     WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
                     GROUP BY transaction_type, hour
                     ORDER BY hour`,
                    [formattedDate]
                );

                // Format each data type to match the expected structure
                const sales = salesData.map(row => ({ label: `Hour ${row.hour}`, value: parseFloat(row.value) }));
                const itemsSold = itemsSoldData.map(row => ({ label: `Hour ${row.hour}`, value: row.total_items }));

                const transactionTypes = {};
                transactionTypesData.forEach(row => {
                    if (!transactionTypes[row.transaction_type]) {
                        transactionTypes[row.transaction_type] = [];
                    }
                    transactionTypes[row.transaction_type].push({ label: `Hour ${row.hour}`, value: row.count });
                });

                // Construct the JSON structure
                const reportData = {
                    sales,
                    itemsSold,
                    transactionTypes
                };

                // Write the report data to a JSON file
                fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
                console.log(`Generated Z Report for ${formattedDate}`);
            } catch (err) {
                console.error(`Failed to generate Z Report for ${formattedDate}:`, err);
            }
        } else {
            console.log(`Z Report for ${formattedDate} already exists, skipping.`);
        }
    }
};
// Function to get the list of Z Report files
const getZReportsList = (req, res) => {
    initializeZReportsDirectory(); // Ensure directory exists and is populated

    fs.readdir(Z_REPORTS_DIR, (err, files) => {
        if (err) {
            console.error("Error reading Z reports directory:", err);
            return res.status(500).json({ message: "Could not retrieve Z reports." });
        }

        const reportFiles = files.filter(file => file.endsWith('.json'));
        res.json(reportFiles);
    });
};

// Function to read a specific Z report file and return its content
const getZReport = async (date) => {
    try {
        // Fetch sales data
        const salesData = await db.any(
            `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(total_cost) AS value
             FROM transaction
             WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
             GROUP BY hour
             ORDER BY hour`,
            [date]
        );

        // Fetch items sold data
        const itemsSoldData = await db.any(
            `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(item_quantity) AS total_items
             FROM transaction
             JOIN menu_item_transaction ON transaction.transaction_id = menu_item_transaction.transaction_id
             WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
             GROUP BY hour
             ORDER BY hour`,
            [date]
        );

        // Fetch transaction types data
        const rawTransactionTypesData = await db.any(
            `SELECT transaction_type, EXTRACT(HOUR FROM transaction_time) AS hour, COUNT(*) AS count
             FROM transaction
             WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
             GROUP BY transaction_type, hour
             ORDER BY hour`,
            [date]
        );

        // Format the data
        const sales = salesData.map(row => ({ label: `Hour ${row.hour}`, value: parseFloat(row.value) }));
        const itemsSold = itemsSoldData.map(row => ({ label: `Hour ${row.hour}`, value: row.total_items }));

        const transactionTypes = {};
        rawTransactionTypesData.forEach(row => {
            if (!transactionTypes[row.transaction_type]) {
                transactionTypes[row.transaction_type] = [];
            }
            transactionTypes[row.transaction_type].push({ label: `Hour ${row.hour}`, value: row.count });
        });

        // Construct the JSON structure
        const reportData = {
            sales,
            itemsSold,
            transactionTypes
        };

        // Write the report data to a JSON file
        const filePath = path.join(Z_REPORTS_DIR, `${date}_z_report.json`);
        fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
        console.log(`Generated Z Report for ${date}`);
    } catch (err) {
        console.error(`Failed to generate Z Report for ${date}:`, err);
    }
};

// Function to get the X Report data
const getXReport = async (req, res) => {
    try {
        const { startDate, endDate, startHour = 9, endHour = 21 } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required for X Report" });
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

// Function to get the Product Usage report data
const getProductUsage = async (req, res) => {
    try {
        const { startDate, endDate, startHour = 9, endHour = 21 } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required for Product Usage report" });
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
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getXReport, getZReportsList, getZReport, getProductUsage, initializeZReportsDirectory};