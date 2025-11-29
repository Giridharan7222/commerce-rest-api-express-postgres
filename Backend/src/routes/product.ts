import { Router } from "express";
import {
  createProductController,
  createProductWithFilesController,
  getProductController,
  updateProductController,
  deleteProductController,
  createProductImageController,
  getProductImagesController,
  updateProductImageController,
  deleteProductImageController,
  getFilteredProductsController,
} from "../controllers/product";
import {
  createProductValidation,
  updateProductValidation,
  createProductImageValidation,
  updateProductImageValidation,
  productFiltersValidation,
} from "../validators/product";
import { upload } from "../middleware/upload";
import { authenticateToken, requireRole } from "../middleware/auth";
import { UserRole } from "../enums/user";

const router = Router();

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
router.get(
  "/products",
  productFiltersValidation,
  getFilteredProductsController,
);
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
  upload.array("images", 10),
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
