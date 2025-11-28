import { Request, Response } from "express";
import { handleValidationErrors } from "../utils/validation";
import { AdminRequest } from "../interfaces";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/product";

export const createCategoryController = async (
  req: AdminRequest,
  res: Response,
) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const adminId = req.user?.role === "admin" ? req.user.id : undefined;
    const category = await createCategory(req.body, adminId);
    return (res as any).success("Category created successfully", category, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create category",
      "CREATE_CATEGORY_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getAllCategoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const categories = await getAllCategories();
    return (res as any).success(
      "Categories retrieved successfully",
      categories,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to get categories",
      "GET_CATEGORIES_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getCategoryController = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    return (res as any).success(
      "Category retrieved successfully",
      category,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to get category",
      "GET_CATEGORY_ERROR",
      (error as any).message,
      404,
    );
  }
};

export const updateCategoryController = async (
  req: AdminRequest,
  res: Response,
) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const categoryId = req.params.id;
    const adminId = req.user?.role === "admin" ? req.user.id : undefined;
    const category = await updateCategory(categoryId, req.body, adminId);
    return (res as any).success("Category updated successfully", category, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to update category",
      "UPDATE_CATEGORY_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const deleteCategoryController = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    const categoryId = req.params.id;
    const adminId = req.user?.role === "admin" ? req.user.id : undefined;
    const result = await deleteCategory(categoryId, adminId);
    return (res as any).success("Category deleted successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to delete category",
      "DELETE_CATEGORY_ERROR",
      (error as any).message,
      500,
    );
  }
};
