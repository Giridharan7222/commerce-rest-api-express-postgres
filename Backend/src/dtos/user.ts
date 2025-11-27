import { UserRole } from "../enums/user";

export interface UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateCustomerProfileDto {
  user_id: string;
  full_name?: string;
  phone?: string;
  dob?: Date;
  gender?: string;
  profile_image_url?: string;
}

export interface CreateAdminProfileDto {
  user_id: string;
  full_name: string;
  phone: string;
}

export interface CreateAddressDto {
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default?: boolean;
}
