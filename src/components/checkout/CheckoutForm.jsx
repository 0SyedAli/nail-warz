"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement, PaymentElement } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearCart } from "@/redux/slice/cartSlice";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // 1️⃣ Create Stripe payment
    // const { paymentMethod, error } = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: elements.getElement(CardElement),
    // });
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("Payment successful :tada:");
    }

    // 2️⃣ Create Order API body
    const body = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: {
          street: customer.street,
          city: customer.city,
          country: customer.country,
        },
      },
      products: cart,
      payment: {
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: "card",
      },
      notes: "Order placed from website",
    };

    // 3️⃣ Send to backend
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order`, body);

    dispatch(clearCart());
    alert("Order placed successfully 🎉");
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">Customer Details</h5>

      <input
        className="form-control mb-2"
        placeholder="Full Name"
        name="name"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        placeholder="Phone"
        name="phone"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        placeholder="Street Address"
        name="street"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        placeholder="City"
        name="city"
        onChange={handleChange}
      />
      <input
        className="form-control mb-3"
        placeholder="Country"
        name="country"
        onChange={handleChange}
      />

      <h6 className="fw-bold mt-4">Payment</h6>
      <div className="payment-box mb-3">
        <PaymentElement />
      </div>

      <button
        className="btn btn-danger px-5 rounded-pill"
        onClick={handleSubmit}
      >
        CONTINUE TO PAYMENT
      </button>
    </div>
  );
}
