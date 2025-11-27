export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartResponseDto {
  items: CartItemResponseDto[];
  total: number;
  itemCount: number;
}

export interface CartItemResponseDto {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image_url?: string;
  };
}
