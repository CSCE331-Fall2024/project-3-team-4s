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

const addEmployee = async (req, res) => {
  try {
    // Extract the first_name, last_name, and role from the request body
    const { first_name, last_name, role } = req.body;

    await db.none(
      `INSERT INTO employee (first_name, last_name, role) VALUES (${first_name}, ${last_name}, ${role})`
    );

    res.json({ message: "Employee added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;
    // Extract the first_name, last_name, and role from the request body
    const { first_name, last_name, role } = req.body;

    await db.none(
      `UPDATE employee SET first_name = ${first_name}, last_name = ${last_name}, role = ${role} WHERE employee_id = ${id}`
    );

    res.json({ message: `Employee ${id} updated` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;

    await db.none(`DELETE FROM employee WHERE employee_id = ${id}`);

    res.json({ message: `Employee ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getEmployees, addEmployee, updateEmployee, deleteEmployee };
