import db from "../db.js";

const getEmployees = async (req, res) => {
  try {
    const employees = await db.any("SELECT * FROM employee");

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getEmployees };
