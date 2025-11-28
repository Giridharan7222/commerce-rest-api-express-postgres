import express from "express";
import { checkSchema } from "express-validator";
import {
  createAdminAccount,
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from "../controllers/user";
import { createAdminSchema, updateUserSchema } from "../validators/user";
import { authenticateToken, requireRole } from "../middleware/auth";
import { UserRole } from "../enums/user";

export const adminRoutes = express.Router();

// All admin routes require authentication and admin role
adminRoutes.use(authenticateToken);
adminRoutes.use(requireRole([UserRole.ADMIN]));

// Admin user management
adminRoutes.post(
  "/create-admin",
  checkSchema(createAdminSchema),
  createAdminAccount,
);
adminRoutes.get("/users", getAllUsersController);
adminRoutes.put(
  "/users/:id",
  checkSchema(updateUserSchema),
  updateUserController,
);
adminRoutes.delete("/users/:id", deleteUserController);
