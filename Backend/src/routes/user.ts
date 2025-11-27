import express from "express";
import { checkSchema } from "express-validator";
import {
  createUserAccount,
  createAdminAccount,
  createUserProfile,
  createUserAddress,
  getUser,
  getUserAddressList,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  updateUserProfileController,
  updateAddressController,
  deleteAddressController,
} from "../controllers/user";
import {
  createUserSchema,
  createAdminSchema,
  createCustomerProfileSchema,
  createAddressSchema,
  updateUserSchema,
  loginSchema,
} from "../validators/user";
import { login } from "../controllers/auth";
import { authenticateToken, requireRole } from "../middleware/auth";

export const userRoutes = express.Router();

// Authentication routes
userRoutes.post("/login", checkSchema(loginSchema), login);
userRoutes.post("/signup", checkSchema(createUserSchema), createUserAccount);

// Admin user management
userRoutes.post(
  "/users/create-admin",
  authenticateToken,
  requireRole(["admin"]),
  checkSchema(createAdminSchema),
  createAdminAccount,
);
userRoutes.get(
  "/users",
  authenticateToken,
  requireRole(["admin"]),
  getAllUsersController,
);
userRoutes.get("/users/:id", authenticateToken, getUser);
userRoutes.put(
  "/users/:id",
  authenticateToken,
  requireRole(["admin"]),
  checkSchema(updateUserSchema),
  updateUserController,
);
userRoutes.delete(
  "/users/:id",
  authenticateToken,
  requireRole(["admin"]),
  deleteUserController,
);

// Profile management
userRoutes.post(
  "/users/profile",
  checkSchema(createCustomerProfileSchema),
  createUserProfile,
);
userRoutes.put(
  "/users/:id/profile",
  checkSchema(createCustomerProfileSchema),
  updateUserProfileController,
);

// Address management
userRoutes.post(
  "/users/addresses",
  checkSchema(createAddressSchema),
  createUserAddress,
);
userRoutes.get("/users/:id/addresses", getUserAddressList);
userRoutes.put(
  "/addresses/:id",
  checkSchema(createAddressSchema),
  updateAddressController,
);
userRoutes.delete("/addresses/:id", deleteAddressController);
