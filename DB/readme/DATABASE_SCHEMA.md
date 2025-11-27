# E-Commerce Database Schema

## Overview
Complete PostgreSQL database schema for a full-featured e-commerce platform with user management, product catalog, shopping cart, order processing, and system configuration.

## Database Information
- **Database**: PostgreSQL 16.9 with PostGIS extensions
- **Port**: 5433
- **Migration Tool**: Flyway
- **Total Tables**: 18 core tables + system tables

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

### 💰 Financial & Billing
| Table | Description | Key Features |
|-------|-------------|--------------|
| `invoices` | Legal billing documents | Invoice numbers, tax calculations, status tracking |
| `invoice_line_items` | Invoice line details | Historical pricing snapshots, tax per item |
| `payment_transactions` | Payment gateway tracking | Transaction refs, gateway responses, refunds |

### ⚙️ System Management
| Table | Description | Key Features |
|-------|-------------|--------------|
| `system_configs` | App configuration | Flexible key-value with JSON support |
| `api_logs` | Request logging | HTTP method, endpoint, IP tracking |
| `admin_activity_logs` | Admin audit trail | Change tracking, compliance, rollback support |
| `system_health` | Server monitoring | Uptime, CPU/memory usage, performance metrics |

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
orders (1) ──── (N) invoices
orders (1) ──── (N) payment_transactions

invoices (1) ──── (N) invoice_line_items
invoices (1) ──── (N) payment_transactions
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

### Financial & Billing
- `invoice_status`: generated, paid, cancelled
- `transaction_status`: initiated, pending, successful, failed, refunded
- `server_status`: UP, DOWN, MAINTENANCE, DEGRADED

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
| V1014 | admin_activity_logs_table.sql | Admin audit trail |
| V1015 | system_health_table.sql | System monitoring |
| V1016 | invoices_table.sql | Legal billing documents |
| V1017 | invoice_line_items_table.sql | Invoice line details |
| V1018 | payment_transactions_table.sql | Payment gateway tracking |

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

### Get invoice with line items
```sql
SELECT i.invoice_number, i.total_amount, ili.product_name, ili.quantity, ili.price
FROM invoices i
JOIN invoice_line_items ili ON i.id = ili.invoice_id
WHERE i.order_id = 'order-uuid';
```

### Track payment status
```sql
SELECT pt.transaction_reference, pt.status, pt.amount, pt.gateway_response
FROM payment_transactions pt
WHERE pt.order_id = 'order-uuid'
ORDER BY pt.created_at DESC;
```

### Admin activity audit
```sql
SELECT aal.action, aal.target_table, aal.before_data, aal.after_data, u.email
FROM admin_activity_logs aal
JOIN users u ON aal.admin_id = u.id
WHERE aal.target_table = 'products' AND aal.target_id = 'product-uuid';
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