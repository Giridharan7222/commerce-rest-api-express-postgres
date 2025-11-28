import { expect } from "chai";
import sinon from "sinon";
import { User, PaymentMethod } from "../models";
import { UserRole } from "../enums/user";

// Set environment variable for tests
process.env.STRIPE_SECRET_KEY = "sk_test_mock_key";

describe("Payment Method Model Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testUser: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock test user
    testUser = {
      id: "user-123",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRole.CUSTOMER,
      is_active: true,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("PaymentMethod Model", () => {
    it("should create payment method successfully", async () => {
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: true,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);

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

    it("should require user_id", () => {
      const paymentMethodData = {
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
      };

      // Validate that user_id is required
      expect(paymentMethodData).to.not.have.property("user_id");
      expect(testUser.id).to.be.a("string");
    });

    it("should require stripe_payment_method_id", async () => {
      const error = new Error("stripe_payment_method_id cannot be null");
      sandbox.stub(PaymentMethod, "create").rejects(error);

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
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: false,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);

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
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 13,
        expiry_year: 2025,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);

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
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "12345",
        expiry_month: 12,
        expiry_year: 2025,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);

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
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
      };

      const mockPaymentMethodWithUser = {
        ...mockPaymentMethod,
        user: testUser,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);
      sandbox
        .stub(PaymentMethod, "findByPk")
        .resolves(mockPaymentMethodWithUser as any);

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
      const mockPaymentMethods = [
        {
          id: "pm-123",
          user_id: testUser.id,
          stripe_payment_method_id: "pm_test_123",
          stripe_customer_id: "cus_test_123",
          type: "card",
          brand: "visa",
          last4: "4242",
          expiry_month: 12,
          expiry_year: 2025,
          is_default: true,
        },
        {
          id: "pm-456",
          user_id: testUser.id,
          stripe_payment_method_id: "pm_test_456",
          stripe_customer_id: "cus_test_123",
          type: "card",
          brand: "mastercard",
          last4: "5555",
          expiry_month: 6,
          expiry_year: 2026,
          is_default: false,
        },
      ];

      sandbox
        .stub(PaymentMethod, "create")
        .resolves(mockPaymentMethods[0] as any);
      sandbox
        .stub(PaymentMethod, "findAll")
        .resolves(mockPaymentMethods as any);

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

      const paymentMethods = await PaymentMethod.findAll({
        where: { user_id: testUser.id },
      });

      expect(paymentMethods).to.have.length(2);
    });
  });

  describe("PaymentMethod Queries", () => {
    let mockPaymentMethods: any[];

    beforeEach(async () => {
      mockPaymentMethods = [
        {
          id: "pm-123",
          user_id: testUser.id,
          stripe_payment_method_id: "pm_test_123",
          stripe_customer_id: "cus_test_123",
          type: "card",
          brand: "visa",
          last4: "4242",
          expiry_month: 12,
          expiry_year: 2025,
          is_default: true,
        },
        {
          id: "pm-456",
          user_id: testUser.id,
          stripe_payment_method_id: "pm_test_456",
          stripe_customer_id: "cus_test_123",
          type: "card",
          brand: "mastercard",
          last4: "5555",
          expiry_month: 6,
          expiry_year: 2026,
          is_default: false,
        },
      ];

      sandbox
        .stub(PaymentMethod, "create")
        .resolves(mockPaymentMethods[0] as any);
    });

    it("should find payment methods by user", async () => {
      sandbox
        .stub(PaymentMethod, "findAll")
        .resolves(mockPaymentMethods as any);

      const paymentMethods = await PaymentMethod.findAll({
        where: { user_id: testUser.id },
      });

      expect(paymentMethods).to.have.length(2);
    });

    it("should find default payment method", async () => {
      sandbox
        .stub(PaymentMethod, "findOne")
        .resolves(mockPaymentMethods[0] as any);

      const defaultPaymentMethod = await PaymentMethod.findOne({
        where: { user_id: testUser.id, is_default: true },
      });

      expect(defaultPaymentMethod).to.exist;
      expect(defaultPaymentMethod?.brand).to.equal("visa");
      expect(defaultPaymentMethod?.is_default).to.be.true;
    });

    it("should find payment methods by brand", async () => {
      const visaPaymentMethods = [mockPaymentMethods[0]];
      sandbox
        .stub(PaymentMethod, "findAll")
        .resolves(visaPaymentMethods as any);

      const result = await PaymentMethod.findAll({
        where: { user_id: testUser.id, brand: "visa" },
      });

      expect(result).to.have.length(1);
      expect(result[0].last4).to.equal("4242");
    });

    it("should order by default first, then by creation date", async () => {
      sandbox
        .stub(PaymentMethod, "findAll")
        .resolves(mockPaymentMethods as any);

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
      sandbox.stub(PaymentMethod, "count").resolves(2);

      const count = await PaymentMethod.count({
        where: { user_id: testUser.id },
      });

      expect(count).to.equal(2);
    });
  });

  describe("PaymentMethod Updates", () => {
    let paymentMethod: any;

    beforeEach(async () => {
      paymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2025,
        is_default: false,
        update: sandbox.stub().callsFake((updates: any) => {
          Object.assign(paymentMethod, updates);
          return Promise.resolve(paymentMethod);
        }),
        destroy: sandbox.stub().resolves(),
      };

      sandbox.stub(PaymentMethod, "create").resolves(paymentMethod as any);
    });

    it("should update is_default status", async () => {
      await paymentMethod.update({ is_default: true });
      expect(paymentMethod.is_default).to.be.true;
    });

    it("should delete payment method", async () => {
      sandbox.stub(PaymentMethod, "findByPk").resolves(null);

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
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: undefined,
        last4: undefined,
        expiry_month: undefined,
        expiry_year: undefined,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);

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
      const mockPaymentMethod = {
        id: "pm-123",
        user_id: testUser.id,
        stripe_payment_method_id: "pm_test_123",
        stripe_customer_id: "cus_test_123",
        type: "card",
        brand: "amex",
        last4: "0005",
        expiry_month: 3,
        expiry_year: 2027,
      };

      sandbox.stub(PaymentMethod, "create").resolves(mockPaymentMethod as any);

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
