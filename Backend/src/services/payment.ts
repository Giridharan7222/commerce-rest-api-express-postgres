import { PaymentTransaction, Invoice, Order } from "../models";
import { TransactionStatus } from "../enums/payment";
import { PaymentStatus } from "../enums/order";
import { InvoiceStatus } from "../enums/payment";
import StripeService from "./stripe";
import sequelize from "../database/connection";
import { Transaction } from "sequelize";

export class PaymentService {
  static async processPayment(
    paymentIntentId: string,
    paymentMethodId: string,
  ) {
    return await sequelize.transaction(async (transaction: Transaction) => {
      const paymentTransaction = await PaymentTransaction.findOne({
        where: { payment_intent_id: paymentIntentId },
        include: [
          { model: Order, as: "order" },
          { model: Invoice, as: "invoice" },
        ],
        transaction,
      });

      if (!paymentTransaction) {
        throw new Error("Payment transaction not found");
      }

      try {
        // Confirm payment with Stripe
        const paymentIntent = await StripeService.confirmPaymentIntent(
          paymentIntentId,
          paymentMethodId,
        );

        if (paymentIntent.status === "succeeded") {
          // Update payment transaction
          await paymentTransaction.update(
            {
              status: TransactionStatus.SUCCESSFUL,
              gateway_response: paymentIntent,
              paid_at: new Date(),
            },
            { transaction },
          );

          // Update order payment status
          if ((paymentTransaction as any).order) {
            await (paymentTransaction as any).order.update(
              {
                payment_status: PaymentStatus.PAID,
              },
              { transaction },
            );
          }

          // Update invoice status
          if ((paymentTransaction as any).invoice) {
            await (paymentTransaction as any).invoice.update(
              {
                status: InvoiceStatus.PAID,
                paid_at: new Date(),
              },
              { transaction },
            );
          }

          return { success: true, paymentIntent };
        } else {
          await paymentTransaction.update(
            {
              status: TransactionStatus.FAILED,
              gateway_response: paymentIntent,
            },
            { transaction },
          );

          return { success: false, error: "Payment failed" };
        }
      } catch (error: any) {
        await paymentTransaction.update(
          {
            status: TransactionStatus.FAILED,
            gateway_response: { error: error.message },
          },
          { transaction },
        );

        throw error;
      }
    });
  }

  static async handleWebhookEvent(event: any) {
    return await sequelize.transaction(async (transaction: Transaction) => {
      const paymentIntent = event.data.object;

      const paymentTransaction = await PaymentTransaction.findOne({
        where: { payment_intent_id: paymentIntent.id },
        include: [
          { model: Order, as: "order" },
          { model: Invoice, as: "invoice" },
        ],
        transaction,
      });

      if (!paymentTransaction) return;

      switch (event.type) {
        case "payment_intent.succeeded":
          await paymentTransaction.update(
            {
              status: TransactionStatus.SUCCESSFUL,
              gateway_response: paymentIntent,
              paid_at: new Date(),
            },
            { transaction },
          );

          if ((paymentTransaction as any).order) {
            await (paymentTransaction as any).order.update(
              {
                payment_status: PaymentStatus.PAID,
              },
              { transaction },
            );
          }

          if ((paymentTransaction as any).invoice) {
            await (paymentTransaction as any).invoice.update(
              {
                status: InvoiceStatus.PAID,
                paid_at: new Date(),
              },
              { transaction },
            );
          }
          break;

        case "payment_intent.payment_failed":
          await paymentTransaction.update(
            {
              status: TransactionStatus.FAILED,
              gateway_response: paymentIntent,
            },
            { transaction },
          );
          break;
      }
    });
  }
}
