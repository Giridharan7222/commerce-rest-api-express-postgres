import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/product";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../validators/product";
import { authenticateToken, requireRole } from "../middleware/auth";
import { UserRole } from "../enums/user";

const router = Router();

router.post(
  "/",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  createCategoryValidation,
  createCategoryController,
);
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryController);
router.put(
  "/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  updateCategoryValidation,
  updateCategoryController,
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  deleteCategoryController,
);

export default router;