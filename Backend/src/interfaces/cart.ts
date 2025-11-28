export interface CartItemAttributes {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at?: Date;
  updated_at?: Date;
}