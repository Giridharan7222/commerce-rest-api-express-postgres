import { RefundStatus } from "../enums/payment";

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