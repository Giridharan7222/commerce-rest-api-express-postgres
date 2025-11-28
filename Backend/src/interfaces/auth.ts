import { Request } from "express";
import { UserRole } from "../enums/user";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    profile?: any;
    addresses?: any[];
    stripeCustomerId?: string;
  };
}
