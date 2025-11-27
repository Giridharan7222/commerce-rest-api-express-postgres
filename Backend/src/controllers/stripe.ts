import { Request, Response } from 'express';
import StripeService from '../services/stripe';
import { CreateCustomerData, CreatePaymentIntentData } from '../types/stripe';

export class StripeController {
  // Create customer
  async createCustomer(req: Request, res: Response) {
    try {
      const { name, email }: CreateCustomerData = req.body;
      const customer = await StripeService.createCustomer(name, email);
      
      res.json({
        success: true,
        data: {
          customerId: customer.id,
          name: customer.name,
          email: customer.email
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create setup intent for saving cards
  async createSetupIntent(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const setupIntent = await StripeService.createSetupIntent(customerId);
      
      res.json({
        success: true,
        data: {
          client_secret: setupIntent.client_secret
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create payment intent
  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, currency, customerId, paymentMethodId }: CreatePaymentIntentData = req.body;
      const paymentIntent = await StripeService.createPaymentIntent(
        amount,
        currency,
        customerId,
        paymentMethodId
      );
      
      res.json({
        success: true,
        data: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get customer cards
  async getCustomerCards(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const cards = await StripeService.getCustomerCards(customerId);
      
      res.json({
        success: true,
        data: cards.data.map(card => ({
          id: card.id,
          brand: card.card?.brand,
          last4: card.card?.last4,
          exp_month: card.card?.exp_month,
          exp_year: card.card?.exp_year
        }))
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Handle webhooks
  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const event = StripeService.constructEvent(req.body, signature);
      
      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Update payment status in database
          console.log('Payment succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment
          console.log('Payment failed:', event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Webhook error'
      });
    }
  }
}