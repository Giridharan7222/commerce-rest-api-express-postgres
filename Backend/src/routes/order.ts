import { Router } from "express";
import { checkSchema } from "express-validator";
import { OrderController } from "../controllers/order";
import { authenticateToken } from "../middleware/auth";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order";

const router = Router();

router.use(authenticateToken);

router.post("/", checkSchema(createOrderSchema), OrderController.createOrder);
router.get("/", OrderController.getOrderHistory);
router.get("/:orderId", OrderController.getOrderById);
router.patch("/:orderId/cancel", OrderController.cancelOrder);
router.patch("/:orderId/complete-payment", OrderController.completePayment);
router.patch(
  "/:orderId/status",
  checkSchema(updateOrderStatusSchema),
  OrderController.updateOrderStatus,
);

export default router;
