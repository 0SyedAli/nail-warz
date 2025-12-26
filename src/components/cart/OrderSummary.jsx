"use client";
import { useSelector } from "react-redux";

export default function OrderSummary() {
  const items = useSelector(state => state.cart.items);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.qty, 0
  );

  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div className="order-summary">

      <h5 className="fw-bold mb-3">Order Summary</h5>

      <div className="d-flex justify-content-between mb-4">
        <span className="text-muted">Subtotal</span>
        <span className="fw-bold">${subtotal.toFixed(2)}</span>
      </div>

      {/* <div className="d-flex justify-content-between mb-4">
        <span className="text-muted">Discount (-20%)</span>
        <span className="text-danger fw-bold">-$12</span>
      </div> */}

      <div className="d-flex justify-content-between mb-3">
        <span className="text-muted">Delivery Fee</span>
        <span className="fw-bold">${shipping}</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <span className="text-muted">Total</span>
        <span className="fw-bold">${total.toFixed(2)}</span>
      </div>

      {/* <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control promo-input"
          placeholder="Add promo code"
        />
        <button className="btn btn-danger rounded-pill px-4">
          Apply
        </button>
      </div> */}

    </div>
  );
}
