import { Request, Response } from "express";
import { validationResult } from "express-validator";
import StripeService from "../services/stripe";
import { PaymentService } from "../services/payment";
import { StripeCustomerService } from "../services/stripeCustomer";
import { CreateCustomerData, CreatePaymentIntentData } from "../types/stripe";
import {
  createCustomerPayload,
  createSetupIntentPayload,
} from "../validators/stripe";
import {
  processPaymentPayload,
  createPaymentIntentPayload,
} from "../validators/payment";
import { UserRole } from "../enums/user";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    profile?: any;
    addresses?: any[];
  };
}

export class StripeController {
  // Create customer
  async createCustomer(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;
      const userProfile = req.user?.profile;

      if (!userId || !userEmail) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      // Get or create Stripe customer using JWT data
      const stripeCustomerId =
        await StripeCustomerService.getOrCreateStripeCustomer(
          userId,
          undefined,
          userEmail,
          userProfile,
        );

      const customer = await StripeService.retrieveCustomer(stripeCustomerId);

      return (res as any).success(
        "Stripe customer retrieved successfully",
        {
          customerId: customer.id,
          name: customer.name,
          email: customer.email,
        },
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "STRIPE_ERROR", null, 400);
    }
  }

  // Create setup intent for saving cards
  async createSetupIntent(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;
      const userProfile = req.user?.profile;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      // Get or create Stripe customer using JWT data
      const stripeCustomerId =
        await StripeCustomerService.getOrCreateStripeCustomer(
          userId,
          undefined,
          userEmail,
          userProfile,
        );

      const setupIntent =
        await StripeService.createSetupIntent(stripeCustomerId);

      return (res as any).success(
        "Setup intent created successfully",
        {
          client_secret: setupIntent.client_secret,
          customer_id: stripeCustomerId,
        },
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "STRIPE_ERROR", null, 400);
    }
  }

  // Create payment intent
  async createPaymentIntent(req: AuthRequest, res: Response) {
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
      const userEmail = req.user?.email;
      const userProfile = req.user?.profile;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const { amount, currency, paymentMethodId } =
        createPaymentIntentPayload(req);

      // Get or create Stripe customer using JWT data
      const stripeCustomerId =
        await StripeCustomerService.getOrCreateStripeCustomer(
          userId,
          undefined,
          userEmail,
          userProfile,
        );

      const paymentIntent = await StripeService.createPaymentIntent(
        amount,
        currency,
        stripeCustomerId,
        paymentMethodId,
      );

      return (res as any).success(
        "Payment intent created successfully",
        {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status,
          customer_id: stripeCustomerId,
        },
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "STRIPE_ERROR", null, 400);
    }
  }

  // Get customer cards
  async getCustomerCards(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const cards = await StripeService.getCustomerCards(customerId);

      res.json({
        success: true,
        data: cards.data.map((card) => ({
          id: card.id,
          brand: card.card?.brand,
          last4: card.card?.last4,
          exp_month: card.card?.exp_month,
          exp_year: card.card?.exp_year,
        })),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Process payment
  async processPayment(req: AuthRequest, res: Response) {
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

      const { paymentIntentId, paymentMethodId } = processPaymentPayload(req);
      const result = await PaymentService.processPayment(
        paymentIntentId,
        paymentMethodId,
      );

      return (res as any).success(
        "Payment processed successfully",
        result.paymentIntent,
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "PAYMENT_ERROR", null, 400);
    }
  }

  // Handle webhooks
  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers["stripe-signature"] as string;
      const event = StripeService.constructEvent(req.body, signature);

      await PaymentService.handleWebhookEvent(event);
      res.json({ received: true });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Webhook error",
      });
    }
  }
}
