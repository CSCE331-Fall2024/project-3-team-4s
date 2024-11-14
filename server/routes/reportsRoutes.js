import express from "express";
import { getXReport, getZReportsList, getZReport, getProductUsage } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/x-report", getXReport);
router.get("/product-usage", getProductUsage);
router.get("/z-reports", getZReportsList); 
router.get("/z-reports/:filename", getZReport); 

export default router;