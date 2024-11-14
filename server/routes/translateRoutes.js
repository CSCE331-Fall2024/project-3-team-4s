// /server/routes/translateRoutes.js
import express from 'express';

import {translateText} from "../controllers/translateController.js";
const router = express.Router();
console.log("Translate route initialized");
router.post('/translate', translateText);
console.log("Received request at /translate");

export default router;
