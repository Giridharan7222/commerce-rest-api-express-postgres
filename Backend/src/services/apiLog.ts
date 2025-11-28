import { ApiLog } from "../models";

interface LogApiParams {
  userId?: string;
  method: string;
  endpoint: string;
  statusCode: number;
  ipAddress: string;
}

export async function logApiActivity(params: LogApiParams) {
  try {
    const log = await ApiLog.create({
      user_id: params.userId || null,
      method: params.method,
      endpoint: params.endpoint,
      status_code: params.statusCode,
      ip_address: params.ipAddress,
    } as any);

    return log.get({ plain: true });
  } catch (error) {
    console.error("Failed to log API activity:", error);
  }
}

export async function getApiLogs(userId?: string, limit = 50) {
  const whereClause = userId ? { user_id: userId } : {};

  const logs = await ApiLog.findAll({
    where: whereClause,
    order: [["created_at", "DESC"]],
    limit,
    include: [
      {
        association: "user",
        attributes: ["id", "email"],
      },
    ],
  });

  return logs.map((log: any) => log.get({ plain: true }));
}
