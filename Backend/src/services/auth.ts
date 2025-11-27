import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User, CustomerProfile, AdminProfile, Address } from "../models";
import { LoginDto } from "../dtos/user";
import { UserRole } from "../enums/user";
import {
  JwtPayload,
  JwtProfilePayload,
  JwtAddressPayload,
} from "../interfaces/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export async function loginUser(dto: LoginDto) {
  const user = await User.findOne({ where: { email: dto.email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Account is deactivated");
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Fetch profile based on role
  let profileData = null;
  if (user.role === UserRole.CUSTOMER) {
    const profile = await CustomerProfile.findOne({
      where: { user_id: user.id },
    });
    if (profile) {
      profileData = {
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      };
    }
  } else if (user.role === UserRole.ADMIN) {
    const profile = await AdminProfile.findOne({ where: { user_id: user.id } });
    if (profile) {
      profileData = {
        full_name: profile.full_name,
        phone: profile.phone,
      };
    }
  }

  // Fetch addresses
  const addresses = await Address.findAll({ where: { user_id: user.id } });
  const addressesData: JwtAddressPayload[] = addresses.map((addr) => ({
    phone: addr.phone,
    address_line1: addr.address_line1,
    address_line2: addr.address_line2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    country: addr.country,
    is_default: addr.is_default,
  }));

  const tokenPayload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    profile: profileData,
    addresses: addressesData,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

  const { password, ...userWithoutPassword } = user.get({ plain: true });

  return {
    user: userWithoutPassword,
    token,
  };
}

export async function refreshToken(userId: string) {
  const user = await User.findByPk(userId);

  if (!user || !user.is_active) {
    throw new Error("User not found or inactive");
  }

  // Fetch profile based on role
  let profileData = null;
  if (user.role === UserRole.CUSTOMER) {
    const profile = await CustomerProfile.findOne({
      where: { user_id: user.id },
    });
    if (profile) {
      profileData = {
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      };
    }
  } else if (user.role === UserRole.ADMIN) {
    const profile = await AdminProfile.findOne({ where: { user_id: user.id } });
    if (profile) {
      profileData = {
        full_name: profile.full_name,
        phone: profile.phone,
      };
    }
  }

  // Fetch addresses
  const addresses = await Address.findAll({ where: { user_id: user.id } });
  const addressesData: JwtAddressPayload[] = addresses.map((addr) => ({
    phone: addr.phone,
    address_line1: addr.address_line1,
    address_line2: addr.address_line2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    country: addr.country,
    is_default: addr.is_default,
  }));

  const tokenPayload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    profile: profileData,
    addresses: addressesData,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

  const { password, ...userWithoutPassword } = user.get({ plain: true });

  return {
    user: userWithoutPassword,
    token,
  };
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      throw new Error("Invalid user");
    }

    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
