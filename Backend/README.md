# Backend API Setup & Development

A RESTful API backend for a commerce application built with Node.js, TypeScript, and PostgreSQL.

## Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** package manager
- **PostgreSQL** database (running via Docker)
- **Docker** (for database setup)

## Project Structure

```
Backend/
├── src/
│   ├── config/         # Configuration files (app, database)
│   ├── controllers/    # Request handlers (auth, cart, order, product, etc.)
│   ├── docs/          # Swagger API documentation files
│   ├── dtos/          # Data transfer objects (cart, order, product, user)
│   ├── enums/         # TypeScript enums (order, payment, user status)
│   ├── interfaces/    # TypeScript interfaces (auth, cart, invoice, payment)
│   ├── middleware/    # Express middleware:
│   │   ├── auth.ts           # JWT authentication
│   │   ├── cors.ts           # CORS configuration
│   │   ├── errorHandler.ts   # Global error handling
│   │   ├── limiter.ts        # Rate limiting
│   │   ├── logger.ts         # Request logging
│   │   ├── fileUpload.ts     # File upload handling
│   │   └── responseHandler.ts # Standardized responses
│   ├── models/        # Sequelize database models (24 models)
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic layer
│   ├── tests/         # Unit and integration tests
│   ├── types/         # Custom TypeScript type definitions
│   ├── utils/         # Utility functions:
│   │   ├── cloudinary.ts     # Image upload utilities
│   │   ├── validation.ts     # Custom validation helpers
│   │   └── adminLogger.ts    # Admin activity logging
│   ├── validators/    # Input validation schemas
│   ├── app.ts         # Express app configuration
│   ├── index.ts       # Application entry point
│   ├── server.ts      # Server setup
│   └── swagger.ts     # API documentation setup
├── config/            # Environment configurations
├── uploads/           # File upload directory
├── dist/              # Build output
├── package.json
├── tsconfig.json
└── README.md
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Setup database:**
   ```bash
   # Navigate to DB folder and start database
   cd ../DB
   ./env/local/_up.sh
   cd ../Backend
   ```

3. **Environment configuration:**
   ```bash
   # Environment file is located at:
   # Backend/config/env/.env
   
   # Edit the existing .env file with your configuration
   ```

4. **Start development server:**
   ```bash
   yarn dev
   ```

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn start` - Start production server
- `yarn build` - Build TypeScript to JavaScript
- `yarn test` - Run Jest test suite
- `yarn test:mocha` - Run Mocha test suite
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn db:start` - Start database services
- `yarn db:stop` - Stop database services

## Development

### Starting the Application

1. **Start database services:**
   ```bash
   yarn db:start
   ```

2. **Start the API server:**
   ```bash
   yarn dev
   ```

3. **Access the application:**
   - API Server: http://localhost:5005
   - API Documentation: http://localhost:5005/api-docs

### API Documentation

The API uses Swagger for documentation. Once the server is running, visit:
- **Swagger UI**: http://localhost:5005/api-docs

### Testing

```bash
# Run all tests
yarn test

# Run specific test framework
yarn test:jest
yarn test:mocha

# Format code
yarn format
```

## Architecture & Components

### Middleware Stack
- **Authentication** - JWT token validation
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling and abuse prevention
- **Error Handling** - Global error catching and formatting
- **Request Logging** - API request/response logging
- **File Upload** - Multer-based file handling
- **Response Handler** - Standardized API responses
- **Admin Activity Logger** - Admin action tracking

### Data Models (24 Tables)
- **User Management**: users, customer_profiles, admin_profiles, addresses
- **Product Catalog**: categories, products, product_images
- **Shopping**: cart_items, orders, order_items
- **Payment**: payment_transactions, payment_methods, refunds, stripe_customers
- **Invoicing**: invoices, invoice_line_items
- **System**: system_configs, system_health, admin_activity_logs, api_logs

### Services Layer
- **Authentication Service** - User login/registration
- **User Service** - Profile and address management
- **Product Service** - Catalog management
- **Cart Service** - Shopping cart operations
- **Order Service** - Order processing
- **Payment Service** - Payment handling
- **Stripe Service** - Stripe integration
- **System Health Service** - Health monitoring

### Validation & DTOs
- **Input Validation** - Express-validator schemas
- **Data Transfer Objects** - Type-safe data structures
- **Custom Validators** - Business logic validation
- **Error Handling** - Comprehensive error responses

## Key Features

- **Authentication & Authorization** with JWT
- **User Management** (customers & admins)
- **Product Catalog** with categories and images
- **Shopping Cart** functionality
- **Order Management** system
- **Payment Processing** with Stripe
- **File Upload** with Cloudinary
- **API Documentation** with Swagger
- **Rate Limiting** and security middleware
- **Comprehensive Testing** with Jest & Mocha

## API Flows

📋 **For detailed step-by-step API flows, see**: [`FLOW.md`](./FLOW.md)

### Quick Reference
- **Customer Flow**: Signup → Profile → Browse → Cart → Order → Payment
- **Admin Flow**: Login → Manage Categories → Products → Images → System Health

### Test Accounts
- **Customer**: `giri.customer@commerce.com` / `password`
- **Admin**: `giri.admin@commerce.com` / `password`

## API Endpoints Overview

### Authentication & Token Management
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/refresh` - Refresh JWT token
- `GET /api/verify` - Verify token validity
- `GET /api/me` - Get current user info

### User Management
- `POST /api/users/create-admin` - Create admin account (Admin only)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Profile & Address Management
- `POST /api/users/profile` - Create user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/addresses` - Add user address
- `GET /api/users/addresses` - Get user addresses
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Categories
- `POST /api/categories` - Create category (Admin only)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products
- `POST /api/products` - Create product (Admin only)
- `POST /api/products/upload` - Create product with images (Admin only)
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Product Images
- `POST /api/product-images` - Add product image (Admin only)
- `GET /api/products/:productId/images` - Get product images
- `PUT /api/product-images/:id` - Update product image (Admin only)
- `DELETE /api/product-images/:id` - Delete product image (Admin only)

### Shopping Cart
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get order history
- `GET /api/orders/:orderId` - Get order details
- `PATCH /api/orders/:orderId/cancel` - Cancel order
- `PATCH /api/orders/:orderId/complete-payment` - Complete payment
- `PATCH /api/orders/:orderId/status` - Update order status (Admin only)

### Stripe Integration
- `POST /api/stripe/customers` - Create Stripe customer
- `POST /api/stripe/setup-intents` - Create setup intent
- `POST /api/stripe/payment-intents` - Create payment intent
- `POST /api/stripe/process-payment` - Process payment
- `GET /api/stripe/customers/:customerId/cards` - Get saved cards
- `POST /api/stripe/webhooks` - Stripe webhooks

### Payment Methods
- `POST /api/payment-methods/create` - Create & save payment method
- `POST /api/payment-methods` - Save payment method
- `GET /api/payment-methods` - Get saved payment methods
- `DELETE /api/payment-methods/:id` - Delete payment method

### System Health
- `GET /api/system-health` - Get system health (Admin only)
- `POST /api/system-health` - Create health record (Admin only)

### Health Check
- `GET /health` - API health check

## Environment Variables

The `.env` file is located at `Backend/config/env/.env` and contains:

```env
# Server Configuration
PORT=5005
NODE_ENV=development
API_BASE_URL=http://localhost:5005

# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_NAME=mydb
DB_USER=dbuser
DB_PASSWORD=dbpass123
DATABASE_URL=postgresql://dbuser:dbpass123@localhost:5433/mydb

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Stripe Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=commerce-app

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=5242880
MAX_FILES_COUNT=10

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Additional Information

For more details:
- **Database setup**: See `../DB/README.md`
- **Database schema**: See `../DB/readme/DATABASE_SCHEMA.md`
- **Tech stack overview**: See main project README