import express from "express";

// controllers
import { login, signup } from "../controllers/auth.js";

// creates auth router
const router = express.Router();
export default router;

// Routes
// 1. Sign up
router.post("/signup", signup);

// 2. Login
router.post("/login", login);
