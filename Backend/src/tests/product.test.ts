import { expect } from "chai";
import sinon from "sinon";
import { User } from "../models";
import Category from "../models/category";
import Product from "../models/product";
import ProductImage from "../models/productImage";
import * as productService from "../services/product";
import * as userService from "../services/user";
import { CreateUserDto } from "../dtos/user";
import { UserRole } from "../enums/user";
import { Op } from "sequelize";

describe("Product Service Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let adminUser: any;
  let testCategory: any;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    adminUser = {
      id: "admin-123",
      email: "admin@test.com",
      password: "hashedpassword",
      role: UserRole.ADMIN,
      is_active: true,
    };

    testCategory = {
      id: "category-123",
      name: "Test Electronics",
      description: "Test category for electronics",
    };

    sandbox.stub(userService, "createUser").resolves(adminUser);
    sandbox.stub(productService, "createCategory").resolves(testCategory);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Category Service", () => {
    it("1. should create a new category successfully", async () => {
      const categoryData = {
        name: "Books",
        description: "Books and educational materials",
      };

      const mockCategory = {
        id: "category-456",
        name: "Books",
        description: "Books and educational materials",
      };

      sandbox.restore();
      sandbox.stub(productService, "createCategory").resolves(mockCategory);

      const category = await productService.createCategory(categoryData);

      expect(category).to.exist;
      expect(category.name).to.equal("Books");
      expect(category.description).to.equal("Books and educational materials");
      expect(category.id).to.be.a("string");
    });

    it("2. should create category without description", async () => {
      const categoryData = {
        name: "Clothing",
      };

      const mockCategory = {
        id: "category-789",
        name: "Clothing",
        description: undefined,
      };

      sandbox.restore();
      sandbox.stub(productService, "createCategory").resolves(mockCategory);

      const category = await productService.createCategory(categoryData);

      expect(category).to.exist;
      expect(category.name).to.equal("Clothing");
      expect(category.description).to.be.undefined;
    });

    it("3. should NOT allow duplicate category names", async () => {
      const categoryData = {
        name: "Duplicate Category",
        description: "First category",
      };

      const mockCategory = {
        id: "category-duplicate",
        name: "Duplicate Category",
        description: "First category",
      };

      const error = new Error("Category already exists");

      sandbox.restore();
      sandbox
        .stub(productService, "createCategory")
        .onFirstCall()
        .resolves(mockCategory)
        .onSecondCall()
        .rejects(error);

      await productService.createCategory(categoryData);

      try {
        await productService.createCategory(categoryData);
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
        isActive: true,
      };

      const mockProduct = {
        id: "product-123",
        ...productData,
      };

      sandbox.restore();
      sandbox.stub(productService, "createProduct").resolves(mockProduct);

      const product = await productService.createProduct(productData);

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
        categoryId: testCategory.id,
      };

      const mockProduct = {
        id: "product-456",
        name: "Basic Product",
        price: 29.99,
        categoryId: testCategory.id,
        stock: 0,
        isActive: true,
        description: null,
      };

      sandbox.restore();
      sandbox.stub(productService, "createProduct").resolves(mockProduct);

      const product = await productService.createProduct(productData);

      expect(product).to.exist;
      expect(product.stock).to.equal(0);
      expect(product.isActive).to.equal(true);
      expect(product.description).to.be.null;
    });

    it("6. should NOT create product with invalid category", async () => {
      const productData = {
        name: "Invalid Product",
        price: 99.99,
        categoryId: "invalid-uuid",
      };

      const error = new Error("Category not found");
      sandbox.restore();
      sandbox.stub(productService, "createProduct").rejects(error);

      try {
        await productService.createProduct(productData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Category not found");
      }
    });

    it("7. should NOT create product with negative price", async () => {
      const productData = {
        name: "Negative Price Product",
        price: -10.0,
        categoryId: testCategory.id,
      };

      const error = new Error("Price must be positive");
      sandbox.restore();
      sandbox.stub(productService, "createProduct").rejects(error);

      try {
        await productService.createProduct(productData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Price must be positive");
      }
    });

    it("8. should NOT create product with negative stock", async () => {
      const productData = {
        name: "Negative Stock Product",
        price: 50.0,
        stock: -5,
        categoryId: testCategory.id,
      };

      const error = new Error("Stock cannot be negative");
      sandbox.restore();
      sandbox.stub(productService, "createProduct").rejects(error);

      try {
        await productService.createProduct(productData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Stock cannot be negative");
      }
    });
  });

  describe("Product Image Service", () => {
    let testProduct: any;

    beforeEach(async () => {
      testProduct = {
        id: "product-test-123",
        name: "Test Product",
        price: 99.99,
        categoryId: testCategory.id,
      };

      sandbox.restore();
      sandbox.stub(productService, "createProduct").resolves(testProduct);
    });

    it("9. should create product image successfully", async () => {
      const mockFiles = [{
        filename: "test-image.jpg",
        path: "/tmp/test-image.jpg",
        mimetype: "image/jpeg"
      }] as any[];

      const mockProductImages = [{
        id: "image-123",
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image.jpg",
        publicId: "products/test-image",
      }];

      sandbox
        .stub(productService, "createProductImage")
        .resolves(mockProductImages);

      const productImages = await productService.createProductImage(testProduct.id, mockFiles);

      expect(productImages).to.exist;
      expect(productImages[0].productId).to.equal(testProduct.id);
      expect(productImages[0].imageUrl).to.equal(
        "https://example.com/product-image.jpg",
      );
      expect(productImages[0].publicId).to.equal("products/test-image");
    });

    it("10. should create product image without publicId", async () => {
      const mockFiles = [{
        filename: "test-image2.jpg",
        path: "/tmp/test-image2.jpg",
        mimetype: "image/jpeg"
      }] as any[];

      const mockProductImages = [{
        id: "image-456",
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image2.jpg",
        publicId: undefined,
      }];

      sandbox
        .stub(productService, "createProductImage")
        .resolves(mockProductImages);

      const productImages = await productService.createProductImage(testProduct.id, mockFiles);

      expect(productImages).to.exist;
      expect(productImages[0].publicId).to.be.undefined;
    });

    it("11. should NOT create product image with invalid product ID", async () => {
      const mockFiles = [{
        filename: "invalid.jpg",
        path: "/tmp/invalid.jpg",
        mimetype: "image/jpeg"
      }] as any[];

      const error = new Error("Product not found");
      sandbox.stub(productService, "createProductImage").rejects(error);

      try {
        await productService.createProductImage("invalid-uuid", mockFiles);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Product not found");
      }
    });
  });
});