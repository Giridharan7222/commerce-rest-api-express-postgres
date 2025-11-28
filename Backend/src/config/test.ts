import { Sequelize } from "sequelize-typescript";
import User from "../models/users";
import CustomerProfile from "../models/customerProfile";
import AdminProfile from "../models/adminProfile";
import Address from "../models/address";
import Category from "../models/category";
import Product from "../models/product";
import ProductImage from "../models/productImage";
import CartItem from "../models/cartItem";
import Order from "../models/order";
import OrderItem from "../models/orderItem";
import Invoice from "../models/invoice";
import InvoiceLineItem from "../models/invoiceLineItem";
import PaymentTransaction from "../models/paymentTransaction";
import PaymentMethod from "../models/paymentMethod";
import StripeCustomer from "../models/stripeCustomer";
import Refund from "../models/refund";
import AdminActivityLog from "../models/adminActivityLog";
import ApiLog from "../models/apiLog";

const testSequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  models: [
    User,
    CustomerProfile,
    AdminProfile,
    Address,
    Category,
    Product,
    ProductImage,
    CartItem,
    Order,
    OrderItem,
    Invoice,
    InvoiceLineItem,
    PaymentTransaction,
    PaymentMethod,
    StripeCustomer,
    Refund,
    AdminActivityLog,
    ApiLog,
  ],
  logging: false,
});

export default testSequelize;
