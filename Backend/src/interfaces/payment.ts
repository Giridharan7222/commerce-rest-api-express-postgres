import {
  TransactionStatus,
  PaymentMethodType,
  PaymentMethodBrand,
} from "../enums/payment";

export interface PaymentTransactionAttributes {
  id: string;
  order_id: string;
  invoice_id?: string;
  user_id: string;
  transaction_reference?: string;
  payment_method: PaymentMethodType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  gateway_response?: object;
  payment_intent_id?: string;
  charge_id?: string;
  stripe_customer_id?: string;
  stripe_payment_method_id?: string;
  initiated_at?: Date;
  processed_at?: Date;
  paid_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentMethodAttributes {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  stripe_customer_id: string;
  type: string;
  brand?: PaymentMethodBrand;
  last4?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface StripeCustomerAttributes {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email: string;
  phone?: string;
  default_payment_method_id?: string;
  metadata?: object;
  created_at?: Date;
  updated_at?: Date;
}