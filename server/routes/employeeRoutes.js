import express from "express";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/get-employees", getEmployees);
router.post("/add-employee", addEmployee);
router.put("/update-employee/:id", updateEmployee);
router.put("/delete-employee/:id", deleteEmployee);

export default router;
