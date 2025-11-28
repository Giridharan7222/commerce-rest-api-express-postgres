import { Request, Response, NextFunction } from "express";
import { logApiActivity } from "../services/apiLog";

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body) {
    const userId = (req as any).user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";

    logApiActivity({
      userId,
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: res.statusCode,
      ipAddress,
    });

    return originalSend.call(this, body);
  };

  next();
};
