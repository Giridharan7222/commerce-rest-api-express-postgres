export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  isActive?: boolean;
  productImages?: CreateProductImageDto[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  isActive?: boolean;
}

export interface CreateProductImageDto {
  productId: string;
  imageUrl: string;
  publicId?: string;
}

export interface UpdateProductImageDto {
  imageUrl?: string;
  publicId?: string;
}

export interface ProductFiltersDto {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ProductListResponseDto {
  products: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
