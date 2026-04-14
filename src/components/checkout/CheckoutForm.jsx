"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearCart } from "@/redux/slice/cartSlice";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ clientSecret, createIntent, setDiscountData, discountData, finalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const cart = useSelector((state) => state.cart.items);
  const shippingFee = useSelector((state) => state.cart.shippingFee);
  const deliveryDays = useSelector((state) => state.cart.deliveryDays);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
  });

  const handleApplyDiscount = async () => {
    if (!promoCode) {
      showErrorToast("Please enter a promo code");
      return;
    }
    setLoadingDiscount(true);
    try {
      const body = {
        code: promoCode,
        products: cart.map(item => ({
          _id: item._id,
          name: item.name,
          sku: item.sku,
          price: item.price,
          qty: item.qty
        }))
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/discount/validate`, body);
      if (res.data.success) {
        setDiscountData(res.data.data);
        showSuccessToast(res.data.message);
      } else {
        showErrorToast(res.data.message || "Invalid discount code");
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to validate discount");
    } finally {
      setLoadingDiscount(false);
    }
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      showErrorToast("Please fill in contact details");
      return;
    }
    if (!customer.street || !customer.city || !customer.state || !customer.zipCode) {
      showErrorToast("Please fill in shipping address");
      return;
    }

    setLoadingIntent(true);
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const intentBody = {
        amount: subtotal,
        discountCode: discountData?.code || "",
        products: cart.map(item => ({
          _id: item._id,
          name: item.name,
          sku: item.sku,
          price: item.price,
          qty: item.qty
        })),
        shippingCharges: shippingFee
      };

      await createIntent(intentBody);
      setShowModal(true);
    } catch (err) {
      // Error is handled in createIntent
    } finally {
      setLoadingIntent(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || loading) return;

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        showErrorToast(error.message);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        showErrorToast(confirmError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const body = {
          customer: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
          },
          address: {
            street: customer.street,
            city: customer.city,
            state: customer.state,
            postalCode: customer.zipCode,
            country: customer.country || "USA",
          },
          products: cart.map(item => ({
            _id: item._id,
            name: item.name,
            sku: item.sku,
            price: item.price,
            media: item.media,
            qty: item.qty
          })),
          deliveryDays: deliveryDays,
          payment: {
            stripePaymentIntentId: paymentIntent.id,
          },
          notes: orderNotes || "Order placed from website",
        };

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order`, body);
        dispatch(clearCart());
        showSuccessToast("Order placed successfully 🎉");
        setShowModal(false);
        router.push("/store");
      }
    } catch (err) {
      showErrorToast(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">Customer Information</h5>
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="First Name"
            name="firstName"
            value={customer.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Last Name"
            name="lastName"
            value={customer.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <input
        className="form-control mb-2"
        type="email"
        placeholder="Email Address"
        name="email"
        value={customer.email}
        onChange={handleChange}
      />
      <input
        className="form-control mb-4"
        placeholder="Phone Number"
        name="phone"
        value={customer.phone}
        onChange={handleChange}
      />

      <h5 className="fw-bold mb-3">Shipping Address</h5>
      <input
        className="form-control mb-2"
        placeholder="Street Address"
        name="street"
        value={customer.street}
        onChange={handleChange}
      />
      <div className="row g-2 mb-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="City"
            name="city"
            value={customer.city}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="State / Province"
            name="state"
            value={customer.state}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="ZIP / Postal Code"
            name="zipCode"
            value={customer.zipCode}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Country"
            name="country"
            value={customer.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <h5 className="fw-bold mt-4">Order Notes (Optional)</h5>
      <textarea
        className="form-control mb-4"
        placeholder="Add any instructions for your order..."
        rows="3"
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
      ></textarea>

      <h5 className="fw-bold mt-4">Add Discount Code</h5>
      <div className="d-flex gap-2 mb-4">
        <input
          className="form-control shadow-none"
          placeholder="ENTER CODE"
          value={promoCode}
          style={{ textTransform: "uppercase" }}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button
          className="btn btn-outline-danger px-4 fw-bold"
          onClick={handleApplyDiscount}
          disabled={loadingDiscount}
        >
          {loadingDiscount ? "..." : "APPLY"}
        </button>
      </div>

      <button
        className="btn btn-danger px-5 border-0 rounded-pill w-100 py-3 fw-bold shadow-sm"
        onClick={handleContinueToPayment}
        disabled={loadingIntent}
      >
        {loadingIntent ? "PREPARING SECURE PAYMENT..." : "CONTINUE TO PAYMENT"}
      </button>

      {/* Payment Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold mb-0">Secured Payment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted mb-4 small">Your payment information is encrypted and secure.</p>
                <div className="payment-box mb-4 p-3 border rounded-3 bg-light">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#32325d",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <button
                  className="btn btn-danger w-100 py-3 rounded-pill border-0 fw-bold shadow"
                  onClick={handleFinalSubmit}
                  disabled={!stripe || loading}
                >
                  {loading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      PROCESSING...
                    </div>
                  ) : (
                    `PAY $${finalAmount !== null ? finalAmount.toFixed(2) : (discountData ? discountData.finalTotal : (cart.reduce((s, i) => s + i.price * i.qty, 0) + shippingFee)).toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
