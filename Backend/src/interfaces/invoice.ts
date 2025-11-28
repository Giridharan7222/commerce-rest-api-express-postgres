import { InvoiceStatus } from "../enums/payment";

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
