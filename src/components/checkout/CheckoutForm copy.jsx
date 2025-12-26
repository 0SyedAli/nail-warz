// "use client";

// export default function CheckoutForm() {
//   return (
//     <div>

//       {/* Contact / Shipping Info */}
//       <div className="checkout-box mb-4">
//         <div className="checkout-row">
//           <span>Contact</span>
//           <span>Example@gmail.com</span>
//           <a href="#">Change</a>
//         </div>

//         <div className="checkout-row">
//           <span>Ship To</span>
//           <span>
//             20 West Cote Drive Trackley Bradford, United Kingdom
//           </span>
//           <a href="#">Change</a>
//         </div>

//         <div className="checkout-row">
//           <span>Method</span>
//           <span>Product Name • $17.29</span>
//           <a href="#">Change</a>
//         </div>
//       </div>

//       {/* Shipping Method */}
//       <h6 className="fw-bold mb-2">Shipping Method</h6>
//       <p className="text-muted small mb-3">
//         All Transactions Are Secure And Encrypted.
//       </p>

//       {/* Payment */}
//       <div className="payment-box mb-4">
//         <div className="payment-header">
//           <span>Credit Card</span>
//           <span className="card-badge"></span>
//         </div>

//         <input className="form-control checkout-input" placeholder="Card Number" />
//         <input className="form-control checkout-input" placeholder="Name On Card" />

//         <div className="row g-3">
//           <div className="col-md-6">
//             <input
//               className="form-control checkout-input"
//               placeholder="Expiration Date (MM / YY)"
//             />
//           </div>
//           <div className="col-md-6">
//             <input
//               className="form-control checkout-input"
//               placeholder="Security Code"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Billing Address */}
//       <h6 className="fw-bold mb-2">Billing Address</h6>
//       <p className="text-muted small mb-3">
//         Select The Address That Matches Your Card Or Payment Method.
//       </p>

//       <div className="billing-box">
//         <label className="billing-option">
//           <input type="radio" name="post-packet" defaultChecked readOnly />
//           <span>Canada Post Small Packet International Surface</span>
//         </label>

//         <label className="billing-option">
//           <input type="radio" name="post-packet" />
//           <span>Canada Post Small Packet International Surface</span>
//         </label>
//       </div>

//       {/* Footer Actions */}
//       <div className="d-flex justify-content-between align-items-center mt-4">
//         <a href="#" className="text-muted">
//           ← Return To Shipping
//         </a>

//         <button className="btn btn-danger px-5 rounded-pill">
//           CONTINUE TO PAYMENT
//         </button>
//       </div>

//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
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

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    // 1️⃣ Create Stripe payment
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      alert(error.message);
      return;
    }

    const amount = cart.reduce((s, i) => s + i.price * i.qty, 0);

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
        stripePaymentId: paymentMethod.id,
        amount,
        currency: "usd",
        status: "succeed",
        paymentMethod: "card",
      },
      notes: "Order placed from website",
    };

    // 3️⃣ Send to backend
    await axios.post("/api/order", body);

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
        <CardElement />
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
