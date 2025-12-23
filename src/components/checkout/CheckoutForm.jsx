"use client";

export default function CheckoutForm() {
  return (
    <div>

      {/* Contact / Shipping Info */}
      <div className="checkout-box mb-4">
        <div className="checkout-row">
          <span>Contact</span>
          <span>Example@gmail.com</span>
          <a href="#">Change</a>
        </div>

        <div className="checkout-row">
          <span>Ship To</span>
          <span>
            20 West Cote Drive Trackley Bradford, United Kingdom
          </span>
          <a href="#">Change</a>
        </div>

        <div className="checkout-row">
          <span>Method</span>
          <span>Product Name • $17.29</span>
          <a href="#">Change</a>
        </div>
      </div>

      {/* Shipping Method */}
      <h6 className="fw-bold mb-2">Shipping Method</h6>
      <p className="text-muted small mb-3">
        All Transactions Are Secure And Encrypted.
      </p>

      {/* Payment */}
      <div className="payment-box mb-4">
        <div className="payment-header">
          <span>Credit Card</span>
          <span className="card-badge"></span>
        </div>

        <input className="form-control checkout-input" placeholder="Card Number" />
        <input className="form-control checkout-input" placeholder="Name On Card" />

        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control checkout-input"
              placeholder="Expiration Date (MM / YY)"
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control checkout-input"
              placeholder="Security Code"
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <h6 className="fw-bold mb-2">Billing Address</h6>
      <p className="text-muted small mb-3">
        Select The Address That Matches Your Card Or Payment Method.
      </p>

      <div className="billing-box">
        <label className="billing-option">
          <input type="radio" name="post-packet" defaultChecked readOnly />
          <span>Canada Post Small Packet International Surface</span>
        </label>

        <label className="billing-option">
          <input type="radio" name="post-packet" />
          <span>Canada Post Small Packet International Surface</span>
        </label>
      </div>

      {/* Footer Actions */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <a href="#" className="text-muted">
          ← Return To Shipping
        </a>

        <button className="btn btn-danger px-5 rounded-pill">
          CONTINUE TO PAYMENT
        </button>
      </div>

    </div>
  );
}
