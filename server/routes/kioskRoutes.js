import express from "express";
import { getMealTypes ,getEntrees, getSides, getAppetizers, getDrinks, postOrder,getSauces } from "../controllers/kioskController.js";

const router = express.Router();

router.get("/meal-types", getMealTypes);
router.get("/entrees", getEntrees);
router.get("/sides", getSides);
router.get("/appetizers", getAppetizers);
router.get("/drinks", getDrinks);
router.post("/order", postOrder);
router.get("/sauces", getSauces);

export default router;
