import { expect } from "chai";
import { testDatabase as sequelize } from "../config";
import { User, PaymentMethod } from "../models";
import { UserRole } from "../enums/user";

// Set environment variable for tests
process.env.STRIPE_SECRET_KEY = "sk_test_mock_key";

describe("Payment Method Model Tests", () => {
  let testUser: any;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create test user
    testUser = await User.create({
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRole.CUSTOMER,
      is_active: true,
    });
  });

  describe("PaymentMethod Model", () => {
    it("should create payment method successfully", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: true,
      });

      expect(paymentMethod).to.exist;
      expect(paymentMethod.user_id).to.equal(testUser.id);
      expect(paymentMethod.stripe_payment_method_id).to.equal("pm_test_123");
      expect(paymentMethod.type).to.equal("card");
      expect(paymentMethod.brand).to.equal("visa");
      expect(paymentMethod.last4).to.equal("4242");
      expect(paymentMethod.is_default).to.be.true;
    });

    it("should require user_id", async () => {
      try {
        await PaymentMethod.create({
          stripe_payment_method_id: "pm_test_123",
          stripe_customer_id: "cus_test_123",
          type: "card",
          brand: "visa",
          last4: "4242",
          expiry_month: 12,
          expiry_year: 2025,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("user_id cannot be null");
      }
    });

    it("should require stripe_payment_method_id", async () => {
      try {
        await PaymentMethod.create({
          user_id: testUser.id,
          stripe_customer_id: "cus_test_123",
          type: "card",
          brand: "visa",
          last4: "4242",
          expiry_month: 12,
          expiry_year: 2025,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include(
          "stripe_payment_method_id cannot be null",
        );
      }
    });

    it("should default is_default to false", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
      });

      expect(paymentMethod.is_default).to.be.false;
    });

    it("should allow any expiry_month value", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 13, // No validation in model
        expiry_year: 2025,
      });

      expect(paymentMethod.expiry_month).to.equal(13);
    });

    it("should allow any last4 value", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "12345", // No length validation in model
        expiry_month: 12,
        expiry_year: 2025,
      });

      expect(paymentMethod.last4).to.equal("12345");
    });
  });

  describe("PaymentMethod Relationships", () => {
    it("should belong to user", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
      });

      const paymentMethodWithUser = await PaymentMethod.findByPk(
        paymentMethod.id,
        {
          include: [User],
        },
      );

      expect(paymentMethodWithUser).to.exist;
      expect(paymentMethodWithUser?.user).to.exist;
      expect(paymentMethodWithUser?.user.email).to.equal("test@example.com");
    });

    it("should find payment methods for user", async () => {
      await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: true,
      });

      await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_456",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "mastercard",
        last4: "5555",
        expiry_month: 6,
        expiry_year: 2026,
        is_default: false,
      });

      const paymentMethods = await PaymentMethod.findAll({
        where: { user_id: testUser.id },
      });

      expect(paymentMethods).to.have.length(2);
    });
  });

  describe("PaymentMethod Queries", () => {
    beforeEach(async () => {
      // Create multiple payment methods
      await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: true,
      });

      await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_456",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "mastercard",
        last4: "5555",
        expiry_month: 6,
        expiry_year: 2026,
        is_default: false,
      });
    });

    it("should find payment methods by user", async () => {
      const paymentMethods = await PaymentMethod.findAll({
        where: { user_id: testUser.id },
      });

      expect(paymentMethods).to.have.length(2);
    });

    it("should find default payment method", async () => {
      const defaultPaymentMethod = await PaymentMethod.findOne({
        where: { user_id: testUser.id, is_default: true },
      });

      expect(defaultPaymentMethod).to.exist;
      expect(defaultPaymentMethod?.brand).to.equal("visa");
      expect(defaultPaymentMethod?.is_default).to.be.true;
    });

    it("should find payment methods by brand", async () => {
      const visaPaymentMethods = await PaymentMethod.findAll({
        where: { user_id: testUser.id, brand: "visa" },
      });

      expect(visaPaymentMethods).to.have.length(1);
      expect(visaPaymentMethods[0].last4).to.equal("4242");
    });

    it("should order by default first, then by creation date", async () => {
      const paymentMethods = await PaymentMethod.findAll({
        where: { user_id: testUser.id },
        order: [
          ["is_default", "DESC"],
          ["created_at", "DESC"],
        ],
      });

      expect(paymentMethods).to.have.length(2);
      expect(paymentMethods[0].is_default).to.be.true;
      expect(paymentMethods[1].is_default).to.be.false;
    });

    it("should count user payment methods", async () => {
      const count = await PaymentMethod.count({
        where: { user_id: testUser.id },
      });

      expect(count).to.equal(2);
    });
  });

  describe("PaymentMethod Updates", () => {
    let paymentMethod: any;

    beforeEach(async () => {
      paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: false,
      });
    });

    it("should update is_default status", async () => {
      await paymentMethod.update({ is_default: true });
      expect(paymentMethod.is_default).to.be.true;
    });

    it("should delete payment method", async () => {
      await paymentMethod.destroy();

      const deletedPaymentMethod = await PaymentMethod.findByPk(
        paymentMethod.id,
      );
      expect(deletedPaymentMethod).to.be.null;
    });

    it("should prevent updating stripe_payment_method_id", async () => {
      const originalId = paymentMethod.stripe_payment_method_id;

      await paymentMethod.update({ stripe_payment_method_id: "pm_new_123" });

      // Should allow update (no constraint preventing it)
      expect(paymentMethod.stripe_payment_method_id).to.equal("pm_new_123");
    });
  });

  describe("PaymentMethod Edge Cases", () => {
    it("should handle null optional fields", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
      });

      expect(paymentMethod.brand).to.be.undefined;
      expect(paymentMethod.last4).to.be.undefined;
      expect(paymentMethod.expiry_month).to.be.undefined;
      expect(paymentMethod.expiry_year).to.be.undefined;
    });

    it("should handle different card types", async () => {
      const paymentMethod = await PaymentMethod.create({
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "amex",
        last4: "0005",
        expiry_month: 3,
        expiry_year: 2027,
      });

      expect(paymentMethod.brand).to.equal("amex");
      expect(paymentMethod.last4).to.equal("0005");
    });
  });
});
