import { expect } from "chai";
import sequelize from "../database/connection";
import { User } from "../models";
import Category from "../models/category";
import Product from "../models/product";
import ProductImage from "../models/productImage";
import { createCategory, createProduct, createProductImage } from "../services/product";
import { createUser } from "../services/user";
import { CreateUserDto } from "../dtos/user";
import { UserRole } from "../enums/user";
import { Op } from "sequelize";

describe("Product Service Tests", () => {
  let adminUser: any;
  let testCategory: any;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    
    // Create admin user for tests
    const adminData: CreateUserDto = {
      email: "admin@test.com",
      password: "AdminPass123!",
      role: UserRole.ADMIN,
    };
    adminUser = await createUser(adminData);

    // Create test category
    testCategory = await createCategory({
      name: "Test Electronics",
      description: "Test category for electronics"
    });
  });

  describe("Category Service", () => {
    it("1. should create a new category successfully", async () => {
      const categoryData = {
        name: "Books",
        description: "Books and educational materials"
      };

      const category = await createCategory(categoryData);

      expect(category).to.exist;
      expect(category.name).to.equal("Books");
      expect(category.description).to.equal("Books and educational materials");
      expect(category.id).to.be.a("string");
    });

    it("2. should create category without description", async () => {
      const categoryData = {
        name: "Clothing"
      };

      const category = await createCategory(categoryData);

      expect(category).to.exist;
      expect(category.name).to.equal("Clothing");
      expect(category.description).to.be.null;
    });

    it("3. should NOT allow duplicate category names", async () => {
      const categoryData = {
        name: "Duplicate Category",
        description: "First category"
      };

      await createCategory(categoryData);

      try {
        await createCategory(categoryData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("already exists");
      }
    });
  });

  describe("Product Service", () => {
    it("4. should create a new product successfully", async () => {
      const productData = {
        name: "iPhone 15 Pro",
        description: "Latest Apple smartphone",
        price: 999.99,
        stock: 50,
        categoryId: testCategory.id,
        imageUrl: "https://example.com/iphone.jpg",
        cloudinaryPublicId: "products/iphone15pro",
        isActive: true
      };

      const product = await createProduct(productData);

      expect(product).to.exist;
      expect(product.name).to.equal("iPhone 15 Pro");
      expect(product.price).to.equal(999.99);
      expect(product.stock).to.equal(50);
      expect(product.categoryId).to.equal(testCategory.id);
      expect(product.isActive).to.equal(true);
    });

    it("5. should create product with default values", async () => {
      const productData = {
        name: "Basic Product",
        price: 29.99,
        categoryId: testCategory.id
      };

      const product = await createProduct(productData);

      expect(product).to.exist;
      expect(product.stock).to.equal(0); // Default stock
      expect(product.isActive).to.equal(true); // Default active
      expect(product.description).to.be.null;
    });

    it("6. should NOT create product with invalid category", async () => {
      const productData = {
        name: "Invalid Product",
        price: 99.99,
        categoryId: "invalid-uuid"
      };

      try {
        await createProduct(productData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Category not found");
      }
    });

    it("7. should NOT create product with negative price", async () => {
      const productData = {
        name: "Negative Price Product",
        price: -10.00,
        categoryId: testCategory.id
      };

      try {
        await createProduct(productData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Price must be positive");
      }
    });

    it("8. should NOT create product with negative stock", async () => {
      const productData = {
        name: "Negative Stock Product",
        price: 50.00,
        stock: -5,
        categoryId: testCategory.id
      };

      try {
        await createProduct(productData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Stock cannot be negative");
      }
    });
  });

  describe("Product Image Service", () => {
    let testProduct: any;

    beforeEach(async () => {
      testProduct = await createProduct({
        name: "Test Product",
        price: 99.99,
        categoryId: testCategory.id
      });
    });

    it("9. should create product image successfully", async () => {
      const imageData = {
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image.jpg",
        publicId: "products/test-image"
      };

      const productImage = await createProductImage(imageData);

      expect(productImage).to.exist;
      expect(productImage.productId).to.equal(testProduct.id);
      expect(productImage.imageUrl).to.equal("https://example.com/product-image.jpg");
      expect(productImage.publicId).to.equal("products/test-image");
    });

    it("10. should create product image without publicId", async () => {
      const imageData = {
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image2.jpg"
      };

      const productImage = await createProductImage(imageData);

      expect(productImage).to.exist;
      expect(productImage.publicId).to.be.null;
    });

    it("11. should NOT create product image with invalid product ID", async () => {
      const imageData = {
        productId: "invalid-uuid",
        imageUrl: "https://example.com/invalid.jpg"
      };

      try {
        await createProductImage(imageData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Product not found");
      }
    });

    it("12. should NOT create product image with invalid URL", async () => {
      const imageData = {
        productId: testProduct.id,
        imageUrl: "not-a-valid-url"
      };

      try {
        await createProductImage(imageData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Invalid image URL");
      }
    });
  });

  describe("Product Relationships", () => {
    it("13. should load product with category relationship", async () => {
      const product = await createProduct({
        name: "Relationship Test Product",
        price: 199.99,
        categoryId: testCategory.id
      });

      const productWithCategory = await Product.findByPk(product.id, {
        include: [Category]
      });

      expect(productWithCategory).to.exist;
      expect(productWithCategory?.category).to.exist;
      expect(productWithCategory?.category.name).to.equal("Test Electronics");
    });

    it("14. should load product with images relationship", async () => {
      const product = await createProduct({
        name: "Images Test Product",
        price: 299.99,
        categoryId: testCategory.id
      });

      await createProductImage({
        productId: product.id,
        imageUrl: "https://example.com/image1.jpg"
      });

      await createProductImage({
        productId: product.id,
        imageUrl: "https://example.com/image2.jpg"
      });

      const productWithImages = await Product.findByPk(product.id, {
        include: [ProductImage]
      });

      expect(productWithImages).to.exist;
      expect(productWithImages?.productImages).to.have.length(2);
    });

    it("15. should load category with products relationship", async () => {
      await createProduct({
        name: "Product 1",
        price: 99.99,
        categoryId: testCategory.id
      });

      await createProduct({
        name: "Product 2",
        price: 149.99,
        categoryId: testCategory.id
      });

      const categoryWithProducts = await Category.findByPk(testCategory.id, {
        include: [Product]
      });

      expect(categoryWithProducts).to.exist;
      expect(categoryWithProducts?.products).to.have.length(2);
    });
  });

  describe("Product Search and Filtering", () => {
    beforeEach(async () => {
      // Create test products
      await createProduct({
        name: "Active Product",
        price: 99.99,
        categoryId: testCategory.id,
        isActive: true
      });

      await createProduct({
        name: "Inactive Product",
        price: 199.99,
        categoryId: testCategory.id,
        isActive: false
      });
    });

    it("16. should find only active products", async () => {
      const activeProducts = await Product.findAll({
        where: { isActive: true }
      });

      expect(activeProducts).to.have.length(1);
      expect(activeProducts[0].name).to.equal("Active Product");
    });

    it("17. should find products by category", async () => {
      const categoryProducts = await Product.findAll({
        where: { categoryId: testCategory.id }
      });

      expect(categoryProducts).to.have.length(2);
    });

    it("18. should find products by price range", async () => {
      const affordableProducts = await Product.findAll({
        where: {
          price: {
            [Op.lte]: 150.00
          }
        }
      });

      expect(affordableProducts).to.have.length(1);
      expect(affordableProducts[0].name).to.equal("Active Product");
    });
  });
});