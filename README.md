A RESTful API backend for a commerce application built with Node.js, TypeScript, and PostgreSQL.

## Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** package manager
- **PostgreSQL** database
- **Docker** (optional, for containerized setup)

## Tech Stack

### Runtime & Language
- **Node.js** - JavaScript runtime environment
- **TypeScript** - Type-safe JavaScript superset

### Framework & Libraries
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - PostgreSQL ORM with TypeScript support
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Swagger** - API documentation
- **Stripe** - Payment processing
- **Cloudinary** - Image and file management

### Development Tools
- **Yarn** - Package manager
- **Prettier** - Code formatter
- **Jest & Mocha** - Testing frameworks
- **Docker** - Containerization
- **Flyway** - Database migration tool
- **Nodemon** - Development server with hot reload
- **ESLint** - Code linting

### Architecture
- **RESTful API** design
- **MVC Pattern** with controllers, services, and models
- **DTO Pattern** for data validation
- **TypeScript** for type safety
- **Middleware** for authentication, validation, and security
- **Rate limiting** and security headers
- **File upload** handling with Multer

## Payment & Billing

The application integrates **Stripe** for secure payment processing:

### Features
- **Payment Processing**: Credit/debit card payments
- **Customer Management**: Stripe customer profiles
- **Payment Methods**: Save and manage payment methods
- **Invoicing**: Automated invoice generation
- **Webhooks**: Real-time payment status updates
- **Test Mode**: Safe testing with Stripe test cards

### Test Payment Methods
- **Visa**: `pm_card_visa`
- **Mastercard**: `pm_card_mastercard`
- **American Express**: `pm_card_amex`
- **Declined Card**: `pm_card_chargeDeclined`

### Billing Flow
1. Customer adds products to cart
2. Creates order with shipping details
3. Stripe payment intent generated
4. Payment processed securely
5. Invoice created automatically
6. Order status updated via webhooks


## Additional Information

For detailed setup, configuration, and usage instructions:
- **Database setup & seeding**: [DB/README.md](./DB/README.md) - Includes pre-seeded test data
- **Backend API setup & development**: [Backend/README.md](./Backend/README.md)
- **API flows & usage**: [Backend/FLOW.md](./Backend/FLOW.md)
- **Database schema & migrations**: [DB/readme/DATABASE_SCHEMA.md](./DB/readme/DATABASE_SCHEMA.md)

## Quick Start with Seeded Data

The application comes with pre-seeded test data including:
- **Test Accounts**: Customer and Admin users ready to use
- **Sample Categories**: Electronics, Clothing, Books, Home & Garden
- **Sample Products**: Products with images in each category
- **User Profiles**: Complete profiles and addresses for test accounts

**Test Credentials:**
- **Customer**: `giri.customer@commerce.com` / `password`
- **Admin**: `giri.admin@commerce.com` / `password`


