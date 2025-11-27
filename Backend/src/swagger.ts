import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Commerce API",
      version: "1.0.0",
      description: `
# 🛍️ E-commerce REST API with Express and PostgreSQL

## 📖 Quick Navigation
- **[API Flows & Integration Guide](#tag/API-Flows)** - Complete user journey flowcharts
- **[Authentication](#tag/Authentication)** - Login/Signup endpoints
- **[Products](#tag/Products)** - Product management (Admin)
- **[Categories](#tag/Categories)** - Category management (Admin) 
- **[Cart](#tag/Cart)** - Shopping cart operations (Customer)
- **[Orders](#tag/Orders)** - Order management

## 🚀 Getting Started
1. Create an account using \`POST /api/signup\`
2. Login with \`POST /api/login\` to get JWT token
3. Use token in Authorization header: \`Bearer <token>\`
4. Follow the API flows below based on your role (Admin/Customer)

---
      `,
    },
    servers: [
      {
        url: "http://localhost:5005",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "API Flows",
        description: "Complete integration guide with user journey flowcharts for Admin and Customer workflows"
      },
      {
        name: "Authentication", 
        description: "User registration and login endpoints"
      },
      {
        name: "Products",
        description: "Product management operations (Admin access required)"
      },
      {
        name: "Categories",
        description: "Product category management (Admin access required)"
      },
      {
        name: "Cart",
        description: "Shopping cart operations (Customer access required)"
      },
      {
        name: "Orders",
        description: "Order management and tracking"
      }
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
      },
    },
  },
  apis: [
    "./src/docs/swagger/api-flows.swagger.yaml",
    "./src/docs/swagger/auth.swagger.yaml",
    "./src/docs/swagger/user.swagger.yaml",
    "./src/docs/swagger/profile.swagger.yaml",
    "./src/docs/swagger/address.swagger.yaml",
    "./src/docs/swagger/product.swagger.yaml",
    "./src/docs/swagger/cart.swagger.yaml",
    "./src/docs/swagger/order.swagger.yaml",
    "./src/docs/swagger/stripe.swagger.yaml",
    "./src/docs/swagger/payment-methods.swagger.yaml",
    "./src/app.ts",
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  const customCss = `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin-bottom: 30px; }
    .swagger-ui .info .title { color: #2c3e50; font-size: 2.5em; }
    .swagger-ui .info .description { font-size: 1.1em; line-height: 1.6; }
    .swagger-ui .opblock-tag { font-size: 1.2em; font-weight: bold; }
    .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
    .swagger-ui .opblock.opblock-get { border-color: #61affe; }
    .swagger-ui .opblock.opblock-put { border-color: #fca130; }
    .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
  `;

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss,
      customSiteTitle: "Commerce API Documentation",
      customfavIcon: "/favicon.ico",
      swaggerOptions: {
        tagsSorter: "alpha",
        operationsSorter: "alpha",
        docExpansion: "none",
        filter: true,
        showRequestHeaders: true,
      },
    }),
  );
};
