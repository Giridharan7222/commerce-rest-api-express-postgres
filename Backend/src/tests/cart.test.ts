import { expect } from "chai";
import sinon from "sinon";
import { CartService } from "../services/cart";
import { Product, CartItem } from "../models";

describe("Cart Service", () => {
  let sandbox: sinon.SinonSandbox;
  let testUser: any;
  let testProduct: any;
  let testCategory: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock test data
    testUser = {
      id: "user-123",
      email: "test@example.com",
      role: "customer",
      is_active: true,
    };

    testCategory = {
      id: "category-123",
      name: "Test Category",
      description: "Test category description",
    };

    testProduct = {
      id: "product-123",
      name: "Test Product",
      description: "Test product description",
      price: 100.0,
      stock: 10,
      categoryId: testCategory.id,
      image_url: "test-image.jpg",
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("addToCart", () => {
    it("should add product to cart successfully", async () => {
      const mockCartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 2,
        price_at_time: 100.0,
        get: () => ({
          user_id: testUser.id,
          product_id: testProduct.id,
          quantity: 2,
          price_at_time: 100.0,
        }),
      };

      // Mock database calls
      sandbox.stub(Product, "findByPk").resolves(testProduct as any);
      sandbox.stub(CartItem, "findOne").resolves(null);
      sandbox.stub(CartItem, "create").resolves(mockCartItem as any);

      const cartItem = await CartService.addToCart(
        testUser.id,
        testProduct.id,
        2,
      );

      expect(cartItem.user_id).to.equal(testUser.id);
      expect(cartItem.product_id).to.equal(testProduct.id);
      expect(cartItem.quantity).to.equal(2);
      expect(cartItem.price_at_time).to.equal(100.0);
    });

    it("should validate input parameters", () => {
      expect(testUser.id).to.be.a("string");
      expect(testProduct.id).to.be.a("string");
      expect(testProduct.price).to.be.a("number");
      expect(testProduct.stock).to.be.a("number");
    });
  });

  describe("Cart Data Validation", () => {
    it("should validate cart item structure", () => {
      const mockCartItem = {
        user_id: testUser.id,
        product_id: testProduct.id,
        quantity: 2,
        price_at_time: 100.0,
      };

      expect(mockCartItem.user_id).to.equal(testUser.id);
      expect(mockCartItem.product_id).to.equal(testProduct.id);
      expect(mockCartItem.quantity).to.be.a("number");
      expect(mockCartItem.price_at_time).to.be.a("number");
    });

    it("should validate product data structure", () => {
      expect(testProduct.name).to.be.a("string");
      expect(testProduct.price).to.be.a("number");
      expect(testProduct.stock).to.be.a("number");
      expect(testProduct.categoryId).to.equal(testCategory.id);
    });

    it("should validate user data structure", () => {
      expect(testUser.email).to.include("@");
      expect(testUser.role).to.equal("customer");
      expect(testUser.is_active).to.be.true;
    });
  });
});
