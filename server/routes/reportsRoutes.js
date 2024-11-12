import express from "express";
import { getXReport, getZReport } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/x-report", getXReport);
router.get("/z-report", getZReport);

export default router;