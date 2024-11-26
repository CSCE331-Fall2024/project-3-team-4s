import express from "express";
import { getMealTypes ,getEntrees, getSides, getAppetizers, getDrinks, getItemPrice, postOrder, getSauces ,getItems} from "../controllers/kioskController.js";

const router = express.Router();

router.get("/meal-types", getMealTypes);
router.get("/entrees", getEntrees);
router.get("/sides", getSides);
router.get("/appetizers", getAppetizers);
router.get("/drinks", getDrinks);
router.get("/prices", getItemPrice);
router.get("/sauces", getSauces);
router.get("/items", getItems);
router.post("/order", postOrder);

export default router;
