import express from "express";
import { userRoutes } from "./routes/user";
import productRoutes from "./routes/product";

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api", productRoutes);

export default router;
