import { Response } from "express";
import { handleValidationErrors } from "../utils/validation";
import { OrderService } from "../services/order";
import { OrderStatus } from "../enums/order";
import {
  createOrderPayload,
  updateOrderStatusPayload,
} from "../validators/order";
import { AuthRequest } from "../interfaces/auth";

export class OrderController {
  static async createOrder(req: AuthRequest, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const userId = req.user?.id;
      const userEmail = req.user?.email;
      const userProfile = req.user?.profile;
      const userAddresses = req.user?.addresses;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const { shippingAddress, paymentMethod } = createOrderPayload(req);

      // Use user data from JWT token for order creation
      const result = await OrderService.createOrderFromCart(
        userId,
        shippingAddress,
        paymentMethod,
        { email: userEmail, profile: userProfile, addresses: userAddresses },
      );

      return (res as any).success(
        "Order created successfully",
        {
          order: result.order,
          invoice: result.invoice,
          stripeCustomerId: result.stripeCustomerId,
          paymentIntent: {
            id: result.paymentIntent.id,
            client_secret: result.paymentIntent.client_secret,
          },
        },
        201,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "ORDER_ERROR", null, 400);
    }
  }

  static async getOrderHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const result = await OrderService.getOrderHistory(userId, page, limit);

      return (res as any).success(
        "Order history retrieved successfully",
        {
          orders: result.rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            totalOrders: result.count,
            hasNext: page * limit < result.count,
            hasPrev: page > 1,
          },
        },
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "ORDER_ERROR", null, 500);
    }
  }

  static async getOrderById(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const order = await OrderService.getOrderById(orderId, userId);

      if (!order) {
        return (res as any).fail("Order not found", "NOT_FOUND", null, 404);
      }

      return (res as any).success("Order retrieved successfully", order, 200);
    } catch (error: any) {
      return (res as any).fail(error.message, "ORDER_ERROR", null, 500);
    }
  }

  static async cancelOrder(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const order = await OrderService.cancelOrder(orderId, userId);
      return (res as any).success("Order cancelled successfully", order, 200);
    } catch (error: any) {
      return (res as any).fail(error.message, "ORDER_ERROR", null, 400);
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { orderId } = req.params;
      const { status } = updateOrderStatusPayload(req);
      const order = await OrderService.updateOrderStatus(orderId, status);
      return (res as any).success(
        "Order status updated successfully",
        order,
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "ORDER_ERROR", null, 400);
    }
  }
}
