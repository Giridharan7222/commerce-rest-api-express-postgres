import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
    return true;
  }
  return false;
};
