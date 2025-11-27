import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors, { CorsOptionsDelegate, CorsOptions } from "cors";
dotenv.config();

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const corsOptionsDelegate: CorsOptionsDelegate<Request> = (
  req,
  callback,
) => {
  const origin = req.header("Origin");

  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};
