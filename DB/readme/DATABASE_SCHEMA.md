# E-Commerce Database Schema

## Overview
Complete PostgreSQL database schema for a full-featured e-commerce platform with user management, product catalog, shopping cart, order processing, and system configuration.

## Database Information
- **Database**: PostgreSQL 16.9 with PostGIS extensions
- **Port**: 5433
- **Migration Tool**: Flyway
- **Total Tables**: 13 core tables + system tables

## Quick Start
```bash
# Start database and run migrations
./env/local/_up.sh

# Stop services
./env/local/_down.sh

# Connect to database
psql -h localhost -p 5433 -U dbuser -d mydb
```

## Core Tables

### 👥 User Management
| Table | Description | Key Features |
|-------|-------------|--------------|
| `users` | Core user accounts | UUID PK, email unique, role enum, bcrypt passwords |
| `customer_profiles` | Customer details | Optional profile data, DOB, gender enum |
| `admin_profiles` | Admin details | Required name/phone for admins |
| `addresses` | User addresses | Multiple addresses per user, default flag |

### 🛍️ Product Catalog
| Table | Description | Key Features |
|-------|-------------|--------------|
| `categories` | Product categories | Hierarchical structure ready |
| `products` | Product inventory | Price, stock, Cloudinary integration |
| `product_images` | Product gallery | Multiple images per product |

### 🛒 Shopping & Orders
| Table | Description | Key Features |
|-------|-------------|--------------|
| `cart_items` | Shopping cart | Price snapshot, unique user+product |
| `orders` | Order headers | Status tracking, payment info, JSON address |
| `order_items` | Order line items | Price at order time, quantity |

### ⚙️ System Management
| Table | Description | Key Features |
|-------|-------------|--------------|
| `system_configs` | App configuration | Flexible key-value with JSON support |
| `api_logs` | Request logging | HTTP method, endpoint, IP tracking |

## Relationships

```
users (1) ──── (N) customer_profiles
users (1) ──── (N) admin_profiles  
users (1) ──── (N) addresses
users (1) ──── (N) cart_items
users (1) ──── (N) orders
users (1) ──── (N) api_logs

categories (1) ──── (N) products
products (1) ──── (N) product_images
products (1) ──── (N) cart_items
products (1) ──── (N) order_items

orders (1) ──── (N) order_items
```

## ENUM Types

### User & Auth
- `user_role`: admin, customer
- `gender_type`: male, female, other, prefer_not_to_say

### Orders & Payments
- `order_status`: pending, processing, shipped, delivered, cancelled
- `payment_status`: pending, paid, failed
- `payment_method_type`: upi, cod, credit_card, debit_card, net_banking, wallet

### System Config
- `config_type`: string, number, boolean, json
- `config_scope`: global, admin, customer, user
- `config_role`: admin, customer, all
- `http_method`: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD

## Key Features

### 🔐 Security
- UUID primary keys (no sequential IDs)
- Password hashing support
- Role-based access control
- Audit trails (created_by, updated_by)

### 📊 Performance
- Strategic indexes on foreign keys
- Composite indexes for common queries
- INET type for IP addresses
- JSONB for flexible data storage

### 🔄 Data Integrity
- Foreign key constraints with CASCADE/RESTRICT
- Check constraints (quantity > 0)
- Unique constraints (email, cart items)
- NOT NULL constraints on required fields

### ⏰ Timestamps
- Auto-updating `updated_at` triggers
- Consistent timestamp tracking
- Created/modified audit trails

## Migration Files

| Version | File | Description |
|---------|------|-------------|
| V1001 | users_table.sql | Core user accounts with roles |
| V1002 | customer_profiles_table.sql | Customer profile details |
| V1003 | addresses_table.sql | User shipping addresses |
| V1004 | orders_table.sql | Order management with status |
| V1005 | order_items_table.sql | Order line items |
| V1006 | admin_profiles_table.sql | Admin user profiles |
| V1007 | categories_table.sql | Product categories |
| V1008 | products_table.sql | Product catalog |
| V1009 | product_images_table.sql | Product image gallery |
| V1010 | cart_items_table.sql | Shopping cart functionality |
| V1011 | api_logs_table.sql | API request logging |
| V1012 | add_enums.sql | ENUM type definitions |
| V1013 | system_configs_table.sql | Application configuration |

## Sample Queries

### Get user's cart with product details
```sql
SELECT ci.quantity, ci.price_at_time, p.name, p.price
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = 'user-uuid';
```

### Get order history with items
```sql
SELECT o.id, o.total_amount, o.status, oi.quantity, p.name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 'user-uuid'
ORDER BY o.created_at DESC;
```

### Get system configuration
```sql
SELECT value, json_value 
FROM system_configs 
WHERE key = 'ORDER_MIN_AMOUNT' AND is_active = true;
```

## Environment Variables
```env
POSTGRES_HOST=postgres
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpass123
POSTGRES_DB=mydb
POSTGRES_PORT=5433
```

## Notes
- All tables use UUID primary keys for security
- Timestamps are in UTC
- JSON fields use JSONB for better performance
- Foreign keys use appropriate CASCADE/RESTRICT policies
- Indexes are optimized for common query patterns