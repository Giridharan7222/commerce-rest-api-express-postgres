export interface CustomerProfileResponseDto {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  dob?: Date;
  gender?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdminProfileResponseDto {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}

export interface AddressResponseDto {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}
