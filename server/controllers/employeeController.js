import db from "../db.js";

const getEmployees = async (req, res) => {
  try {
    const employees = await db.any(
      "SELECT * FROM employee WHERE fired = false"
    );

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addEmployee = async (req, res) => {
  try {
    // Extract the first_name, last_name, and role from the request body
    const { first_name, last_name, role, email } = req.body;

    if (!first_name || !last_name || !role || !email) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    // Check if the employee already exists
    const existingEmployee = await db.oneOrNone(
      "SELECT * FROM employee WHERE first_name = $1 AND last_name = $2",
      [first_name, last_name]
    );

    if (existingEmployee) {
      // If the employee exists, set fired to false and update the role
      const updatedEmployee = await db.one(
        "UPDATE employee SET fired = false, role = $1, email = $2 WHERE employee_id = $3 RETURNING *",
        [role, email, existingEmployee.employee_id]
      );

      return res.json({
        employee: updatedEmployee,
        message: `${first_name} ${last_name} hired.`,
      });
    }

    const newEmployee = await db.one(
      "INSERT INTO employee (first_name, last_name, role, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, role, email]
    );

    res.json({
      employee: newEmployee,
      message: `${first_name} ${last_name} hired.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;
    // Extract the first_name, last_name, and role from the request body
    const { first_name, last_name, role, email } = req.body;

    const updatedEmployee = await db.one(
      "UPDATE employee SET first_name = $1, last_name = $2, role = $3, email = $4 WHERE employee_id = $5 RETURNING *",
      [first_name, last_name, role, email, id]
    );

    res.json({
      employee: updatedEmployee,
      message: `${first_name} ${last_name} employee information updated.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    // Extract the id from the request parameters
    const { id } = req.params;

    const { first_name, last_name } = await db.one(
      "SELECT first_name, last_name FROM employee WHERE employee_id = $1",
      [id]
    );

    await db.none("UPDATE employee SET fired = true WHERE employee_id = $1", [
      id,
    ]);

    res.json({ message: `${first_name} ${last_name} fired.` });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getEmployees, addEmployee, updateEmployee, deleteEmployee };
