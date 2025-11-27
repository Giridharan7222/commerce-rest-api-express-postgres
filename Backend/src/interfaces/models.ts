import { OrderStatus, PaymentStatus } from "../enums/order";
import {
  TransactionStatus,
  PaymentMethodType,
  PaymentMethodBrand,
  RefundStatus,
  InvoiceStatus,
} from "../enums/payment";

export interface CartItemAttributes {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderAttributes {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  shipping_address: object;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderItemAttributes {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_order_time: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface InvoiceAttributes {
  id: string;
  invoice_number: string;
  order_id: string;
  user_id: string;
  sub_total: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: InvoiceStatus;
  stripe_invoice_id?: string;
  issued_at: Date;
  paid_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface InvoiceLineItemAttributes {
  id: string;
  invoice_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  tax_rate: number;
  tax_amount: number;
  created_at?: Date;
  updated_at?: Date;
}

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

export interface RefundAttributes {
  id: string;
  order_id: string;
  invoice_id?: string;
  payment_transaction_id: string;
  stripe_refund_id?: string;
  refund_amount: number;
  refund_status: RefundStatus;
  reason?: string;
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
