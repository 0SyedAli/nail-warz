"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearCart } from "@/redux/slice/cartSlice";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const customerId = user?._id || user?.id || "";

  const [customer, setCustomer] = useState({
    name: "",
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
        customer: customerId,
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
        customer: customerId,
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

          customer: customerId,
          address: {
            city: customer.city,
            state: customer.state,
            street: customer.street,
            postalCode: customer.zipCode,
            // country: customer.country
          },
          products: cart,
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
      <h5 className="fw-bold mb-3">Shipping Address</h5>

      {/* <input
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
      /> */}
      {/* <input
        className="form-control mb-2"
        placeholder="Phone Number"
        name="phone"
        onChange={handleChange}
      /> */}
      {/* <PatternFormat
        format="+1 (###) ###-####"
        mask="_"
        value={customer.phone}
        onValueChange={(values) => {
          setCustomer({
            ...customer,
            phone: values.formattedValue,
          });
        }}
        customInput="input"
        className="form-control mb-2"
        placeholder="+1 (123) 456-7890"
      /> */}


      <input
        className="form-control mb-2"
        placeholder="City"
        name="city"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        placeholder="State"
        name="state"
        onChange={handleChange}
      />
      <input
        className="form-control mb-2"
        placeholder="Street"
        name="street"
        onChange={handleChange}
      />
      <input
        className="form-control mb-3"
        placeholder="Zip Code"
        name="zipCode"
        onChange={handleChange}
      />

      <h5 className="fw-bold mt-4">Order Notes</h5>
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
          className="form-control"
          placeholder=""
          value={promoCode}
          style={{ textTransform: "uppercase" }}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button
          className="btn btn-outline-danger px-4"
          onClick={handleApplyDiscount}
          disabled={loadingDiscount}
        >
          {loadingDiscount ? "..." : "Apply"}
        </button>
      </div>

      <button
        className="btn btn-danger px-5 border-0 rounded-pill w-100 py-3 fw-bold"
        onClick={handleContinueToPayment}
        disabled={loadingIntent}
      >
        {loadingIntent ? "Preparing Payment..." : "CONTINUE TO PAYMENT"}
      </button>

      {/* Payment Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Secured Payment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted mb-4 small">Please enter your card details below to finalize your order.</p>
                <div className="payment-box mb-4 p-3 border rounded">
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
                  className="btn btn-danger w-100 py-3 rounded-pill border-0 fw-bold"
                  onClick={handleFinalSubmit}
                  disabled={!stripe || loading}
                >
                  {loading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      Processing...
                    </div>
                  ) : (
                    `PAY $${finalAmount !== null ? finalAmount.toFixed(2) : (discountData ? discountData.finalTotal : (cart.reduce((s, i) => s + i.price * i.qty, 0) + shippingFee))}`
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
