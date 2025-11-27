-- Create ENUM for server status
CREATE TYPE server_status AS ENUM ('UP', 'DOWN', 'MAINTENANCE', 'DEGRADED');

-- Create system_health table for monitoring
CREATE TABLE system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_status server_status NOT NULL DEFAULT 'UP',
    cpu_usage NUMERIC(5,2) CHECK (cpu_usage >= 0 AND cpu_usage <= 100),
    memory_usage NUMERIC(5,2) CHECK (memory_usage >= 0 AND memory_usage <= 100),
    disk_usage NUMERIC(5,2) CHECK (disk_usage >= 0 AND disk_usage <= 100),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for monitoring queries
CREATE INDEX idx_system_health_checked_at ON system_health(checked_at);
CREATE INDEX idx_system_health_server_status ON system_health(server_status);