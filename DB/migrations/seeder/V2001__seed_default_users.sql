-- Insert default admin user
INSERT INTO users (id, email, password, role, is_active, created_at, updated_at) 
VALUES (
    gen_random_uuid(),
    'giri.admin@commerce.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert default customer user
INSERT INTO users (id, email, password, role, is_active, created_at, updated_at) 
VALUES (
    gen_random_uuid(),
    'giri.customer@commerce.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'customer',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);