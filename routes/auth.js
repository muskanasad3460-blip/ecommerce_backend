import express from "express";
import {
  // forgotPassword,
  login,
  sendOtp,
  signup,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
// router.post("/forgot-password", forgotPassword);
// router.post("/login", loginUser);

export default router;
