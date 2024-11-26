import express from "express";
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";

const router = express.Router();

router.get("/get-menu", getMenuItems);
router.post("/add-menu-item", addMenuItem);
router.put("/update-menu-item/:id", updateMenuItem);
router.put("/delete-menu-item/:id", deleteMenuItem);

export default router;