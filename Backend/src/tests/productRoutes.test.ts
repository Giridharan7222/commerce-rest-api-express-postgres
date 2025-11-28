import { expect } from "chai";
import { testDatabase as sequelize } from "../config";
import { User, Product, Category, ProductImage } from "../models";
import { UserRole } from "../enums/user";

describe("Product Routes Tests", () => {
  let testUser: any;
  let adminUser: any;
  let testCategory: any;
  let testProduct: any;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create test users
    testUser = await User.create({
      email: "user@example.com",
      password: "hashedpassword",
      role: UserRole.CUSTOMER,
      is_active: true,
    });

    adminUser = await User.create({
      email: "admin@example.com",
      password: "hashedpassword",
      role: UserRole.ADMIN,
      is_active: true,
    });

    // Create test category
    testCategory = await Category.create({
      name: "Electronics",
      description: "Electronic devices",
    });

    // Create test product
    testProduct = await Product.create({
      name: "Test Product",
      description: "Test product description",
      price: 99.99,
      stock: 10,
      categoryId: testCategory.id,
      image_url: "test-image.jpg",
      isActive: true,
    });
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

      const product = await Product.create(productData);

      expect(product).to.exist;
      expect(product.name).to.equal("New Product");
      expect(product.price).to.equal(149.99);
      expect(product.stock).to.equal(5);
      expect(product.categoryId).to.equal(testCategory.id);
    });

    it("should require valid categoryId", async () => {
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
      await testProduct.destroy();

      const deletedProduct = await Product.findByPk(testProduct.id);
      expect(deletedProduct).to.be.null;
    });
  });

  describe("Product Filtering and Search", () => {
    beforeEach(async () => {
      // Create additional products for filtering tests
      await Product.create({
        name: "Laptop",
        description: "Gaming laptop",
        price: 1299.99,
        stock: 3,
        categoryId: testCategory.id,
        isActive: true,
      });

      await Product.create({
        name: "Mouse",
        description: "Wireless mouse",
        price: 29.99,
        stock: 20,
        categoryId: testCategory.id,
        isActive: false, // Inactive product
      });
    });

    it("should find products by category", async () => {
      const products = await Product.findAll({
        where: { categoryId: testCategory.id },
      });

      expect(products.length).to.be.greaterThan(1);
    });

    it("should find active products only", async () => {
      const activeProducts = await Product.findAll({
        where: { isActive: true },
      });

      expect(activeProducts).to.have.length(2); // testProduct + Laptop
      activeProducts.forEach((product) => {
        expect(product.isActive).to.be.true;
      });
    });

    it("should find products by price range", async () => {
      const affordableProducts = await Product.findAll({
        where: {
          price: { [require("sequelize").Op.lte]: 100 },
        },
      });

      expect(affordableProducts).to.have.length(2); // testProduct + Mouse
    });

    it("should search products by name", async () => {
      const laptopProducts = await Product.findAll({
        where: {
          name: { [require("sequelize").Op.like]: "%Laptop%" },
        },
      });

      expect(laptopProducts).to.have.length(1);
      expect(laptopProducts[0].name).to.equal("Laptop");
    });
  });

  describe("Product Images", () => {
    let testProductImage: any;

    beforeEach(async () => {
      testProductImage = await ProductImage.create({
        productId: testProduct.id,
        imageUrl: "https://example.com/image1.jpg",
        publicId: "products/image1",
      });
    });

    it("should create product image", async () => {
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
      await testProductImage.destroy();

      const deletedImage = await ProductImage.findByPk(testProductImage.id);
      expect(deletedImage).to.be.null;
    });

    it("should require valid productId", async () => {
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
      const productWithCategory = await Product.findByPk(testProduct.id, {
        include: [Category],
      });

      expect(productWithCategory).to.exist;
      expect(productWithCategory?.category).to.exist;
      expect(productWithCategory?.category.name).to.equal("Electronics");
    });

    it("should load product with images", async () => {
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
      const categoryWithProducts = await Category.findByPk(testCategory.id, {
        include: [Product],
      });

      expect(categoryWithProducts).to.exist;
      expect(categoryWithProducts?.products).to.have.length.greaterThan(0);
    });
  });

  describe("Product Validation", () => {
    it("should require name", async () => {
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
      const product = await Product.create({
        name: "No Stock Product",
        price: 99.99,
        categoryId: testCategory.id,
      });

      expect(product.stock).to.equal(0);
    });

    it("should default isActive to true", async () => {
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

      await Product.increment("stock", {
        by: 3,
        where: { id: testProduct.id },
      });

      await testProduct.reload();
      expect(testProduct.stock).to.equal(initialStock + 3);
    });

    it("should decrement stock", async () => {
      const initialStock = testProduct.stock;

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
      const count = await Product.count();
      expect(count).to.be.greaterThan(0);
    });

    it("should count products by category", async () => {
      const count = await Product.count({
        where: { categoryId: testCategory.id },
      });
      expect(count).to.be.greaterThan(0);
    });

    it("should find products with pagination", async () => {
      const products = await Product.findAll({
        limit: 2,
        offset: 0,
        order: [["created_at", "DESC"]],
      });

      expect(products.length).to.be.lessThanOrEqual(2);
    });
  });
});
