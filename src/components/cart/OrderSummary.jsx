export default function OrderSummary() {
  return (
    <div className="order-summary">

      <h5 className="fw-bold mb-3">Order Summary</h5>

      <div className="d-flex justify-content-between mb-4">
        <span className="text-muted">Subtotal</span>
        <span className="fw-bold">$565</span>
      </div>

      <div className="d-flex justify-content-between mb-4">
        <span className="text-muted">Discount (-20%)</span>
        <span className="text-danger fw-bold">-$113</span>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <span className="text-muted">Delivery Fee</span>
        <span className="fw-bold">$15</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <span className="text-muted">Total</span>
        <span className="fw-bold">$467</span>
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control promo-input"
          placeholder="Add promo code"
        />
        <button className="btn btn-danger rounded-pill px-4">
          Apply
        </button>
      </div>

    </div>
  );
}
