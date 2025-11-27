import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductImageDto,
  UpdateProductImageDto,
} from "../dtos/product";
import Category from "../models/category";
import Product from "../models/product";
import ProductImage from "../models/productImage";
import { uploadFile } from "../utils/cloudinary";

export async function createCategory(dto: CreateCategoryDto) {
  // Check for duplicate category name
  const existingCategory = await Category.findOne({
    where: { name: dto.name },
  });
  if (existingCategory) {
    throw new Error(`Category with name '${dto.name}' already exists`);
  }

  const category = await Category.create(dto as any);
  return category.get({ plain: true });
}

export async function getAllCategories() {
  const categories = await Category.findAll({
    order: [["created_at", "DESC"]],
  });
  return categories.map((category: any) => category.get({ plain: true }));
}

export async function getCategoryById(categoryId: string) {
  const category = await Category.findByPk(categoryId, {
    include: [{ model: Product, as: "products" }],
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category.get({ plain: true });
}

export async function updateCategory(
  categoryId: string,
  dto: UpdateCategoryDto,
) {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  await category.update(dto);
  return category.get({ plain: true });
}

export async function deleteCategory(categoryId: string) {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  await category.destroy();
  return { message: "Category deleted successfully" };
}

export async function createProduct(dto: CreateProductDto) {
  const category = await Category.findByPk(dto.categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  if (dto.price <= 0) {
    throw new Error("Price must be positive");
  }

  if (dto.stock && dto.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const { productImages, ...productData } = dto;
  const product = await Product.create(productData as any);

  if (productImages && productImages.length > 0) {
    const imagePromises = productImages.map((image) =>
      ProductImage.create({
        productId: product.id,
        imageUrl: image.imageUrl,
        publicId: image.publicId,
      } as any),
    );
    await Promise.all(imagePromises);
  }

  return getProductById(product.id);
}

export async function createProductWithFiles(
  productData: any,
  mainImage?: any,
  additionalImages?: any[],
) {
  const category = await Category.findByPk(productData.categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  let imageUrl, cloudinaryPublicId;
  if (mainImage) {
    const uploadResult = await uploadFile(mainImage, "products");
    imageUrl = uploadResult.imageUrl;
    cloudinaryPublicId = uploadResult.publicId;
  }

  const product = await Product.create({
    ...productData,
    imageUrl,
    cloudinaryPublicId,
  } as any);

  if (additionalImages && additionalImages.length > 0) {
    const imagePromises = additionalImages.map(async (file) => {
      const uploadResult = await uploadFile(file, "products");
      return ProductImage.create({
        productId: product.id,
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
      } as any);
    });
    await Promise.all(imagePromises);
  }

  return getProductById(product.id);
}

export async function getAllProducts() {
  const products = await Product.findAll({
    include: [
      { model: Category, as: "category" },
      { model: ProductImage, as: "productImages" },
    ],
    order: [["created_at", "DESC"]],
  });
  return products.map((product: any) => product.get({ plain: true }));
}

export async function getProductById(productId: string) {
  const product = await Product.findByPk(productId, {
    include: [
      { model: Category, as: "category" },
      { model: ProductImage, as: "productImages" },
    ],
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product.get({ plain: true });
}

export async function updateProduct(productId: string, dto: UpdateProductDto) {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (dto.categoryId) {
    const category = await Category.findByPk(dto.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
  }

  await product.update(dto);
  return product.get({ plain: true });
}

export async function deleteProduct(productId: string) {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.destroy();
  return { message: "Product deleted successfully" };
}

export async function createProductImage(dto: CreateProductImageDto) {
  const product = await Product.findByPk(dto.productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Basic URL validation
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(dto.imageUrl)) {
    throw new Error("Invalid image URL");
  }

  const productImage = await ProductImage.create(dto as any);
  return productImage.get({ plain: true });
}

export async function getProductImages(productId: string) {
  const images = await ProductImage.findAll({
    where: { productId },
    order: [["created_at", "DESC"]],
  });
  return images.map((image: any) => image.get({ plain: true }));
}

export async function updateProductImage(
  imageId: string,
  dto: UpdateProductImageDto,
) {
  const image = await ProductImage.findByPk(imageId);

  if (!image) {
    throw new Error("Product image not found");
  }

  await image.update(dto);
  return image.get({ plain: true });
}

export async function deleteProductImage(imageId: string) {
  const image = await ProductImage.findByPk(imageId);

  if (!image) {
    throw new Error("Product image not found");
  }

  await image.destroy();
  return { message: "Product image deleted successfully" };
}
