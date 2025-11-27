import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
  createProductController,
  createProductWithFilesController,
  getAllProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
  createProductImageController,
  getProductImagesController,
  updateProductImageController,
  deleteProductImageController,
} from "../controllers/product";
import {
  createCategoryValidation,
  updateCategoryValidation,
  createProductValidation,
  updateProductValidation,
  createProductImageValidation,
  updateProductImageValidation,
} from "../validators/product";
import { upload } from "../middleware/upload";
import { authenticateToken, requireRole } from "../middleware/auth";
import { UserRole } from "../enums/user";

const router = Router();

router.post(
  "/categories",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  createCategoryValidation,
  createCategoryController,
);
router.get("/categories", getAllCategoriesController);
router.get("/categories/:id", getCategoryController);
router.put(
  "/categories/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  updateCategoryValidation,
  updateCategoryController,
);
router.delete(
  "/categories/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  deleteCategoryController,
);

router.post(
  "/products",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  createProductValidation,
  createProductController,
);
router.post(
  "/products/upload", //important api
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  createProductWithFilesController,
);
router.get("/products", getAllProductsController);
router.get("/products/:id", getProductController);
router.put(
  "/products/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  updateProductValidation,
  updateProductController,
);
router.delete(
  "/products/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  deleteProductController,
);

router.post(
  "/product-images",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  createProductImageValidation,
  createProductImageController,
);
router.get("/products/:productId/images", getProductImagesController);
router.put(
  "/product-images/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  updateProductImageValidation,
  updateProductImageController,
);
router.delete(
  "/product-images/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  deleteProductImageController,
);

export default router;
