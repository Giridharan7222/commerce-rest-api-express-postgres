import { Request, Response } from "express";
import { getSystemHealth, createSystemHealthRecord } from "../services/systemHealth";

export const getSystemHealthController = async (req: Request, res: Response) => {
  try {
    const health = await getSystemHealth();
    return (res as any).success("System health retrieved successfully", health, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get system health",
      "GET_SYSTEM_HEALTH_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const createSystemHealthController = async (req: Request, res: Response) => {
  try {
    const healthRecord = await createSystemHealthRecord(req.body);
    return (res as any).success("System health record created successfully", healthRecord, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create system health record",
      "CREATE_SYSTEM_HEALTH_ERROR",
      (error as any).message,
      500,
    );
  }
};