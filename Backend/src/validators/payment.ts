import { Schema } from "express-validator";
import { Request } from "express";

export const processPaymentSchema: Schema = {
  paymentIntentId: {
    in: "body",
    isString: {
      errorMessage: "Payment intent ID must be a string",
    },
    notEmpty: {
      errorMessage: "Payment intent ID is required",
    },
  },
  paymentMethodId: {
    in: "body",
    isString: {
      errorMessage: "Payment method ID must be a string",
    },
    notEmpty: {
      errorMessage: "Payment method ID is required",
    },
  },
};

export const createPaymentIntentSchema: Schema = {
  amount: {
    in: "body",
    isNumeric: {
      errorMessage: "Amount must be a number",
    },
    notEmpty: {
      errorMessage: "Amount is required",
    },
  },
  currency: {
    in: "body",
    optional: true,
    isString: {
      errorMessage: "Currency must be a string",
    },
  },
  paymentMethodId: {
    in: "body",
    optional: true,
    isString: {
      errorMessage: "Payment method ID must be a string",
    },
  },
};

export const savePaymentMethodSchema: Schema = {
  stripePaymentMethodId: {
    in: "body",
    isString: {
      errorMessage: "Stripe payment method ID must be a string",
    },
    notEmpty: {
      errorMessage: "Stripe payment method ID is required",
    },
  },
  isDefault: {
    in: "body",
    optional: true,
    isBoolean: {
      errorMessage: "isDefault must be a boolean",
    },
  },
};

export const processPaymentPayload = (req: Request) => ({
  paymentIntentId: req.body.paymentIntentId,
  paymentMethodId: req.body.paymentMethodId,
});

export const createPaymentIntentPayload = (req: Request) => ({
  amount: req.body.amount,
  currency: req.body.currency || "inr",
  paymentMethodId: req.body.paymentMethodId,
});

export const createPaymentMethodSchema: Schema = {
  testToken: {
    in: "body",
    isString: {
      errorMessage: "Test token must be a string",
    },
    notEmpty: {
      errorMessage: "Test token is required",
    },
  },
  isDefault: {
    in: "body",
    optional: true,
    isBoolean: {
      errorMessage: "isDefault must be a boolean",
    },
  },
};

export const savePaymentMethodPayload = (req: Request) => ({
  stripePaymentMethodId: req.body.stripePaymentMethodId,
  isDefault: req.body.isDefault || false,
});
