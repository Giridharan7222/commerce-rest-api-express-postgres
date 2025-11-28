import { Router } from "express";
import { checkSchema } from "express-validator";
import { PaymentMethodController } from "../controllers/paymentMethod";
import { authenticateToken } from "../middleware/auth";
import {
  savePaymentMethodSchema,
  createPaymentMethodSchema,
} from "../validators/payment";

const router = Router();

router.use(authenticateToken);

router.post(
  "/create",
  checkSchema(createPaymentMethodSchema),
  PaymentMethodController.createAndSavePaymentMethod,
);
router.post(
  "/",
  checkSchema(savePaymentMethodSchema),
  PaymentMethodController.savePaymentMethod,
);
router.get("/", PaymentMethodController.getPaymentMethods);
router.delete("/:paymentMethodId", PaymentMethodController.deletePaymentMethod);

export default router;
