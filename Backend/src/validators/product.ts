import { Request } from "express";
import { body, query } from "express-validator";

export const createCategoryValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").optional().isString(),
];

export const updateCategoryValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().isString(),
];

export const createProductValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").optional().isString(),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("categoryId").isUUID().withMessage("Valid category ID is required"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
  body("cloudinaryPublicId").optional().isString(),
  body("isActive").optional().isBoolean(),
  body("productImages").optional().isArray(),
  body("productImages.*.imageUrl")
    .optional()
    .isURL()
    .withMessage("Product image URL must be valid"),
  body("productImages.*.publicId").optional().isString(),
];

export const updateProductValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().isString(),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("Category ID must be valid"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
  body("cloudinaryPublicId").optional().isString(),
  body("isActive").optional().isBoolean(),
];

export const createProductImageValidation = [
  body("productId").isUUID().withMessage("Valid product ID is required"),
];

export const updateProductImageValidation = [
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
  body("publicId").optional().isString(),
];

export function createCategoryPayload(req: Request) {
  return {
    name: req.body.name,
    description: req.body.description,
  };
}

export function createProductPayload(req: Request) {
  return {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock || 0,
    categoryId: req.body.categoryId,
    imageUrl: req.body.imageUrl,
    cloudinaryPublicId: req.body.cloudinaryPublicId,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    productImages: req.body.productImages || [],
  };
}

export function createProductImagePayload(req: Request) {
  return {
    productId: req.body.productId,
    imageUrl: req.body.imageUrl,
    publicId: req.body.publicId,
  };
}

export const productFiltersValidation = [
  query("search").optional().isString().withMessage("Search must be a string"),
  query("categoryId")
    .optional()
    .isUUID()
    .withMessage("Category ID must be a valid UUID"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min price must be a positive number"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max price must be a positive number"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
