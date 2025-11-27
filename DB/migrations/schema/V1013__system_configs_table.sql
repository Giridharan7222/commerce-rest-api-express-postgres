-- Create ENUM types for system configs
CREATE TYPE config_type AS ENUM ('string', 'number', 'boolean', 'json');
CREATE TYPE config_scope AS ENUM ('global', 'admin', 'customer', 'user');
CREATE TYPE config_role AS ENUM ('admin', 'customer', 'all');

-- Create system_configs table
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    json_value JSONB,
    type config_type NOT NULL,
    description TEXT,
    scope config_scope NOT NULL DEFAULT 'global',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role config_role,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    updated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_user_scope CHECK (
        (scope = 'user' AND user_id IS NOT NULL) OR 
        (scope != 'user' AND user_id IS NULL)
    ),
    CONSTRAINT check_role_scope CHECK (
        (scope IN ('admin', 'customer') AND role IS NOT NULL) OR 
        (scope NOT IN ('admin', 'customer') AND role IS NULL)
    )
);

-- Create indexes for faster lookups
CREATE INDEX idx_system_configs_key ON system_configs(key);
CREATE INDEX idx_system_configs_scope ON system_configs(scope);
CREATE INDEX idx_system_configs_user_id ON system_configs(user_id);
CREATE INDEX idx_system_configs_is_active ON system_configs(is_active);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_system_configs_updated_at 
    BEFORE UPDATE ON system_configs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();