import { AdminActivityLog } from "../models";

interface LogActivityParams {
  adminId: string;
  action: string;
  targetTable: string;
  targetId: string;
  beforeData?: object;
  afterData?: object;
}

export async function logAdminActivity(params: LogActivityParams) {
  try {
    const log = await AdminActivityLog.create({
      admin_id: params.adminId,
      action: params.action,
      target_table: params.targetTable,
      target_id: params.targetId,
      before_data: params.beforeData || null,
      after_data: params.afterData || null,
    } as any);

    return log.get({ plain: true });
  } catch (error) {
    console.error("Failed to log admin activity:", error);
    // Don't throw error to avoid breaking main operations
  }
}

export async function getAdminActivityLogs(adminId?: string, limit = 50) {
  const whereClause = adminId ? { admin_id: adminId } : {};

  const logs = await AdminActivityLog.findAll({
    where: whereClause,
    order: [["created_at", "DESC"]],
    limit,
    include: [
      {
        association: "admin",
        attributes: ["id", "email", "role"],
      },
    ],
  });

  return logs.map((log: any) => log.get({ plain: true }));
}
