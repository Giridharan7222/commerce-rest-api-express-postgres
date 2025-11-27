import { Request, Response, NextFunction } from 'express';
// Request logging middleware
export const log = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Received ${req.method} request for URL: ${req.url}`);
  next();
};
