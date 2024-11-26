import express from "express";
import { getXReport, getZReport, getProductUsage } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/x-report", getXReport);
router.get("/z-report", getZReport); // Add the Z Report route
router.get("/product-usage", getProductUsage);

export default router;