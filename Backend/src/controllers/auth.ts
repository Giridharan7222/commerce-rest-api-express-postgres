import { Request, Response } from "express";
import { handleValidationErrors } from "../utils/validation";
import { loginUser, refreshToken, verifyToken } from "../services/auth";

export const login = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const loginData = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await loginUser(loginData);
    return (res as any).success("Login successful", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Login failed",
      "LOGIN_ERROR",
      (error as any).message,
      401,
    );
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a real app, you'd blacklist the token or store logout info
  return (res as any).success(
    "Logout successful",
    { message: "Logged out successfully" },
    200,
  );
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return (res as any).fail("User ID required", "UNAUTHORIZED", null, 401);
    }

    const result = await refreshToken(userId);
    return (res as any).success("Token refreshed successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Token refresh failed",
      "REFRESH_TOKEN_ERROR",
      (error as any).message,
      401,
    );
  }
};

export const verifyTokenController = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return (res as any).fail("Token required", "UNAUTHORIZED", null, 401);
    }

    const user = await verifyToken(token);
    return (res as any).success("Token is valid", { user }, 200);
  } catch (error) {
    return (res as any).fail(
      "Token verification failed",
      "VERIFY_TOKEN_ERROR",
      (error as any).message,
      401,
    );
  }
};
