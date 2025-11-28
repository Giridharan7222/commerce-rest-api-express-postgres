import { Schema } from "express-validator";
import { Request } from "express";
import { CreateOrderDto, UpdateOrderStatusDto } from "../dtos/order";
import { OrderStatus } from "../enums/order";

export const createOrderSchema: Schema = {
  "shippingAddress.full_name": {
    in: "body",
    isString: {
      errorMessage: "Full name must be a string",
    },
    notEmpty: {
      errorMessage: "Full name is required",
    },
  },
  "shippingAddress.phone": {
    in: "body",
    isString: {
      errorMessage: "Phone must be a string",
    },
    notEmpty: {
      errorMessage: "Phone is required",
    },
  },
  "shippingAddress.address_line1": {
    in: "body",
    isString: {
      errorMessage: "Address line 1 must be a string",
    },
    notEmpty: {
      errorMessage: "Address line 1 is required",
    },
  },
  "shippingAddress.city": {
    in: "body",
    isString: {
      errorMessage: "City must be a string",
    },
    notEmpty: {
      errorMessage: "City is required",
    },
  },
  "shippingAddress.state": {
    in: "body",
    isString: {
      errorMessage: "State must be a string",
    },
    notEmpty: {
      errorMessage: "State is required",
    },
  },
  "shippingAddress.pincode": {
    in: "body",
    isString: {
      errorMessage: "Pincode must be a string",
    },
    notEmpty: {
      errorMessage: "Pincode is required",
    },
  },
  "shippingAddress.country": {
    in: "body",
    isString: {
      errorMessage: "Country must be a string",
    },
    notEmpty: {
      errorMessage: "Country is required",
    },
  },
  paymentMethod: {
    in: "body",
    optional: true,
    isString: {
      errorMessage: "Payment method must be a string",
    },
  },
};

export const updateOrderStatusSchema: Schema = {
  status: {
    in: "body",
    isIn: {
      options: [Object.values(OrderStatus)],
      errorMessage: "Invalid order status",
    },
    notEmpty: {
      errorMessage: "Status is required",
    },
  },
};

export const createOrderPayload = (req: Request): CreateOrderDto => ({
  //
  shippingAddress: req.body.shippingAddress,
  paymentMethod: req.body.paymentMethod,
});

export const updateOrderStatusPayload = (
  req: Request,
): UpdateOrderStatusDto => ({
  status: req.body.status,
});
