import { Request, Response, NextFunction } from "express";
import { logAdminActivity } from "../services/adminActivityLog";

interface AdminRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function createAdminActivityLogger(
  action: string,
  targetTable: string,
  getTargetId: (req: AdminRequest) => string,
  getBeforeData?: (req: AdminRequest) => Promise<object | null>,
  getAfterData?: (req: AdminRequest, res: Response) => object | null,
) {
  return async (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      return next();
    }

    const targetId = getTargetId(req);
    let beforeData: object | null = null;

    if (getBeforeData) {
      beforeData = await getBeforeData(req);
    }

    const originalSend = res.send;
    res.send = function (data) {
      const afterData = getAfterData ? getAfterData(req, res) : null;

      logAdminActivity({
        adminId: req.user!.id,
        action,
        targetTable,
        targetId,
        beforeData: beforeData || undefined,
        afterData: afterData || undefined,
      });

      return originalSend.call(this, data);
    };

    next();
  };
}
