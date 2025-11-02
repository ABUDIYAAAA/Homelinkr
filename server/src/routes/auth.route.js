import express from "express";
import {
  redirectToGoogle,
  handleGoogleCallback,
  getUser,
  logout,
  login,
  signup,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/google", redirectToGoogle);
router.get("/google/callback", handleGoogleCallback);
router.get("/me", requireAuth, getUser);
router.post("/logout", requireAuth, logout);
router.post("/login", login);
router.post("/signup", signup);
export { router };
