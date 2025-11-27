import { Schema } from "express-validator";
import { Request } from "express";
import {
  CreateUserDto,
  CreateCustomerProfileDto,
  CreateAddressDto,
} from "../dtos/user";
import { UserRole } from "../enums/user";

export const createUserSchema: Schema = {
  email: {
    in: "body",
    isEmail: {
      errorMessage: "Invalid email format",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    in: "body",
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      errorMessage:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};

export const createCustomerProfileSchema: Schema = {
  full_name: {
    in: "body",
    optional: true,
    isString: {
      errorMessage: "Full name must be a string",
    },
  },
  phone: {
    in: "body",
    optional: true,
    isString: {
      errorMessage: "Phone must be a string",
    },
  },
  gender: {
    in: "body",
    optional: true,
    isString: {
      errorMessage: "Gender must be a string",
    },
  },
};

export const createAddressSchema: Schema = {
  full_name: {
    in: "body",
    isString: {
      errorMessage: "Full name must be a string",
    },
    notEmpty: {
      errorMessage: "Full name is required",
    },
  },
  phone: {
    in: "body",
    isString: {
      errorMessage: "Phone must be a string",
    },
    notEmpty: {
      errorMessage: "Phone is required",
    },
  },
  address_line1: {
    in: "body",
    isString: {
      errorMessage: "Address line 1 must be a string",
    },
    notEmpty: {
      errorMessage: "Address line 1 is required",
    },
  },
  city: {
    in: "body",
    isString: {
      errorMessage: "City must be a string",
    },
    notEmpty: {
      errorMessage: "City is required",
    },
  },
  state: {
    in: "body",
    isString: {
      errorMessage: "State must be a string",
    },
    notEmpty: {
      errorMessage: "State is required",
    },
  },
  pincode: {
    in: "body",
    isString: {
      errorMessage: "Pincode must be a string",
    },
    notEmpty: {
      errorMessage: "Pincode is required",
    },
  },
  country: {
    in: "body",
    isString: {
      errorMessage: "Country must be a string",
    },
    notEmpty: {
      errorMessage: "Country is required",
    },
  },
};

export const createAdminSchema: Schema = {
  email: {
    in: "body",
    isEmail: {
      errorMessage: "Invalid email format",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    in: "body",
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      errorMessage:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};

export const createUserPayload = (req: Request): CreateUserDto => {
  // Block role escalation attempts
  if (req.body.role && req.body.role === UserRole.ADMIN) {
    throw new Error("You are not allowed to set admin role");
  }

  return {
    email: req.body.email,
    password: req.body.password,
    role: UserRole.CUSTOMER, // Force customer role
  };
};

export const createAdminPayload = (req: Request): CreateUserDto => {
  return {
    email: req.body.email,
    password: req.body.password,
    role: UserRole.ADMIN,
  };
};

export const createCustomerProfilePayload = (
  req: Request,
): CreateCustomerProfileDto => {
  return {
    user_id: req.body.user_id,
    full_name: req.body.full_name,
    phone: req.body.phone,
    dob: req.body.dob ? new Date(req.body.dob) : undefined,
    gender: req.body.gender,
    profile_image_url: req.body.profile_image_url,
  };
};

export const updateUserSchema: Schema = {
  email: {
    in: "body",
    optional: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
  },
  password: {
    in: "body",
    optional: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
  },
  role: {
    in: "body",
    optional: true,
    isIn: {
      options: [[UserRole.ADMIN, UserRole.CUSTOMER]],
      errorMessage: "Role must be either admin or customer",
    },
  },
  is_active: {
    in: "body",
    optional: true,
    isBoolean: {
      errorMessage: "is_active must be a boolean",
    },
  },
};

export const loginSchema: Schema = {
  email: {
    in: "body",
    isEmail: {
      errorMessage: "Invalid email format",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    in: "body",
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};

export const createAddressPayload = (req: Request): CreateAddressDto => {
  return {
    user_id: req.body.user_id,
    full_name: req.body.full_name,
    phone: req.body.phone,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country,
    is_default: req.body.is_default || false,
  };
};
