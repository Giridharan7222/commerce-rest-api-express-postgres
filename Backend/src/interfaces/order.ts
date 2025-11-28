import { OrderStatus, PaymentStatus } from "../enums/order";

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