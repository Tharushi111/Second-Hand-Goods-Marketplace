import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * StripePaymentForm Component
 * Handles the online payment process for an order.
 */
export default function StripePaymentForm({ orderId, total, token, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // Triggered when user clicks "Pay Now"
  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Create PaymentIntent on backend
      const res = await axios.post(
        "http://localhost:5001/api/stripe/create-payment-intent",
        { amount: total, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = res.data.clientSecret;

      // Get card details from CardElement
      const cardElement = elements.getElement(CardElement);

      // Confirm payment with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      // Handle payment result
      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onPaymentSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow-xl max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        Pay Rs. {total.toLocaleString()}
      </h2>

      <div className="p-3 border-2 border-blue-200 rounded-xl mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-bold transition-all shadow-md"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
