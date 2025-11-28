import express from "express";
import { userRoutes } from "./routes/user";
import productRoutes from "./routes/product";
import categoryRoutes from "./routes/category";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import stripeRoutes from "./routes/stripe";
import paymentMethodRoutes from "./routes/paymentMethod";

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api", productRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/stripe", stripeRoutes);
router.use("/api/payment-methods", paymentMethodRoutes);

export default router;
