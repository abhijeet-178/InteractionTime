import express from "express";
import { login, logout, onboard, signUp, getAuthUser } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.ProtectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", protectedRoute, getAuthUser); // ✅ endpoint to get auth user
router.post("/onboarding", protectedRoute, onboard);

export default router;
