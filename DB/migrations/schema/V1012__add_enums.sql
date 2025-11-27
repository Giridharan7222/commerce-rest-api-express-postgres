-- Create ENUM types for better data integrity

-- Gender enum for customer profiles
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- HTTP method enum for API logs
CREATE TYPE http_method AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD');

-- Payment method enum for orders
CREATE TYPE payment_method_type AS ENUM ('upi', 'cod', 'credit_card', 'debit_card', 'net_banking', 'wallet');

-- Update customer_profiles table to use gender enum
ALTER TABLE customer_profiles 
ALTER COLUMN gender TYPE gender_type USING gender::gender_type;

-- Update api_logs table to use http_method enum
ALTER TABLE api_logs 
ALTER COLUMN method TYPE http_method USING method::http_method;

-- Update orders table to use payment_method enum
ALTER TABLE orders 
ALTER COLUMN payment_method TYPE payment_method_type USING payment_method::payment_method_type;