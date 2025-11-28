import { expect } from "chai";
import { testDatabase as sequelize } from "../config";
import { User, Product, CartItem, Category } from "../models";
import { CartService } from "../services/cart";
import { UserRole } from "../enums/user";

describe("Cart Service", () => {
  let testUser: any;
  let testProduct: any;
  let testCategory: any;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create test user
    testUser = await User.create({
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRole.CUSTOMER,
      is_active: true,
    });

    // Create test category
    testCategory = await Category.create({
      name: "Test Category",
      description: "Test category description",
    });

    // Create test product
    testProduct = await Product.create({
      name: "Test Product",
      description: "Test product description",
      price: 100.0,
      stock: 10,
      categoryId: testCategory.id,
      image_url: "test-image.jpg",
    });
  });

  describe("addToCart", () => {
    it("should add product to cart successfully", async () => {
      const cartItem = await CartService.addToCart(
        testUser.id,
        testProduct.id,
        2,
      );

      expect(cartItem).to.exist;
      expect(cartItem.user_id).to.equal(testUser.id);
      expect(cartItem.product_id).to.equal(testProduct.id);
      expect(cartItem.quantity).to.equal(2);
      expect(cartItem.price_at_time).to.equal(100.0);
    });

    it("should update quantity if product already in cart", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);
      const updatedItem = await CartService.addToCart(
        testUser.id,
        testProduct.id,
        3,
      );

      expect(updatedItem.quantity).to.equal(5);
    });

    it("should throw error if product not found", async () => {
      try {
        await CartService.addToCart(testUser.id, "non-existent-id", 1);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.equal("Product not found");
      }
    });

    it("should throw error if insufficient stock", async () => {
      try {
        await CartService.addToCart(testUser.id, testProduct.id, 15);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.equal("Insufficient stock");
      }
    });
  });

  describe("getCart", () => {
    it("should return empty cart for new user", async () => {
      const cart = await CartService.getCart(testUser.id);
      expect(cart).to.be.an("array");
      expect(cart.length).to.equal(0);
    });

    it("should return cart items with product details", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);
      const cart = await CartService.getCart(testUser.id);

      expect(cart.length).to.equal(1);
      expect(cart[0].quantity).to.equal(2);
      expect(cart[0].product).to.exist;
      expect(cart[0].product.name).to.equal("Test Product");
    });
  });

  describe("updateCartItem", () => {
    it("should update cart item quantity", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);
      const updatedItem = await CartService.updateCartItem(
        testUser.id,
        testProduct.id,
        5,
      );

      expect(updatedItem.quantity).to.equal(5);
    });

    it("should throw error if cart item not found", async () => {
      try {
        await CartService.updateCartItem(testUser.id, testProduct.id, 5);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.equal("Cart item not found");
      }
    });

    it("should throw error if insufficient stock", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);

      try {
        await CartService.updateCartItem(testUser.id, testProduct.id, 15);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.equal("Insufficient stock");
      }
    });
  });

  describe("removeFromCart", () => {
    it("should remove item from cart", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);
      const result = await CartService.removeFromCart(
        testUser.id,
        testProduct.id,
      );

      expect(result).to.equal(1);

      const cart = await CartService.getCart(testUser.id);
      expect(cart.length).to.equal(0);
    });

    it("should throw error if cart item not found", async () => {
      try {
        await CartService.removeFromCart(testUser.id, testProduct.id);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.equal("Cart item not found");
      }
    });
  });

  describe("clearCart", () => {
    it("should clear all items from cart", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);
      const result = await CartService.clearCart(testUser.id);

      expect(result).to.be.greaterThan(0);

      const cart = await CartService.getCart(testUser.id);
      expect(cart.length).to.equal(0);
    });
  });

  describe("getCartTotal", () => {
    it("should calculate cart total correctly", async () => {
      await CartService.addToCart(testUser.id, testProduct.id, 2);
      const total = await CartService.getCartTotal(testUser.id);

      expect(total).to.equal(200.0);
    });

    it("should return 0 for empty cart", async () => {
      const total = await CartService.getCartTotal(testUser.id);
      expect(total).to.equal(0);
    });
  });
});
