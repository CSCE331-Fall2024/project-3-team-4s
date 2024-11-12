import db from "../db.js";

const getXReport = async (req, res) => {
  try {
    const { date, startHour = 9, endHour = 21 } = req.query;

    // Fetch hourly sales data
    const salesData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(total_cost) AS value
       FROM transaction WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN $2 AND $3
       GROUP BY hour ORDER BY hour`,
      [date, startHour, endHour]
    );

    // Fetch items sold data
    const itemsSoldData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(item_quantity) AS total_items
       FROM transaction JOIN menu_item_transaction ON transaction.transaction_id = menu_item_transaction.transaction_id
       WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN $2 AND $3
       GROUP BY hour ORDER BY hour`,
      [date, startHour, endHour]
    );

    // Fetch transaction types data and structure for multi-line chart
    const rawTransactionTypesData = await db.any(
      `SELECT transaction_type, COUNT(*) AS count, EXTRACT(HOUR FROM transaction_time) AS hour
       FROM transaction WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN $2 AND $3
       GROUP BY transaction_type, hour ORDER BY hour`,
      [date, startHour, endHour]
    );

    // Group transaction types data by type for multi-line graph format
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
      transactionTypes: transactionTypesData // structured for multi-line chart
    });
  } catch (err) {
    console.error("Error fetching X report:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getZReport = async (req, res) => {
  try {
    const { date } = req.query;

    // Check if date is provided, return 400 if missing
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Sales data for Z report (fixed hours 9 AM to 9 PM)
    const salesData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(total_cost) AS value
       FROM transaction
       WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
       GROUP BY hour
       ORDER BY hour`,
      [date]
    );

    // Items sold data for Z report
    const itemsSoldData = await db.any(
      `SELECT EXTRACT(HOUR FROM transaction_time) AS hour, SUM(item_quantity) AS total_items
       FROM transaction
       JOIN menu_item_transaction ON transaction.transaction_id = menu_item_transaction.transaction_id
       WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
       GROUP BY hour
       ORDER BY hour`,
      [date]
    );

    // Transaction types data for multi-line chart in Z report
    const rawTransactionTypesData = await db.any(
      `SELECT transaction_type, COUNT(*) AS count, EXTRACT(HOUR FROM transaction_time) AS hour
       FROM transaction
       WHERE transaction_date = $1 AND EXTRACT(HOUR FROM transaction_time) BETWEEN 9 AND 21
       GROUP BY transaction_type, hour
       ORDER BY hour`,
      [date]
    );

    // Structure transaction types data for multi-line chart
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

    // Send the response in the same format as X report
    res.json({
      sales: salesData.map(row => ({ label: `Hour ${row.hour}`, value: parseFloat(row.value) })),
      itemsSold: itemsSoldData.map(row => ({ label: `Hour ${row.hour}`, value: row.total_items })),
      transactionTypes: transactionTypesData
    });
  } catch (error) {
    console.error("Error fetching Z report:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export { getXReport, getZReport };