import { Response } from "express";
import { getAdminActivityLogs } from "../services/adminActivityLog";
import { AdminRequest } from "../interfaces";

export async function getActivityLogs(req: AdminRequest, res: Response) {
  try {
    const { admin_id, limit } = req.query;
    const logs = await getAdminActivityLogs(
      admin_id as string,
      limit ? parseInt(limit as string) : 50,
    );

    res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMyActivityLogs(req: AdminRequest, res: Response) {
  try {
    const { limit } = req.query;
    const logs = await getAdminActivityLogs(
      req.user!.id,
      limit ? parseInt(limit as string) : 50,
    );

    res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
