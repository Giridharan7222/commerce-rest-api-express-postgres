import { logAdminActivity } from "../services/adminActivityLog";

export class AdminLogger {
  static async logCreate(
    adminId: string,
    table: string,
    recordId: string,
    data: object,
  ) {
    return logAdminActivity({
      adminId,
      action: "CREATE",
      targetTable: table,
      targetId: recordId,
      afterData: data,
    });
  }

  static async logUpdate(
    adminId: string,
    table: string,
    recordId: string,
    before: object,
    after: object,
  ) {
    return logAdminActivity({
      adminId,
      action: "UPDATE",
      targetTable: table,
      targetId: recordId,
      beforeData: before,
      afterData: after,
    });
  }

  static async logDelete(
    adminId: string,
    table: string,
    recordId: string,
    data: object,
  ) {
    return logAdminActivity({
      adminId,
      action: "DELETE",
      targetTable: table,
      targetId: recordId,
      beforeData: data,
    });
  }

  static async logCustomAction(
    adminId: string,
    action: string,
    table: string,
    recordId: string,
    data?: object,
  ) {
    return logAdminActivity({
      adminId,
      action: action.toUpperCase(),
      targetTable: table,
      targetId: recordId,
      afterData: data,
    });
  }
}
