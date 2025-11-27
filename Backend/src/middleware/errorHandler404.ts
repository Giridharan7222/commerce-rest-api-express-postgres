import { Request, Response, NextFunction } from 'express';

// 404 Error handler middleware
export const errorHandler404 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
