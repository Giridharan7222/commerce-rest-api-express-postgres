import { Router } from "express";
import { checkSchema } from "express-validator";
import { StripeController } from "../controllers/stripe";
import { authenticateToken } from "../middleware/auth";
import {
  createCustomerSchema,
  createSetupIntentSchema,
} from "../validators/stripe";
import {
  processPaymentSchema,
  createPaymentIntentSchema,
} from "../validators/payment";

const router = Router();
const stripeController = new StripeController();

// Webhook endpoint should not require authentication
router.post("/webhooks", stripeController.handleWebhook);

// Apply authentication to all other routes
router.use(authenticateToken);

router.post("/customers", stripeController.createCustomer);
router.post("/setup-intents", stripeController.createSetupIntent);
router.post(
  "/payment-intents",
  checkSchema(createPaymentIntentSchema),
  stripeController.createPaymentIntent,
);
router.post(
  "/process-payment",
  checkSchema(processPaymentSchema),
  stripeController.processPayment,
);
router.get("/customers/:customerId/cards", stripeController.getCustomerCards);

export default router;
