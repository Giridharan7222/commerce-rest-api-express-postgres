# Backend API

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

## Additional Information

For detailed setup, configuration, and usage instructions:
- **Database setup & configuration**: See `../DB/README.md`
- **Backend API setup & development**: See this `Backend/` folder documentation
- **Database schema & migrations**: See `../DB/readme/DATABASE_SCHEMA.md`
