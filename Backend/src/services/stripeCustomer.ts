import { User, StripeCustomer } from "../models";
import StripeService from "./stripe";
import { Transaction } from "sequelize";

export class StripeCustomerService {
  static async getOrCreateStripeCustomer(
    userId: string,
    transaction?: Transaction,
    userEmail?: string,
    userProfile?: any,
  ) {
    // Check if user already has a Stripe customer
    let stripeCustomer = await StripeCustomer.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (stripeCustomer) {
      return stripeCustomer.stripe_customer_id;
    }

    // Use JWT data if available, otherwise fetch from database
    let email = userEmail;
    let profile = userProfile;

    if (!email) {
      const user = (await User.findByPk(userId, {
        include: [
          {
            model: require("../models/customerProfile").default,
            as: "customerProfile",
          },
        ],
        transaction,
      })) as any;

      if (!user) {
        throw new Error("User not found");
      }

      email = user.email;
      profile = user.customerProfile;
    }

    if (!email) {
      throw new Error("User email is required for Stripe customer creation");
    }

    // Create Stripe customer using JWT or database data
    const customerName =
      profile?.full_name ||
      (profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : null) ||
      email.split("@")[0];
    const stripeCustomerData = await StripeService.createCustomer(
      customerName,
      email,
    );

    // Save Stripe customer to database
    stripeCustomer = await StripeCustomer.create(
      {
        user_id: userId,
        stripe_customer_id: stripeCustomerData.id,
        email: email,
        phone: profile?.phone,
      },
      { transaction },
    );

    return stripeCustomer.stripe_customer_id;
  }

  static async getStripeCustomerId(userId: string) {
    const stripeCustomer = await StripeCustomer.findOne({
      where: { user_id: userId },
    });

    return stripeCustomer?.stripe_customer_id;
  }
}
