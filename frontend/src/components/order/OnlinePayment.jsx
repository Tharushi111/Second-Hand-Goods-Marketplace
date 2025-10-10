import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

// Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Stripe Payment Form Component
const StripePaymentForm = ({ orderId, total, token, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

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
      const cardElement = elements.getElement(CardNumberElement);
  
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
  
      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // Update order status in backend
        await axios.post(
          "http://localhost:5001/api/stripe/update-payment-status",
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success("Payment successful! 🎉");
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Pay Rs. {total.toLocaleString()}</h2>
      <CardElement className="p-4 border-2 border-blue-200 rounded-2xl" />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-2xl font-bold transition-all transform hover:scale-105 disabled:scale-100 shadow-lg flex justify-center gap-2"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

const OnlinePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!orderId || !total) {
      toast.error("Invalid payment session");
      navigate("/checkout");
    }
  }, [orderId, total, navigate]);

  const handlePaymentSuccess = () => {
    navigate("/order-confirmation", { state: { orderId, status: "paid", total } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <Elements stripe={stripePromise}>
          <StripePaymentForm orderId={orderId} total={total} token={token} onPaymentSuccess={handlePaymentSuccess} />
        </Elements>
      </div>
      <Footer />
    </div>
  );
};

export default OnlinePayment;
