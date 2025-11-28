import { Request } from "express";

export interface AdminRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}
