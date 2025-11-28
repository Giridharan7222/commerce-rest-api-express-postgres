import sequelize from "../database/connection";
import { QueryTypes } from "sequelize";

export interface SystemHealthData {
  server_status: 'UP' | 'DOWN' | 'MAINTENANCE' | 'DEGRADED';
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
}

export const getSystemHealth = async () => {
  const query = `
    SELECT * FROM system_health 
    ORDER BY checked_at DESC 
    LIMIT 1
  `;
  
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });
  return result[0] || null;
};

export const createSystemHealthRecord = async (data: SystemHealthData) => {
  const query = `
    INSERT INTO system_health (server_status, cpu_usage, memory_usage, disk_usage)
    VALUES (?, ?, ?, ?)
    RETURNING *
  `;
  
  const values = [
    data.server_status,
    data.cpu_usage || null,
    data.memory_usage || null,
    data.disk_usage || null
  ];
  
  const [result] = await sequelize.query(query, { replacements: values, type: QueryTypes.INSERT });
  return result;
};