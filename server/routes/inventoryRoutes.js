import express from "express";
import {
  getInventoryItems,
  getMinStockInventoryItems,
  getNonMinStockInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  restockInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/get-inventory", getInventoryItems);
router.get("/get-min-stock", getMinStockInventoryItems);
router.get("/get-non-min-stock", getNonMinStockInventoryItems);
router.post("/add-inventory", addInventoryItem);
router.put("/update-inventory/:id", updateInventoryItem);
router.put("/restock-inventory/:id", restockInventoryItem);
router.put("/delete-inventory/:id", deleteInventoryItem);

export default router;
