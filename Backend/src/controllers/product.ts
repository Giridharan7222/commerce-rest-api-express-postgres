import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createProduct,
  createProductWithFiles,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductImage,
  getProductImages,
  updateProductImage,
  deleteProductImage,
  getFilteredProducts,
} from "../services/product";

interface AdminRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createCategoryController = async (
  req: AdminRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
  }

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
  }

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

export const createProductController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
  }

  try {
    const product = await createProduct(req.body);
    return (res as any).success("Product created successfully", product, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create product",
      "CREATE_PRODUCT_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const createProductWithFilesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImage = files?.mainImage?.[0];
    const additionalImages = files?.additionalImages || [];

    const product = await createProductWithFiles(
      req.body,
      mainImage,
      additionalImages,
    );

    return (res as any).success("Product created successfully", product, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create product",
      "CREATE_PRODUCT_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return (res as any).success(
      "Products retrieved successfully",
      products,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to get products",
      "GET_PRODUCTS_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    return (res as any).success("Product retrieved successfully", product, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get product",
      "GET_PRODUCT_ERROR",
      (error as any).message,
      404,
    );
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
  }

  try {
    const productId = req.params.id;
    const product = await updateProduct(productId, req.body);
    return (res as any).success("Product updated successfully", product, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to update product",
      "UPDATE_PRODUCT_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const result = await deleteProduct(productId);
    return (res as any).success("Product deleted successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to delete product",
      "DELETE_PRODUCT_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const createProductImageController = async (
  req: Request,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
  }

  try {
    const productImage = await createProductImage(req.body);
    return (res as any).success(
      "Product image created successfully",
      productImage,
      201,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to create product image",
      "CREATE_PRODUCT_IMAGE_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getProductImagesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const productId = req.params.productId;
    const images = await getProductImages(productId);
    return (res as any).success(
      "Product images retrieved successfully",
      images,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to get product images",
      "GET_PRODUCT_IMAGES_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const updateProductImageController = async (
  req: Request,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res as any).fail(
      "Validation failed",
      "VALIDATION_ERROR",
      errors.array(),
      400,
    );
  }

  try {
    const imageId = req.params.id;
    const image = await updateProductImage(imageId, req.body);
    return (res as any).success(
      "Product image updated successfully",
      image,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to update product image",
      "UPDATE_PRODUCT_IMAGE_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const deleteProductImageController = async (
  req: Request,
  res: Response,
) => {
  try {
    const imageId = req.params.id;
    const result = await deleteProductImage(imageId);
    return (res as any).success(
      "Product image deleted successfully",
      result,
      200,
    );
  } catch (error) {
    return (res as any).fail(
      "Failed to delete product image",
      "DELETE_PRODUCT_IMAGE_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getFilteredProductsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasFilters =
      req.query.search ||
      req.query.categoryId ||
      req.query.minPrice ||
      req.query.maxPrice ||
      req.query.page ||
      req.query.limit;

    if (!hasFilters) {
      const products = await getAllProducts();
      return (res as any).success(
        "Products retrieved successfully",
        products,
        200,
      );
    }

    const filters = {
      search: req.query.search as string,
      categoryId: req.query.categoryId as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const result = await getFilteredProducts(filters);
    return (res as any).success("Products retrieved successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get products",
      "GET_PRODUCTS_ERROR",
      (error as any).message,
      500,
    );
  }
};
