# Database Setup

PostgreSQL database with Flyway migrations for the commerce application.

## Database Structure

![Database Schema](ecommerce.png)
*Database table relationships and structure*

### Core Tables (24 tables)
- **users** - User accounts (customers & admins)
- **customer_profiles** - Customer profile information
- **admin_profiles** - Admin profile information
- **addresses** - User addresses
- **categories** - Product categories
- **products** - Product catalog
- **product_images** - Product image management
- **cart_items** - Shopping cart functionality
- **orders** - Order management
- **order_items** - Order line items
- **invoices** - Invoice generation
- **invoice_line_items** - Invoice details
- **payment_transactions** - Payment processing
- **payment_methods** - Payment method storage
- **refunds** - Refund management
- **stripe_customers** - Stripe integration
- **system_configs** - System configuration
- **system_health** - Health monitoring
- **admin_activity_logs** - Admin activity tracking
- **api_logs** - API request logging

## Quick Start

```bash
# Start database and run migrations
./env/local/_up.sh

# Stop services
./env/local/_down.sh
```

## Database Access

- **Host**: localhost:5433
- **User**: dbuser
- **Database**: mydb
- **Password**: dbpass123

## Migration Structure

- **Schema**: `migrations/schema/V{version}__{description}.sql` - Database structure (V1001-V1024)
- **Seeders**: `migrations/seeder/V{version}__{description}.sql` - Initial data (V2001-V2005)
- **Views**: `migrations/views/R__{description}.sql` - Database views

## Additional Information

For detailed documentation:
- **Database schema details**: See `readme/DATABASE_SCHEMA.md`
- **Backend API integration**: See `../Backend/README.md`