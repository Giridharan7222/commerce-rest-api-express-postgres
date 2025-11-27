import {
  Order,
  OrderItem,
  CartItem,
  Product,
  Invoice,
  InvoiceLineItem,
  PaymentTransaction,
} from "../models";
import { OrderStatus, PaymentStatus } from "../models/order";
import { InvoiceStatus } from "../models/invoice";
import { PaymentMethodType } from "../enums/payment";
import { CartService } from "./cart";
import { StripeCustomerService } from "./stripeCustomer";
import StripeService from "./stripe";
import sequelize from "../database/connection";
import { Transaction } from "sequelize";

export class OrderService {
  static async createOrderFromCart(
    userId: string,
    shippingAddress: object,
    paymentMethod?: string,
    userData?: { email?: string; profile?: any; addresses?: any[] },
  ) {
    return await sequelize.transaction(async (transaction: Transaction) => {
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: [{ model: Product, as: "product" }],
        transaction,
      });

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Validate stock availability
      for (const item of cartItems) {
        const product = await Product.findByPk(item.product_id, {
          transaction,
        });
        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product: ${product?.name || item.product_id}`,
          );
        }
      }

      const totalAmount = cartItems.reduce((total, item) => {
        return total + item.price_at_time * item.quantity;
      }, 0);

      const order = await Order.create(
        {
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
        },
        { transaction },
      );

      // Create order items from cart items
      const orderItems = await Promise.all(
        cartItems.map((item) =>
          OrderItem.create(
            {
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price_at_order_time: item.price_at_time,
            },
            { transaction },
          ),
        ),
      );

      // Update product stock
      await Promise.all(
        cartItems.map((item) =>
          Product.decrement("stock", {
            by: item.quantity,
            where: { id: item.product_id },
            transaction,
          }),
        ),
      );

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${order.id.slice(-6)}`;

      // Create invoice
      const invoice = await Invoice.create(
        {
          invoice_number: invoiceNumber,
          order_id: order.id,
          user_id: userId,
          sub_total: totalAmount,
          tax_amount: 0,
          discount_amount: 0,
          total_amount: totalAmount,
        },
        { transaction },
      );

      // Create invoice line items
      const invoiceLineItems = await Promise.all(
        cartItems.map((item) =>
          InvoiceLineItem.create(
            {
              invoice_id: invoice.id,
              product_id: item.product_id,
              product_name: (item as any).product?.name || "Unknown Product",
              quantity: item.quantity,
              price: item.price_at_time,
              total_price: item.price_at_time * item.quantity,
            },
            { transaction },
          ),
        ),
      );

      // Get or create Stripe customer using JWT user data
      const stripeCustomerId =
        await StripeCustomerService.getOrCreateStripeCustomer(
          userId,
          transaction,
          userData?.email,
          userData?.profile,
        );

      // Create Stripe payment intent
      const paymentIntent = await StripeService.createPaymentIntent(
        Math.round(totalAmount * 100), // Convert to cents
        "inr",
        stripeCustomerId,
      );

      // Create payment transaction
      const paymentTransaction = await PaymentTransaction.create(
        {
          order_id: order.id,
          invoice_id: invoice.id,
          user_id: userId,
          transaction_reference: paymentIntent.id,
          payment_method: PaymentMethodType.CREDIT_CARD,
          amount: totalAmount,
          payment_intent_id: paymentIntent.id,
          stripe_customer_id: stripeCustomerId,
        },
        { transaction },
      );

      // Clear cart
      await CartService.clearCart(userId, transaction);

      return {
        order,
        orderItems,
        invoice,
        invoiceLineItems,
        paymentTransaction,
        paymentIntent,
        stripeCustomerId,
      };
    });
  }

  static async getOrderHistory(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    return await Order.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "image_url"],
            },
          ],
        },
        {
          model: Invoice,
          as: "invoice",
          attributes: ["id", "invoice_number", "status", "total_amount"],
        },
        {
          model: PaymentTransaction,
          as: "transactions",
          attributes: ["id", "status", "payment_method", "amount"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
  }

  static async getOrderById(orderId: string, userId: string) {
    return await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "description", "image_url"],
            },
          ],
        },
      ],
    });
  }

  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    transaction?: Transaction,
  ) {
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error("Order not found");
    }

    return await order.update({ status }, { transaction });
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    transaction?: Transaction,
  ) {
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error("Order not found");
    }

    return await order.update(
      { payment_status: paymentStatus },
      { transaction },
    );
  }

  static async cancelOrder(orderId: string, userId: string) {
    return await sequelize.transaction(async (transaction: Transaction) => {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        include: [{ model: OrderItem, as: "items" }],
        transaction,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new Error("Order cannot be cancelled");
      }

      // Restore product stock
      if ((order as any).items) {
        await Promise.all(
          (order as any).items.map((item: any) =>
            Product.increment("stock", {
              by: item.quantity,
              where: { id: item.product_id },
              transaction,
            }),
          ),
        );
      }

      return await order.update(
        { status: OrderStatus.CANCELLED },
        { transaction },
      );
    });
  }
}
