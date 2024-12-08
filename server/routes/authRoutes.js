import express from "express";
import {
  googleLogin,
  googleCallback,
  verifyManager,
  verifyToken,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/verify-manager", verifyManager);
router.get("/verify-token", verifyToken);

export default router;
