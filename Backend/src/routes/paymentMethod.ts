import { Router } from "express";
import { checkSchema } from "express-validator";
import { PaymentMethodController } from "../controllers/paymentMethod";
import { authenticateToken } from "../middleware/auth";
import { savePaymentMethodSchema } from "../validators/payment";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  checkSchema(savePaymentMethodSchema),
  PaymentMethodController.savePaymentMethod,
);
router.get("/", PaymentMethodController.getPaymentMethods);
router.delete("/:paymentMethodId", PaymentMethodController.deletePaymentMethod);

export default router;
