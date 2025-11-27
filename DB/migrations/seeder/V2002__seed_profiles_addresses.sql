-- Insert admin profile
INSERT INTO admin_profiles (id, user_id, full_name, phone, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Giri Admin',
    '+91-9876543210',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u 
WHERE u.email = 'giri.admin@commerce.com' AND u.role = 'admin';

-- Insert customer profile  
INSERT INTO customer_profiles (id, user_id, full_name, phone, dob, gender, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Giri Customer',
    '+91-8765432109',
    '1990-01-15',
    'male',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u 
WHERE u.email = 'giri.customer@commerce.com' AND u.role = 'customer';

-- Insert admin address
INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Giri Admin',
    '+91-9876543210',
    'Plot 123, Whitefield Main Road',
    'Near ITPL, Brookefield',
    'Bangalore',
    'Karnataka',
    '560066',
    'India',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u 
WHERE u.email = 'giri.admin@commerce.com' AND u.role = 'admin';

-- Insert customer home address
INSERT INTO addresses (id, user_id, full_name, phone, address_line1, city, state, pincode, country, is_default, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Giri Customer',
    '+91-8765432109',
    '456, Varthur Road',
    'Bangalore',
    'Karnataka',
    '560066',
    'India',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u 
WHERE u.email = 'giri.customer@commerce.com' AND u.role = 'customer';

-- Insert customer work address
INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Giri Customer',
    '+91-8765432109',
    'ITPL, Whitefield',
    'Block A, 5th Floor',
    'Bangalore',
    'Karnataka',
    '560066',
    'India',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u 
WHERE u.email = 'giri.customer@commerce.com' AND u.role = 'customer';