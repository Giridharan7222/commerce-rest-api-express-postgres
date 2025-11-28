import { Request, Response } from "express";
import { handleValidationErrors } from "../utils/validation";
import {
  createUser,
  createAdmin,
  createCustomerProfile,
  createAdminProfile,
  createAddress,
  getUserWithProfile,
  getUserAddresses,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateAddress,
  deleteAddress,
} from "../services/user";
import {
  createUserPayload,
  createAdminPayload,
  createCustomerProfilePayload,
  createAddressPayload,
} from "../validators/user";

export const createUserAccount = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const userPayload = createUserPayload(req);
    const user = await createUser(userPayload);
    return (res as any).success(
      "Customer account created successfully",
      user,
      201,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to create user",
      "CREATE_USER_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const createAdminAccount = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const adminPayload = createAdminPayload(req);
    const admin = await createAdmin(adminPayload);
    return (res as any).success(
      "Admin account created successfully",
      admin,
      201,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to create admin",
      "CREATE_ADMIN_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const createUserProfile = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const profilePayload = createCustomerProfilePayload(req);
    const profile = await createCustomerProfile(profilePayload);
    return (res as any).success("Profile created successfully", profile, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create profile",
      "CREATE_PROFILE_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const createUserAddress = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const addressPayload = createAddressPayload(req);
    const address = await createAddress(addressPayload);
    return (res as any).success("Address created successfully", address, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create address",
      "CREATE_ADDRESS_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getUserWithProfile(userId);
    return (res as any).success("User retrieved successfully", user, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get user",
      "GET_USER_ERROR",
      (error as any).message,
      404,
    );
  }
};

export const getUserAddressList = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const addresses = await getUserAddresses(userId);
    return (res as any).success(
      "Addresses retrieved successfully",
      addresses,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to get addresses",
      "GET_ADDRESSES_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return (res as any).success("Users retrieved successfully", users, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get users",
      "GET_USERS_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const userId = req.params.id;
    const updateData = req.body;
    const user = await updateUser(userId, updateData);
    return (res as any).success("User updated successfully", user, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to update user",
      "UPDATE_USER_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await deleteUser(userId);
    return (res as any).success("User deleted successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to delete user",
      "DELETE_USER_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response,
) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const userId = req.params.id;
    const profileData = req.body;
    const profile = await updateUserProfile(userId, profileData);
    return (res as any).success("Profile updated successfully", profile, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to update profile",
      "UPDATE_PROFILE_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const updateAddressController = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const addressId = req.params.id;
    const addressData = req.body;
    const address = await updateAddress(addressId, addressData);
    return (res as any).success("Address updated successfully", address, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to update address",
      "UPDATE_ADDRESS_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const deleteAddressController = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;
    const result = await deleteAddress(addressId);
    return (res as any).success("Address deleted successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to delete address",
      "DELETE_ADDRESS_ERROR",
      (error as any).message,
      500,
    );
  }
};
