import { Response } from "express";
import { CartService } from "../services/cart";
import { addToCartPayload, updateCartItemPayload } from "../validators/cart";
import { AuthRequest } from "../interfaces/auth";
import { handleValidationErrors } from "../utils/validation";

export class CartController {
  static async addToCart(req: AuthRequest, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const userId = req.user?.id;
      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const { productId, quantity } = addToCartPayload(req);
      const cartItem = await CartService.addToCart(userId, productId, quantity);
      return (res as any).success(
        "Product added to cart successfully",
        cartItem,
        201,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "CART_ERROR", null, 400);
    }
  }

  static async getCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const cartItems = await CartService.getCart(userId);
      const total = await CartService.getCartTotal(userId);

      return (res as any).success(
        "Cart retrieved successfully",
        {
          items: cartItems,
          total,
          itemCount: cartItems.length,
        },
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "CART_ERROR", null, 500);
    }
  }

  static async updateCartItem(req: AuthRequest, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { productId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      const { quantity } = updateCartItemPayload(req);
      const cartItem = await CartService.updateCartItem(
        userId,
        productId,
        quantity,
      );
      return (res as any).success(
        "Cart item updated successfully",
        cartItem,
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "CART_ERROR", null, 400);
    }
  }

  static async removeFromCart(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      await CartService.removeFromCart(userId, productId);
      return (res as any).success(
        "Product removed from cart successfully",
        null,
        200,
      );
    } catch (error: any) {
      return (res as any).fail(error.message, "CART_ERROR", null, 400);
    }
  }

  static async clearCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return (res as any).fail("Unauthorized", "UNAUTHORIZED", null, 401);
      }

      await CartService.clearCart(userId);
      return (res as any).success("Cart cleared successfully", null, 200);
    } catch (error: any) {
      return (res as any).fail(error.message, "CART_ERROR", null, 500);
    }
  }
}
