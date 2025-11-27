import express from "express";
import { userRoutes } from "./routes/user";

const router = express.Router();

router.use("/api", userRoutes);

export default router;
