import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create PaymentIntent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "LKR", orderId } = req.body;

    // Check order exists
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents/lowest unit
      currency: currency.toLowerCase(),
      metadata: { orderId },
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe PaymentIntent creation failed" });
  }
};
