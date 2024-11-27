import express from "express";
import {
    pushToTransactionTable,
    pushToTransactionsMenuTable,
    pushToMenuItemTable, 



} from "../controllers/cashierController.js";

const router = express.Router();

router.put("/put-menu", pushToMenuItemTable);
router.post("/post-transaction", pushToTransactionTable);
router.post("/post-transaction-menu", pushToTransactionsMenuTable);

export default router;
