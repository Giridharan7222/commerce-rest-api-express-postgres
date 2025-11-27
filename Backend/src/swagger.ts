import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Commerce API",
      version: "1.0.0",
      description: "E-commerce REST API with Express and PostgreSQL",
    },
    servers: [
      {
        url: "http://localhost:5005",
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
      },
    },
  },
  apis: [
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
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
};
