import express from "express";
import {
    pushToTransactionTable,
    pushToTransactionsMenuTable,
    pushToMenuItemTable, 
    addCustomer,
    getCustomerByPhone,




} from "../controllers/cashierController.js";

const router = express.Router();

router.put("/put-menu", pushToMenuItemTable);
router.post("/post-transaction", pushToTransactionTable);
router.post("/post-transaction-menu", pushToTransactionsMenuTable);
router.post("/add-customer", addCustomer);
router.get("/get-customer-by-phone", getCustomerByPhone);

export default router;
