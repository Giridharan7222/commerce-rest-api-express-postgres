import { OrderStatus, PaymentStatus } from "../enums/order";

export interface CreateOrderDto {
  shippingAddress: ShippingAddressDto;
  paymentMethod?: string;
}

export interface ShippingAddressDto {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderResponseDto {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  shipping_address: ShippingAddressDto;
  created_at: Date;
  updated_at: Date;
  items?: OrderItemResponseDto[];
}

export interface OrderItemResponseDto {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_order_time: number;
  product?: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
  };
}
