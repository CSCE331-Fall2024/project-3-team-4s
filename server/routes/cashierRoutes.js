import express from "express";
import {
    pushToTransactionTable,
    pushToTransactionsMenuTable,
    pushToMenuItemTable,
    getLatestTransactionId,



} from "../controllers/cashierController.js";

const router = express.Router();

router.put("/put-menu", pushToMenuItemTable);
router.post("/post-transaction", pushToTransactionTable);
router.post("/post-transaction-menu", pushToTransactionsMenuTable);
router.get("/get-transaction-id", getLatestTransactionId);
export default router;
