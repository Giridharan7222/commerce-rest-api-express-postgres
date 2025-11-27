import { Request, Response, NextFunction } from "express";

// Global rror handler middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack); // log error for debugging

  const statusCode = err.statusCode || 500; // default 500 Internal Server Error
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
