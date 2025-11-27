import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors, { CorsOptionsDelegate, CorsOptions } from "cors";
dotenv.config();

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const corsOptionsDelegate: CorsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
