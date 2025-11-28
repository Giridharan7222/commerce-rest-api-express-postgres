import { expect } from "chai";
import { testDatabase as sequelize } from "../config";
import { User, Product, Category, Order, OrderItem, Invoice } from "../models";
import { UserRole } from "../enums/user";
import { OrderStatus, PaymentStatus } from "../enums/order";

describe("Order Model Tests", () => {
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

  describe("Order Model", () => {
    it("should create order successfully", async () => {
      const order = await Order.create({
        user_id: testUser.id,
        total_amount: 200.0,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        shipping_address: { street: "123 Test St", city: "Test City" },
      });

      expect(order).to.exist;
      expect(order.user_id).to.equal(testUser.id);
      expect(order.total_amount).to.equal(200.0);
      expect(order.status).to.equal(OrderStatus.PENDING);
      expect(order.payment_status).to.equal(PaymentStatus.PENDING);
    });

    it("should require shipping_address", async () => {
      try {
        await Order.create({
          user_id: testUser.id,
          total_amount: 200.0,
          status: OrderStatus.PENDING,
          payment_status: PaymentStatus.PENDING,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("shipping_address cannot be null");
      }
    });

    it("should update order status", async () => {
      const order = await Order.create({
        user_id: testUser.id,
        total_amount: 200.0,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        shipping_address: { street: "123 Test St", city: "Test City" },
      });

      await order.update({ status: OrderStatus.PROCESSING });
      expect(order.status).to.equal(OrderStatus.PROCESSING);
    });

    it("should update payment status", async () => {
      const order = await Order.create({
        user_id: testUser.id,
        total_amount: 200.0,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        shipping_address: { street: "123 Test St", city: "Test City" },
      });

      await order.update({ payment_status: PaymentStatus.PAID });
      expect(order.payment_status).to.equal(PaymentStatus.PAID);
    });
  });

  describe("OrderItem Model", () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        user_id: testUser.id,
        total_amount: 200.0,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        shipping_address: { street: "123 Test St", city: "Test City" },
      });
    });

    it("should create order item successfully", async () => {
      const orderItem = await OrderItem.create({
        order_id: testOrder.id,
        product_id: testProduct.id,
        quantity: 2,
        price_at_order_time: 100.0,
      });

      expect(orderItem).to.exist;
      expect(orderItem.order_id).to.equal(testOrder.id);
      expect(orderItem.product_id).to.equal(testProduct.id);
      expect(orderItem.quantity).to.equal(2);
      expect(orderItem.price_at_order_time).to.equal(100.0);
    });

    it("should require valid order_id", async () => {
      try {
        await OrderItem.create({
          order_id: "invalid-id",
          product_id: testProduct.id,
          quantity: 2,
          price_at_order_time: 100.0,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("SQLITE_CONSTRAINT");
      }
    });

    it("should require positive quantity", async () => {
      try {
        await OrderItem.create({
          order_id: testOrder.id,
          product_id: testProduct.id,
          quantity: 0,
          price_at_order_time: 100.0,
        });
        throw new Error("Expected validation error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("Validation error");
      }
    });
  });

  describe("Order Relationships", () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        user_id: testUser.id,
        total_amount: 200.0,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        shipping_address: { street: "123 Test St", city: "Test City" },
      });

      await OrderItem.create({
        order_id: testOrder.id,
        product_id: testProduct.id,
        quantity: 2,
        price_at_order_time: 100.0,
      });
    });

    it("should load order with items", async () => {
      const orderWithItems = await Order.findByPk(testOrder.id, {
        include: [OrderItem],
      });

      expect(orderWithItems).to.exist;
      expect(orderWithItems?.items).to.have.length(1);
      expect(orderWithItems?.items[0].quantity).to.equal(2);
    });

    it("should load order with user", async () => {
      const orderWithUser = await Order.findByPk(testOrder.id, {
        include: [User],
      });

      expect(orderWithUser).to.exist;
      expect(orderWithUser?.user).to.exist;
      expect(orderWithUser?.user.email).to.equal("test@example.com");
    });
  });

  describe("Order Queries", () => {
    beforeEach(async () => {
      // Create multiple orders
      await Order.create({
        user_id: testUser.id,
        total_amount: 100.0,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        shipping_address: { street: "123 Test St", city: "Test City" },
      });

      await Order.create({
        user_id: testUser.id,
        total_amount: 200.0,
        status: OrderStatus.DELIVERED,
        payment_status: PaymentStatus.PAID,
        shipping_address: { street: "456 Test Ave", city: "Test City" },
      });
    });

    it("should find orders by user", async () => {
      const orders = await Order.findAll({
        where: { user_id: testUser.id },
      });

      expect(orders).to.have.length(2);
    });

    it("should find orders by status", async () => {
      const pendingOrders = await Order.findAll({
        where: { status: OrderStatus.PENDING },
      });

      expect(pendingOrders).to.have.length(1);
      expect(pendingOrders[0].status).to.equal(OrderStatus.PENDING);
    });

    it("should find orders by payment status", async () => {
      const paidOrders = await Order.findAll({
        where: { payment_status: PaymentStatus.PAID },
      });

      expect(paidOrders).to.have.length(1);
      expect(paidOrders[0].payment_status).to.equal(PaymentStatus.PAID);
    });

    it("should count orders", async () => {
      const count = await Order.count({
        where: { user_id: testUser.id },
      });

      expect(count).to.equal(2);
    });
  });
});
