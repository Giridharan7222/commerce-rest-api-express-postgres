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
import { UserRole } from "../enums/user";

export const userRoutes = express.Router();

// Authentication routes
userRoutes.post("/login", checkSchema(loginSchema), login);
userRoutes.post("/signup", checkSchema(createUserSchema), createUserAccount);

// Test endpoint to see complete user data
userRoutes.get("/me", authenticateToken, (req: any, res: any) => {
  res.success("User data with profile and addresses", req.user, 200);
});

// Admin user management
userRoutes.post(
  "/users/create-admin",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  checkSchema(createAdminSchema),
  createAdminAccount,
);
userRoutes.get(
  "/users",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  getAllUsersController,
);
userRoutes.get("/users/:id", authenticateToken, getUser);
userRoutes.put(
  "/users/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  checkSchema(updateUserSchema),
  updateUserController,
);
userRoutes.delete(
  "/users/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  deleteUserController,
);

// Profile management
userRoutes.post(
  "/users/profile",
  authenticateToken,
  checkSchema(createCustomerProfileSchema),
  createUserProfile,
);
userRoutes.put(
  "/users/profile",
  authenticateToken,
  checkSchema(createCustomerProfileSchema),
  updateUserProfileController,
);

// Address management
userRoutes.post(
  "/users/addresses",
  authenticateToken,
  checkSchema(createAddressSchema),
  createUserAddress,
);
userRoutes.get("/users/addresses", authenticateToken, getUserAddressList);
userRoutes.put(
  "/addresses/:id",
  authenticateToken,
  checkSchema(createAddressSchema),
  updateAddressController,
);
userRoutes.delete("/addresses/:id", authenticateToken, deleteAddressController);
