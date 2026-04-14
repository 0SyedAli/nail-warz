"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setShipping } from "@/redux/slice/cartSlice";

export default function OrderSummary() {
  const dispatch = useDispatch();

  const items = useSelector(state => state.cart.items);
  const shippingType = useSelector(state => state.cart.shippingType);
  const shippingFee = useSelector(state => state.cart.shippingFee);
  const deliveryDate = useSelector(state => state.cart.deliveryDate);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const isFree = subtotal >= 50;

  const handleShippingChange = (type) => {
    const days = type === "flat" ? 10 : 3;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (isFree && type === "flat") {
      dispatch(setShipping({ type, fee: 0, deliveryDate: dateString, deliveryDays: days }));
      return;
    }

    const fee = type === "flat" ? 7 : 30;
    dispatch(setShipping({ type, fee, deliveryDate: dateString, deliveryDays: days }));
  };

  // Set default shipping on mount if not set
  useEffect(() => {
    if (!deliveryDate) {
      handleShippingChange(shippingType || "flat");
    }
  }, []);

  // const total = subtotal + shippingFee;

  // const calculatedShippingFee = isFree
  //   ? 0
  //   : shippingType === "flat"
  //     ? 7
  //     : shippingType === "expedited"
  //       ? 30
  //       : 0;
  const calculatedShippingFee =
    shippingType === "expedited"
      ? 30
      : isFree
        ? 0
        : 7;

  const total = subtotal + calculatedShippingFee;
  return (
    <div className="order-summary">

      <h5 className="fw-bold mb-3">Order Summary</h5>

      <div className="d-flex justify-content-between mb-3">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping Selection */}
      <div className="mb-3">
        <p className="fw-semibold mb-2">Select Shipping</p>

        <div
          className="shipping-option"
          onClick={() => handleShippingChange("flat")}
        >
          <input
            type="radio"
            checked={shippingType === "flat"}
            readOnly
          />
          <div className="ms-2">
            <span>{isFree ? "Free Shipping" : "Flat Rate Shipping ($7.00)"}</span><br />
            <span className="small text-muted">
              Ships within 5–10 business days
            </span>
          </div>
        </div>

        <div
          className="shipping-option mt-2"
          onClick={() => handleShippingChange("expedited")}
        >
          <input
            type="radio"
            checked={shippingType === "expedited"}
            readOnly
          />
          <div className="ms-2">
            <span>Expedited Shipping ($30.00)</span><br />
            <span className="small text-muted">
              Ships within 2–3 business days
            </span>
          </div>
        </div>

        {/* {isFree && ( */}
        <div className="text-success fw-semibold mt-2">
          Orders over $50.00 ship free
        </div>
        {/* )} */}
      </div>

      <hr />

      {/* <div className="d-flex justify-content-between mb-2">
        <span>Delivery Fee</span>
        <span>{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
      </div>

      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div> */}
      <div className="d-flex justify-content-between mb-2">
        <span>Delivery Fee</span>
        <span>
          {calculatedShippingFee === 0 ? "FREE" : `$${calculatedShippingFee.toFixed(2)}`}
        </span>
      </div>

      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {deliveryDate && (
        <div className="mt-3 p-2 bg-light rounded text-center">
          <span className="small text-muted">Estimated Delivery:</span><br />
          <span className="fw-bold text-dark">{deliveryDate}</span>
        </div>
      )}

    </div>
  );
}
