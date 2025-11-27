import express from "express";
import { checkSchema } from "express-validator";
import {
  login,
  logout,
  refreshTokenController,
  verifyTokenController,
} from "../controllers/auth";
import { loginSchema } from "../validators/user";
import { authenticateToken } from "../middleware/auth";

export const authRoutes = express.Router();

// Authentication CRUD
authRoutes.post("/login", checkSchema(loginSchema), login);
authRoutes.post("/logout", authenticateToken, logout);
authRoutes.post("/refresh", authenticateToken, refreshTokenController);
authRoutes.get("/verify", verifyTokenController);
