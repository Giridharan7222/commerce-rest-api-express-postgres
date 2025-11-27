import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "admin" | "customer";
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return (res as any).fail(
      "Access token required",
      "UNAUTHORIZED",
      null,
      401,
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
    ) as any;

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return (res as any).fail(
        "Invalid or inactive user",
        "UNAUTHORIZED",
        null,
        401,
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return (res as any).fail("Invalid token", "UNAUTHORIZED", null, 403);
  }
};

export const requireRole = (roles: ("admin" | "customer")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return (res as any).fail(
        "Authentication required",
        "UNAUTHORIZED",
        null,
        401,
      );
    }

    if (!roles.includes(req.user.role)) {
      return (res as any).fail(
        "Insufficient permissions",
        "FORBIDDEN",
        null,
        403,
      );
    }

    next();
  };
};
