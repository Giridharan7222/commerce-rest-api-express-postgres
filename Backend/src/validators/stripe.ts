import { Schema } from "express-validator";
import { Request } from "express";

export const createCustomerSchema: Schema = {
  name: {
    in: "body",
    isString: {
      errorMessage: "Name must be a string",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  email: {
    in: "body",
    isEmail: {
      errorMessage: "Valid email is required",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
};

export const createSetupIntentSchema: Schema = {
  customerId: {
    in: "body",
    isString: {
      errorMessage: "Customer ID must be a string",
    },
    notEmpty: {
      errorMessage: "Customer ID is required",
    },
  },
};

export const createCustomerPayload = (req: Request) => ({
  name: req.body.name,
  email: req.body.email,
});

export const createSetupIntentPayload = (req: Request) => ({
  customerId: req.body.customerId,
});
