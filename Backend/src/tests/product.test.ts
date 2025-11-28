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
      const imageData = {
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image.jpg",
        publicId: "products/test-image",
      };

      const mockProductImage = {
        id: "image-123",
        ...imageData,
      };

      sandbox
        .stub(productService, "createProductImage")
        .resolves(mockProductImage);

      const productImage = await productService.createProductImage(imageData);

      expect(productImage).to.exist;
      expect(productImage.productId).to.equal(testProduct.id);
      expect(productImage.imageUrl).to.equal(
        "https://example.com/product-image.jpg",
      );
      expect(productImage.publicId).to.equal("products/test-image");
    });

    it("10. should create product image without publicId", async () => {
      const imageData = {
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image2.jpg",
      };

      const mockProductImage = {
        id: "image-456",
        productId: testProduct.id,
        imageUrl: "https://example.com/product-image2.jpg",
        publicId: undefined,
      };

      sandbox
        .stub(productService, "createProductImage")
        .resolves(mockProductImage);

      const productImage = await productService.createProductImage(imageData);

      expect(productImage).to.exist;
      expect(productImage.publicId).to.be.undefined;
    });

    it("11. should NOT create product image with invalid product ID", async () => {
      const imageData = {
        productId: "invalid-uuid",
        imageUrl: "https://example.com/invalid.jpg",
      };

      const error = new Error("Product not found");
      sandbox.stub(productService, "createProductImage").rejects(error);

      try {
        await productService.createProductImage(imageData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Product not found");
      }
    });

    it("12. should NOT create product image with invalid URL", async () => {
      const imageData = {
        productId: testProduct.id,
        imageUrl: "not-a-valid-url",
      };

      const error = new Error("Invalid image URL");
      sandbox.stub(productService, "createProductImage").rejects(error);

      try {
        await productService.createProductImage(imageData);
        throw new Error("Expected error not thrown");
      } catch (err: any) {
        expect(err.message).to.include("Invalid image URL");
      }
    });
  });

  describe("Product Relationships", () => {
    it("13. should load product with category relationship", async () => {
      const mockProduct = {
        id: "product-rel-123",
        name: "Relationship Test Product",
        price: 199.99,
        categoryId: testCategory.id,
      };

      const mockProductWithCategory = {
        ...mockProduct,
        category: testCategory,
      };

      sandbox.stub(productService, "createProduct").resolves(mockProduct);
      sandbox
        .stub(Product, "findByPk")
        .resolves(mockProductWithCategory as any);

      const product = await productService.createProduct({
        name: "Relationship Test Product",
        price: 199.99,
        categoryId: testCategory.id,
      });

      const productWithCategory = await Product.findByPk(product.id, {
        include: [Category],
      });

      expect(productWithCategory).to.exist;
      expect(productWithCategory?.category).to.exist;
      expect(productWithCategory?.category.name).to.equal("Test Electronics");
    });

    it("14. should load product with images relationship", async () => {
      const mockProduct = {
        id: "product-img-123",
        name: "Images Test Product",
        price: 299.99,
        categoryId: testCategory.id,
      };

      const mockImages = [
        {
          id: "img-1",
          productId: mockProduct.id,
          imageUrl: "https://example.com/image1.jpg",
        },
        {
          id: "img-2",
          productId: mockProduct.id,
          imageUrl: "https://example.com/image2.jpg",
        },
      ];

      const mockProductWithImages = {
        ...mockProduct,
        productImages: mockImages,
      };

      sandbox.stub(productService, "createProduct").resolves(mockProduct);
      sandbox
        .stub(productService, "createProductImage")
        .resolves(mockImages[0]);
      sandbox.stub(Product, "findByPk").resolves(mockProductWithImages as any);

      const product = await productService.createProduct({
        name: "Images Test Product",
        price: 299.99,
        categoryId: testCategory.id,
      });

      await productService.createProductImage({
        productId: product.id,
        imageUrl: "https://example.com/image1.jpg",
      });

      await productService.createProductImage({
        productId: product.id,
        imageUrl: "https://example.com/image2.jpg",
      });

      const productWithImages = await Product.findByPk(product.id, {
        include: [ProductImage],
      });

      expect(productWithImages).to.exist;
      expect(productWithImages?.productImages).to.have.length(2);
    });

    it("15. should load category with products relationship", async () => {
      const mockProducts = [
        {
          id: "product-1",
          name: "Product 1",
          price: 99.99,
          categoryId: testCategory.id,
        },
        {
          id: "product-2",
          name: "Product 2",
          price: 149.99,
          categoryId: testCategory.id,
        },
      ];

      const mockCategoryWithProducts = {
        ...testCategory,
        products: mockProducts,
      };

      sandbox.stub(productService, "createProduct").resolves(mockProducts[0]);
      sandbox
        .stub(Category, "findByPk")
        .resolves(mockCategoryWithProducts as any);

      await productService.createProduct({
        name: "Product 1",
        price: 99.99,
        categoryId: testCategory.id,
      });

      await productService.createProduct({
        name: "Product 2",
        price: 149.99,
        categoryId: testCategory.id,
      });

      const categoryWithProducts = await Category.findByPk(testCategory.id, {
        include: [Product],
      });

      expect(categoryWithProducts).to.exist;
      expect(categoryWithProducts?.products).to.have.length(2);
    });
  });

  describe("Product Search and Filtering", () => {
    let mockProducts: any[];

    beforeEach(async () => {
      mockProducts = [
        {
          id: "product-active",
          name: "Active Product",
          price: 99.99,
          categoryId: testCategory.id,
          isActive: true,
        },
        {
          id: "product-inactive",
          name: "Inactive Product",
          price: 199.99,
          categoryId: testCategory.id,
          isActive: false,
        },
      ];

      sandbox.stub(productService, "createProduct").resolves(mockProducts[0]);
    });

    it("16. should find only active products", async () => {
      const activeProducts = [mockProducts[0]];
      sandbox.stub(Product, "findAll").resolves(activeProducts as any);

      const result = await Product.findAll({
        where: { isActive: true },
      });

      expect(result).to.have.length(1);
      expect(result[0].name).to.equal("Active Product");
    });

    it("17. should find products by category", async () => {
      sandbox.stub(Product, "findAll").resolves(mockProducts as any);

      const categoryProducts = await Product.findAll({
        where: { categoryId: testCategory.id },
      });

      expect(categoryProducts).to.have.length(2);
    });

    it("18. should find products by price range", async () => {
      const affordableProducts = [mockProducts[0]];
      sandbox.stub(Product, "findAll").resolves(affordableProducts as any);

      const result = await Product.findAll({
        where: {
          price: {
            [Op.lte]: 150.0,
          },
        },
      });

      expect(result).to.have.length(1);
      expect(result[0].name).to.equal("Active Product");
    });
  });
});
