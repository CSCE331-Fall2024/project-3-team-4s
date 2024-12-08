import express from "express";
import {
  googleLogin,
  googleCallback,
  verifyManager,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/verify-manager", verifyManager);

export default router;
