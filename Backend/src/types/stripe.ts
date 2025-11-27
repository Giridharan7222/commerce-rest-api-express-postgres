export interface CreateCustomerData {
  name: string;
  email: string;
}

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  customerId?: string;
  paymentMethodId?: string;
}

export interface CreateRefundData {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  status: string;
  amount: number;
  currency: string;
}
