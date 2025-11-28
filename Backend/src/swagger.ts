import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Commerce API",
      version: "1.0.0",
      description: `E-commerce REST API with Express and PostgreSQL

## Customer Order Flow:
1. **Account**: POST /api/signup OR POST /api/login
2. **Profile**: POST /api/users/profile (new customers)
3. **Address**: POST /api/users/addresses (new customers)
4. **Browse**: GET /api/categories → GET /api/products
5. **Cart**: POST /api/cart (add products)
6. **Stripe**: POST /api/stripe/customers
7. **Order**: POST /api/orders
8. **Payment**: POST /api/stripe/process-payment

**Test Account**: giri.customer@commerce.com / password

## Admin Management Flow:
1. **Login**: POST /api/login (giri.admin@commerce.com / password)
2. **Create Admin**: POST /api/users/create-admin (admin only)
3. **Categories**: POST /api/categories (create/manage)
4. **Products**: POST /api/products OR POST /api/products/upload
5. **Product Images**: POST /api/product-images (manage images)
6. **System Health**: GET/POST /api/system-health (monitor)

**Test Admin**: giri.admin@commerce.com / password

**Note**: Additional APIs available for user management, order management, payment methods, and more. See individual endpoint documentation below.

📖 **For detailed documentation, visit**: [GitHub README](https://github.com/Giridharan7222/commerce-rest-api-express-postgres/blob/main/Backend/README.md)
📋 **For step-by-step API flows, visit**: [API Flow Guide](https://github.com/Giridharan7222/commerce-rest-api-express-postgres/blob/main/Backend/FLOW.md)
🗄️ **For database setup, visit**: [Database README](https://github.com/Giridharan7222/commerce-rest-api-express-postgres/blob/main/DB/README.md)`,
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5005",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["email", "password"],
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["customer", "admin"] },
          },
        },
        UserProfile: {
          type: "object",
          required: ["firstName", "lastName"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            dateOfBirth: { type: "string", format: "date" },
          },
        },
        Address: {
          type: "object",
          required: ["street", "city", "state", "zipCode", "country"],
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zipCode: { type: "string" },
            country: { type: "string" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
            categoryId: { type: "string", format: "uuid" },
            imageUrl: { type: "string", format: "uri" },
            cloudinaryPublicId: { type: "string" },
            isActive: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        ProductImage: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            productId: { type: "string", format: "uuid" },
            imageUrl: { type: "string", format: "uri" },
            publicId: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        ProductListResponse: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
            pagination: {
              type: "object",
              properties: {
                currentPage: { type: "integer" },
                totalPages: { type: "integer" },
                totalItems: { type: "integer" },
                itemsPerPage: { type: "integer" },
              },
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "An error occurred" },
            error: { type: "string" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        SystemHealth: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            server_status: {
              type: "string",
              enum: ["UP", "DOWN", "MAINTENANCE", "DEGRADED"],
            },
            cpu_usage: { type: "number", minimum: 0, maximum: 100 },
            memory_usage: { type: "number", minimum: 0, maximum: 100 },
            disk_usage: { type: "number", minimum: 0, maximum: 100 },
            checked_at: { type: "string", format: "date-time" },
          },
        },
        SystemHealthInput: {
          type: "object",
          required: ["server_status"],
          properties: {
            server_status: {
              type: "string",
              enum: ["UP", "DOWN", "MAINTENANCE", "DEGRADED"],
            },
            cpu_usage: { type: "number", minimum: 0, maximum: 100 },
            memory_usage: { type: "number", minimum: 0, maximum: 100 },
            disk_usage: { type: "number", minimum: 0, maximum: 100 },
          },
        },
      },
    },
  },
  apis: [
    "./src/docs/swagger/auth.swagger.yaml",
    "./src/docs/swagger/user.swagger.yaml",
    "./src/docs/swagger/profile.swagger.yaml",
    "./src/docs/swagger/address.swagger.yaml",
    "./src/docs/swagger/category.swagger.yaml",
    "./src/docs/swagger/product.swagger.yaml",
    "./src/docs/swagger/cart.swagger.yaml",
    "./src/docs/swagger/order.swagger.yaml",
    "./src/docs/swagger/stripe.swagger.yaml",
    "./src/docs/swagger/payment-methods.swagger.yaml",
    "./src/docs/swagger/system-health.swagger.yaml",
    "./src/app.ts",
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
};
