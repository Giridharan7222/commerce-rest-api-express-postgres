import {
  CreateUserDto,
  CreateCustomerProfileDto,
  CreateAdminProfileDto,
  CreateAddressDto,
} from "../dtos/user";
import bcrypt from "bcrypt";
import { User, CustomerProfile, AdminProfile, Address } from "../models";

const SALT_ROUNDS = 10;

export async function createUser(dto: CreateUserDto) {
  const existingUser = await User.findOne({ where: { email: dto.email } });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await User.create({
    ...dto,
    password: hashedPassword,
  } as any);

  const { password, ...userWithoutPassword } = user.get({ plain: true });
  return userWithoutPassword;
}

export async function createAdmin(dto: CreateUserDto) {
  const existingUser = await User.findOne({ where: { email: dto.email } });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await User.create({
    ...dto,
    role: "admin", // Force admin role
    password: hashedPassword,
  } as any);

  const { password, ...userWithoutPassword } = user.get({ plain: true });
  return userWithoutPassword;
}

export async function createCustomerProfile(dto: CreateCustomerProfileDto) {
  const profile = await CustomerProfile.create(dto as any);
  return profile.get({ plain: true });
}

export async function createAdminProfile(dto: CreateAdminProfileDto) {
  const profile = await AdminProfile.create(dto as any);
  return profile.get({ plain: true });
}

export async function createAddress(dto: CreateAddressDto) {
  // If this is set as default, unset other default addresses for this user
  if (dto.is_default) {
    await Address.update(
      { is_default: false },
      { where: { user_id: dto.user_id, is_default: true } },
    );
  }

  const address = await Address.create(dto as any);
  return address.get({ plain: true });
}

export async function getUserWithProfile(userId: string) {
  const user = await User.findByPk(userId, {
    include: [
      { model: CustomerProfile, as: "customerProfile" },
      { model: AdminProfile, as: "adminProfile" },
      { model: Address, as: "addresses" },
    ],
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...userWithoutPassword } = user.get({ plain: true });
  return userWithoutPassword;
}

export async function getUserAddresses(userId: string) {
  const addresses = await Address.findAll({
    where: { user_id: userId },
    order: [
      ["is_default", "DESC"],
      ["created_at", "DESC"],
    ],
  });
  return addresses.map((addr: any) => addr.get({ plain: true }));
}

export async function getAllUsers() {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["created_at", "DESC"]],
  });
  return users.map((user: any) => user.get({ plain: true }));
}

export async function getUserById(userId: string) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.get({ plain: true });
}

export async function updateUser(userId: string, dto: Partial<CreateUserDto>) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (dto.password) {
    dto.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
  }

  await user.update(dto);
  const { password, ...userWithoutPassword } = user.get({ plain: true });
  return userWithoutPassword;
}

export async function deleteUser(userId: string) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.destroy();
  return { message: "User deleted successfully" };
}

export async function updateUserProfile(
  userId: string,
  dto: Partial<CreateCustomerProfileDto>,
) {
  const profile = await CustomerProfile.findOne({ where: { user_id: userId } });

  if (!profile) {
    throw new Error("Profile not found");
  }

  await profile.update(dto);
  return profile.get({ plain: true });
}

export async function updateAddress(
  addressId: string,
  dto: Partial<CreateAddressDto>,
) {
  const address = await Address.findByPk(addressId);

  if (!address) {
    throw new Error("Address not found");
  }

  if (dto.is_default) {
    await Address.update(
      { is_default: false },
      { where: { user_id: address.user_id, is_default: true } },
    );
  }

  await address.update(dto);
  return address.get({ plain: true });
}

export async function deleteAddress(addressId: string) {
  const address = await Address.findByPk(addressId);

  if (!address) {
    throw new Error("Address not found");
  }

  await address.destroy();
  return { message: "Address deleted successfully" };
}
