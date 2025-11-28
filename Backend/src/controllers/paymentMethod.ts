import { Response } from "express";
import { validationResult } from "express-validator";
import { PaymentMethod } from "../models";
import { savePaymentMethodPayload } from "../validators/payment";
import StripeService from "../services/stripe";
import { StripeCustomerService } from "../services/stripeCustomer";
import { AuthRequest } from "../interfaces/auth";

export class PaymentMethodController {
  static async savePaymentMethod(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return (res as any).fail(
          "Validation failed",
          "VALIDATION_ERROR",
          errors.array(),
          400,
        );
      }

      const userId = req.user?.id;
      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const { stripePaymentMethodId, isDefault } =
        savePaymentMethodPayload(req);

      // Get or create Stripe customer using JWT data
      const stripeCustomerId =
        await StripeCustomerService.getOrCreateStripeCustomer(
          userId,
          undefined,
          req.user?.email,
          req.user?.profile,
        );

      // Get payment method details from Stripe
      const stripePaymentMethod = await StripeService.attachPaymentMethod(
        stripePaymentMethodId,
        stripeCustomerId,
      );

      const paymentMethod = await PaymentMethod.create({
        user_id: userId,
        stripe_payment_method_id: stripePaymentMethodId,
        stripe_customer_id: stripeCustomerId,
        type: stripePaymentMethod.type,
        brand: stripePaymentMethod.card?.brand as any,
        last4: stripePaymentMethod.card?.last4,
        expiry_month: stripePaymentMethod.card?.exp_month,
        expiry_year: stripePaymentMethod.card?.exp_year,
        is_default: isDefault,
      });

      return (res as any).success(
        "Payment method saved successfully",
        paymentMethod,
        201,
      );
    } catch (error: any) {
      return (res as any).fail(
        error.message,
        "PAYMENT_METHOD_ERROR",
        null,
        400,
      );
    }
  }

  static async getPaymentMethods(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const paymentMethods = await PaymentMethod.findAll({
        where: { user_id: userId },
        order: [
          ["is_default", "DESC"],
          ["created_at", "DESC"],
        ],
      });

      return (res as any).success(
        "Payment methods retrieved successfully",
        paymentMethods,
        200,
      );
    } catch (error: any) {
      return (res as any).fail(
        error.message,
        "PAYMENT_METHOD_ERROR",
        null,
        500,
      );
    }
  }

  static async deletePaymentMethod(req: AuthRequest, res: Response) {
    try {
      const { paymentMethodId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, user_id: userId },
      });

      if (!paymentMethod) {
        return (res as any).fail(
          "Payment method not found",
          "NOT_FOUND",
          null,
          404,
        );
      }

      await paymentMethod.destroy();
      return (res as any).success(
        "Payment method deleted successfully",
        null,
        200,
      );
    } catch (error: any) {
      return (res as any).fail(
        error.message,
        "PAYMENT_METHOD_ERROR",
        null,
        400,
      );
    }
  }
}
