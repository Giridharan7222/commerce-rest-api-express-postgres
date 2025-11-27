import { CartItem, Product } from "../models";
import { Transaction } from "sequelize";

export class CartService {
  static async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    transaction?: Transaction,
  ) {
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const existingItem = await CartItem.findOne({
      where: { user_id: userId, product_id: productId },
      transaction,
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error("Insufficient stock");
      }

      return await existingItem.update(
        { quantity: newQuantity },
        { transaction },
      );
    }

    return await CartItem.create(
      {
        user_id: userId,
        product_id: productId,
        quantity,
        price_at_time: product.price,
      },
      { transaction },
    );
  }

  static async getCart(userId: string) {
    return await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "description",
            "price",
            "stock",
            "image_url",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  static async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
    transaction?: Transaction,
  ) {
    const cartItem = await CartItem.findOne({
      where: { user_id: userId, product_id: productId },
      transaction,
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    const product = await Product.findByPk(productId, { transaction });
    if (!product || product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    return await cartItem.update({ quantity }, { transaction });
  }

  static async removeFromCart(
    userId: string,
    productId: string,
    transaction?: Transaction,
  ) {
    const result = await CartItem.destroy({
      where: { user_id: userId, product_id: productId },
      transaction,
    });

    if (result === 0) {
      throw new Error("Cart item not found");
    }

    return result;
  }

  static async clearCart(userId: string, transaction?: Transaction) {
    return await CartItem.destroy({
      where: { user_id: userId },
      transaction,
    });
  }

  static async getCartTotal(userId: string) {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
    });

    return cartItems.reduce((total, item) => {
      return total + item.price_at_time * item.quantity;
    }, 0);
  }
}
