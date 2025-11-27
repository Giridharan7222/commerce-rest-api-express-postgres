import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models";
import { LoginDto } from "../dtos/user";

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

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions,
  );

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

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions,
  );

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
