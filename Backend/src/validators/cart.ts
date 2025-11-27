import { Schema } from "express-validator";
import { Request } from "express";
import { AddToCartDto, UpdateCartItemDto } from "../dtos/cart";

export const addToCartSchema: Schema = {
  productId: {
    in: "body",
    isUUID: {
      errorMessage: "Valid product ID is required",
    },
    notEmpty: {
      errorMessage: "Product ID is required",
    },
  },
  quantity: {
    in: "body",
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be a positive integer",
    },
    notEmpty: {
      errorMessage: "Quantity is required",
    },
  },
};

export const updateCartItemSchema: Schema = {
  quantity: {
    in: "body",
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be a positive integer",
    },
    notEmpty: {
      errorMessage: "Quantity is required",
    },
  },
};

export const addToCartPayload = (req: Request): AddToCartDto => ({
  productId: req.body.productId,
  quantity: req.body.quantity,
});

export const updateCartItemPayload = (req: Request): UpdateCartItemDto => ({
  quantity: req.body.quantity,
});
