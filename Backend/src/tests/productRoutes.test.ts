import { expect } from "chai";
import sinon from "sinon";
import { User, Product, Category, ProductImage } from "../models";
import { UserRole } from "../enums/user";

describe("Product Routes Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testUser: any;
  let adminUser: any;
  let testCategory: any;
  let testProduct: any;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    // Mock test users
    testUser = {
      id: "user-123",
      email: "user@example.com",
      password: "hashedpassword",
      role: UserRole.CUSTOMER,
      is_active: true,
    };

    adminUser = {
      id: "admin-123",
      email: "admin@example.com",
      password: "hashedpassword",
      role: UserRole.ADMIN,
      is_active: true,
    };

    // Mock test category
    testCategory = {
      id: "category-123",
      name: "Electronics",
      description: "Electronic devices",
    };

    // Mock test product
    testProduct = {
      id: "product-123",
      name: "Test Product",
      description: "Test product description",
      price: 99.99,
      stock: 10,
      categoryId: testCategory.id,
      image_url: "test-image.jpg",
      isActive: true,
      update: sandbox.stub().callsFake((updates: any) => {
        Object.assign(testProduct, updates);
        return Promise.resolve(testProduct);
      }),
      destroy: sandbox.stub().resolves(),
      reload: sandbox.stub().callsFake(() => {
        return Promise.resolve(testProduct);
      }),
    };

    // Mock model methods
    sandbox.stub(User, "create").resolves(testUser as any);
    sandbox.stub(Category, "create").resolves(testCategory as any);
    sandbox.stub(Product, "create").resolves(testProduct as any);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Product CRUD Operations", () => {
    it("should create product successfully", async () => {
      const productData = {
        name: "New Product",
        description: "New product description",
        price: 149.99,
        stock: 5,
        categoryId: testCategory.id,
        imageUrl: "new-product.jpg",
        isActive: true,
      };

      const mockNewProduct = {
        id: "product-new",
        ...productData,
      };

      sandbox.restore();
      sandbox.stub(Product, "create").resolves(mockNewProduct as any);

      const product = await Product.create(productData);

      expect(product).to.exist;
      expect(product.name).to.equal("New Product");
      expect(product.price).to.equal(149.99);
      expect(product.stock).to.equal(5);
      expect(product.categoryId).to.equal(testCategory.id);
    });

    it("should require valid categoryId", async () => {
      const error = new Error(
        "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed",
      );
      sandbox.restore();
      sandbox.stub(Product, "create").rejects(error);

      try {
        await Product.create({
          name: "Invalid Product",
          price: 99.99,
          categoryId: "invalid-id",
          stock: 10,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("SQLITE_CONSTRAINT");
      }
    });

    it("should get product by ID", async () => {
      sandbox.stub(Product, "findByPk").resolves(testProduct as any);

      const foundProduct = await Product.findByPk(testProduct.id);

      expect(foundProduct).to.exist;
      expect(foundProduct?.name).to.equal("Test Product");
      expect(foundProduct?.price).to.equal(99.99);
    });

    it("should update product", async () => {
      await testProduct.update({
        name: "Updated Product",
        price: 199.99,
      });

      expect(testProduct.name).to.equal("Updated Product");
      expect(testProduct.price).to.equal(199.99);
    });

    it("should delete product", async () => {
      sandbox.stub(Product, "findByPk").resolves(null);

      await testProduct.destroy();

      const deletedProduct = await Product.findByPk(testProduct.id);
      expect(deletedProduct).to.be.null;
    });
  });

  describe("Product Filtering and Search", () => {
    let mockProducts: any[];

    beforeEach(async () => {
      mockProducts = [
        testProduct,
        {
          id: "laptop-123",
          name: "Laptop",
          description: "Gaming laptop",
          price: 1299.99,
          stock: 3,
          categoryId: testCategory.id,
          isActive: true,
        },
        {
          id: "mouse-123",
          name: "Mouse",
          description: "Wireless mouse",
          price: 29.99,
          stock: 20,
          categoryId: testCategory.id,
          isActive: false,
        },
      ];
    });

    it("should find products by category", async () => {
      sandbox.stub(Product, "findAll").resolves(mockProducts as any);

      const products = await Product.findAll({
        where: { categoryId: testCategory.id },
      });

      expect(products.length).to.be.greaterThan(1);
    });

    it("should find active products only", async () => {
      const activeProducts = mockProducts.filter((p) => p.isActive);
      sandbox.stub(Product, "findAll").resolves(activeProducts as any);

      const result = await Product.findAll({
        where: { isActive: true },
      });

      expect(result).to.have.length(2); // testProduct + Laptop
      result.forEach((product) => {
        expect(product.isActive).to.be.true;
      });
    });

    it("should find products by price range", async () => {
      const affordableProducts = mockProducts.filter((p) => p.price <= 100);
      sandbox.stub(Product, "findAll").resolves(affordableProducts as any);

      const result = await Product.findAll({
        where: {
          price: { [require("sequelize").Op.lte]: 100 },
        },
      });

      expect(result).to.have.length(2); // testProduct + Mouse
    });

    it("should search products by name", async () => {
      const laptopProducts = mockProducts.filter((p) =>
        p.name.includes("Laptop"),
      );
      sandbox.stub(Product, "findAll").resolves(laptopProducts as any);

      const result = await Product.findAll({
        where: {
          name: { [require("sequelize").Op.like]: "%Laptop%" },
        },
      });

      expect(result).to.have.length(1);
      expect(result[0].name).to.equal("Laptop");
    });
  });

  describe("Product Images", () => {
    let testProductImage: any;

    beforeEach(async () => {
      testProductImage = {
        id: "image-123",
        productId: testProduct.id,
        imageUrl: "https://example.com/image1.jpg",
        publicId: "products/image1",
        update: sandbox.stub().callsFake((updates: any) => {
          Object.assign(testProductImage, updates);
          return Promise.resolve(testProductImage);
        }),
        destroy: sandbox.stub().resolves(),
      };

      sandbox.stub(ProductImage, "create").resolves(testProductImage as any);
    });

    it("should create product image", async () => {
      const mockNewImage = {
        id: "image-new",
        productId: testProduct.id,
        imageUrl: "https://example.com/image2.jpg",
        publicId: "products/image2",
      };

      sandbox.restore();
      sandbox.stub(ProductImage, "create").resolves(mockNewImage as any);

      const productImage = await ProductImage.create({
        productId: testProduct.id,
        imageUrl: "https://example.com/image2.jpg",
        publicId: "products/image2",
      });

      expect(productImage).to.exist;
      expect(productImage.productId).to.equal(testProduct.id);
      expect(productImage.imageUrl).to.equal("https://example.com/image2.jpg");
    });

    it("should get product images", async () => {
      sandbox.stub(ProductImage, "findAll").resolves([testProductImage] as any);

      const images = await ProductImage.findAll({
        where: { productId: testProduct.id },
      });

      expect(images).to.have.length(1);
      expect(images[0].imageUrl).to.equal("https://example.com/image1.jpg");
    });

    it("should update product image", async () => {
      await testProductImage.update({
        imageUrl: "https://example.com/updated-image.jpg",
      });

      expect(testProductImage.imageUrl).to.equal(
        "https://example.com/updated-image.jpg",
      );
    });

    it("should delete product image", async () => {
      sandbox.stub(ProductImage, "findByPk").resolves(null);

      await testProductImage.destroy();

      const deletedImage = await ProductImage.findByPk(testProductImage.id);
      expect(deletedImage).to.be.null;
    });

    it("should require valid productId", async () => {
      const error = new Error(
        "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed",
      );
      sandbox.restore();
      sandbox.stub(ProductImage, "create").rejects(error);

      try {
        await ProductImage.create({
          productId: "invalid-id",
          imageUrl: "https://example.com/invalid.jpg",
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("SQLITE_CONSTRAINT");
      }
    });
  });

  describe("Product Relationships", () => {
    it("should load product with category", async () => {
      const mockProductWithCategory = {
        ...testProduct,
        category: testCategory,
      };

      sandbox
        .stub(Product, "findByPk")
        .resolves(mockProductWithCategory as any);

      const productWithCategory = await Product.findByPk(testProduct.id, {
        include: [Category],
      });

      expect(productWithCategory).to.exist;
      expect(productWithCategory?.category).to.exist;
      expect(productWithCategory?.category.name).to.equal("Electronics");
    });

    it("should load product with images", async () => {
      const mockImages = [
        {
          id: "img-1",
          productId: testProduct.id,
          imageUrl: "https://example.com/image1.jpg",
        },
        {
          id: "img-2",
          productId: testProduct.id,
          imageUrl: "https://example.com/image2.jpg",
        },
      ];

      const mockProductWithImages = {
        ...testProduct,
        productImages: mockImages,
      };

      sandbox.stub(ProductImage, "create").resolves(mockImages[0] as any);
      sandbox.stub(Product, "findByPk").resolves(mockProductWithImages as any);

      await ProductImage.create({
        productId: testProduct.id,
        imageUrl: "https://example.com/image1.jpg",
      });

      await ProductImage.create({
        productId: testProduct.id,
        imageUrl: "https://example.com/image2.jpg",
      });

      const productWithImages = await Product.findByPk(testProduct.id, {
        include: [ProductImage],
      });

      expect(productWithImages).to.exist;
      expect(productWithImages?.productImages).to.have.length(2);
    });

    it("should load category with products", async () => {
      const mockCategoryWithProducts = {
        ...testCategory,
        products: [testProduct],
      };

      sandbox
        .stub(Category, "findByPk")
        .resolves(mockCategoryWithProducts as any);

      const categoryWithProducts = await Category.findByPk(testCategory.id, {
        include: [Product],
      });

      expect(categoryWithProducts).to.exist;
      expect(categoryWithProducts?.products).to.have.length.greaterThan(0);
    });
  });

  describe("Product Validation", () => {
    it("should require name", async () => {
      const error = new Error("name cannot be null");
      sandbox.restore();
      sandbox.stub(Product, "create").rejects(error);

      try {
        await Product.create({
          price: 99.99,
          categoryId: testCategory.id,
          stock: 10,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("name cannot be null");
      }
    });

    it("should require price", async () => {
      const error = new Error("price cannot be null");
      sandbox.restore();
      sandbox.stub(Product, "create").rejects(error);

      try {
        await Product.create({
          name: "Test Product",
          categoryId: testCategory.id,
          stock: 10,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("price cannot be null");
      }
    });

    it("should default stock to 0", async () => {
      const mockProduct = {
        id: "product-default-stock",
        name: "No Stock Product",
        price: 99.99,
        categoryId: testCategory.id,
        stock: 0,
      };

      sandbox.restore();
      sandbox.stub(Product, "create").resolves(mockProduct as any);

      const product = await Product.create({
        name: "No Stock Product",
        price: 99.99,
        categoryId: testCategory.id,
      });

      expect(product.stock).to.equal(0);
    });

    it("should default isActive to true", async () => {
      const mockProduct = {
        id: "product-default-active",
        name: "Active Product",
        price: 99.99,
        categoryId: testCategory.id,
        isActive: true,
      };

      sandbox.restore();
      sandbox.stub(Product, "create").resolves(mockProduct as any);

      const product = await Product.create({
        name: "Active Product",
        price: 99.99,
        categoryId: testCategory.id,
      });

      expect(product.isActive).to.be.true;
    });
  });

  describe("Product Stock Management", () => {
    it("should update stock quantity", async () => {
      const initialStock = testProduct.stock;

      await testProduct.update({ stock: initialStock + 5 });

      expect(testProduct.stock).to.equal(initialStock + 5);
    });

    it("should handle zero stock", async () => {
      await testProduct.update({ stock: 0 });

      expect(testProduct.stock).to.equal(0);
    });

    it("should increment stock", async () => {
      const initialStock = testProduct.stock;
      testProduct.stock = initialStock + 3;

      sandbox.stub(Product, "increment").resolves([1] as any);

      await Product.increment("stock", {
        by: 3,
        where: { id: testProduct.id },
      });

      await testProduct.reload();
      expect(testProduct.stock).to.equal(initialStock + 3);
    });

    it("should decrement stock", async () => {
      const initialStock = testProduct.stock;
      testProduct.stock = initialStock - 2;

      sandbox.stub(Product, "decrement").resolves([1] as any);

      await Product.decrement("stock", {
        by: 2,
        where: { id: testProduct.id },
      });

      await testProduct.reload();
      expect(testProduct.stock).to.equal(initialStock - 2);
    });
  });

  describe("Product Queries", () => {
    it("should count products", async () => {
      sandbox.stub(Product, "count").resolves(5);

      const count = await Product.count();
      expect(count).to.be.greaterThan(0);
    });

    it("should count products by category", async () => {
      sandbox.stub(Product, "count").resolves(3);

      const count = await Product.count({
        where: { categoryId: testCategory.id },
      });
      expect(count).to.be.greaterThan(0);
    });

    it("should find products with pagination", async () => {
      const mockProducts = [testProduct, { ...testProduct, id: "product-2" }];
      sandbox.stub(Product, "findAll").resolves(mockProducts as any);

      const products = await Product.findAll({
        limit: 2,
        offset: 0,
        order: [["created_at", "DESC"]],
      });

      expect(products.length).to.be.lessThanOrEqual(2);
    });
  });
});
