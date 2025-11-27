import { UserRole } from "../enums/user";

export interface JwtProfilePayload {
  full_name: string;
  phone: string;
}

export interface JwtAddressPayload {
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  profile?: JwtProfilePayload | null;
  addresses?: JwtAddressPayload[];
  iat?: number;
  exp?: number;
}
