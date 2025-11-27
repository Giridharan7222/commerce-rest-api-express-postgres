import Stripe from "stripe";

class StripeService {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: "2025-11-17.clover",
    });
  }

  // 1. Customer Handling
  async createCustomer(name: string, email: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      name,
      email,
    });
  }

  async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    return (await this.stripe.customers.retrieve(
      customerId,
    )) as Stripe.Customer;
  }

  // 2. Card Management
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    return await this.stripe.setupIntents.create({
      customer: customerId,
    });
  }

  async getCustomerCards(
    customerId: string,
  ): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return await this.stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
  }

  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async setDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<Stripe.Customer> {
    return await this.stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  // 3. Payment Handling
  async createPaymentIntent(
    amount: number,
    currency: string = "inr",
    customerId?: string,
    paymentMethodId?: string,
  ): Promise<Stripe.PaymentIntent> {
    const params: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    };

    if (customerId) params.customer = customerId;
    if (paymentMethodId) params.payment_method = paymentMethodId;

    return await this.stripe.paymentIntents.create(params);
  }

  async confirmPaymentIntent(
    intentId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.confirm(intentId, {
      payment_method: paymentMethodId,
    });
  }

  async retrievePaymentIntent(intentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(intentId);
  }

  // 4. Refund Handling
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<Stripe.Refund> {
    const params: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) params.amount = amount;
    if (reason) params.reason = reason as Stripe.RefundCreateParams.Reason;

    return await this.stripe.refunds.create(params);
  }

  async retrieveRefund(refundId: string): Promise<Stripe.Refund> {
    return await this.stripe.refunds.retrieve(refundId);
  }

  // 5. Invoice Handling (for Stripe Billing)
  async createInvoice(customerId: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.create({
      customer: customerId,
    });
  }

  async finalizeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.finalizeInvoice(invoiceId);
  }

  async payInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.pay(invoiceId);
  }

  // 6. Webhook Handling
  constructEvent(payload: string | Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }
}

export default new StripeService();
