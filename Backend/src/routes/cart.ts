import { Router } from "express";
import { checkSchema } from "express-validator";
import { CartController } from "../controllers/cart";
import { authenticateToken } from "../middleware/auth";
import { addToCartSchema, updateCartItemSchema } from "../validators/cart";

const router = Router();

router.use(authenticateToken);

router.post("/", checkSchema(addToCartSchema), CartController.addToCart);
router.get("/", CartController.getCart);
router.put(
  "/:productId",
  checkSchema(updateCartItemSchema),
  CartController.updateCartItem,
);
router.delete("/:productId", CartController.removeFromCart);
router.delete("/", CartController.clearCart);

export default router;
